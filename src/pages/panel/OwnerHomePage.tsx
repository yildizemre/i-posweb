import { useMemo, useState } from 'react'
import { CreditCard, Calendar, MapPin, User, Wallet, Banknote } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import PlateSearchPicker from '../../components/dashboard/PlateSearchPicker'
import SubWalletAssignCard from '../../components/dashboard/SubWalletAssignCard'
import { useAuth } from '../../context/AuthContext'
import { usePanelData } from '../../context/PanelDataContext'
import {
  getTripsByPlate, formatMoney, PLATFORMS, WALLET_BY_PLATE,
} from '../../data/mockTaxiData'
import { buildFleetRows } from '../../utils/fleetStats'
import { getFleetPlates, sumFleetMainWallets } from '../../utils/fleetScope'
import { toPlatePickerItems } from '../../utils/platePicker'
import {
  filterTripsByDateRange, getTripDateBounds, getUniqueTripDates, tripLabelToInputDate,
} from '../../utils/tripFilters'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import fs from './AdminTaxiFleetPage.module.css'
import os from './OwnerHomePage.module.css'

export default function OwnerHomePage() {
  const { ownerId, isUser, user } = useAuth()
  const { platformSettings, getOwnerWallets, assignSubWalletDriver, ownerWalletGroups } = usePanelData()
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const [tripDateFrom, setTripDateFrom] = useState('')
  const [tripDateTo, setTripDateTo] = useState('')

  const fleetPlates = useMemo(
    () => getFleetPlates(isUser, ownerId),
    [isUser, ownerId],
  )

  const fleetPlateSet = useMemo(
    () => new Set(fleetPlates.map((p) => p.plate)),
    [fleetPlates],
  )

  const fleetRows = useMemo(
    () => buildFleetRows(platformSettings).filter((r) => fleetPlateSet.has(r.plate)),
    [platformSettings, fleetPlateSet],
  )

  const activePlate = selectedPlate ?? fleetPlates[0]?.plate ?? null
  const plateData = fleetPlates.find((p) => p.plate === activePlate)
  const fleetRow = fleetRows.find((r) => r.plate === activePlate)
  const walletOwnerKey = plateData?.owner ?? ownerId ?? ''

  const plateTrips = useMemo(
    () => (activePlate ? getTripsByPlate(activePlate) : []),
    [activePlate],
  )
  const filteredTrips = useMemo(
    () => filterTripsByDateRange(plateTrips, tripDateFrom, tripDateTo),
    [plateTrips, tripDateFrom, tripDateTo],
  )
  const tripBounds = useMemo(() => getTripDateBounds(plateTrips), [plateTrips])
  const tripDates = useMemo(() => getUniqueTripDates(plateTrips), [plateTrips])
  const walletGroup = useMemo(
    () => (walletOwnerKey ? getOwnerWallets(walletOwnerKey) : undefined),
    [getOwnerWallets, walletOwnerKey, ownerWalletGroups],
  )

  const assignedDrivers = useMemo(() => {
    const fromWallet = walletGroup?.subs
      .filter((sub) => sub.driver)
      .map((sub) => sub.driver!) ?? []
    if (fromWallet.length > 0) return fromWallet
    return plateData?.driver ? [plateData.driver] : []
  }, [walletGroup, plateData?.driver])

  const totalMainWalletBalance = useMemo(() => {
    if (!isUser) return walletGroup?.main.balance ?? 0
    return sumFleetMainWallets(fleetPlates, getOwnerWallets)
  }, [isUser, fleetPlates, getOwnerWallets, ownerWalletGroups, walletGroup])

  const totalCiro = fleetPlates.reduce((sum, p) => sum + p.earnings, 0)
  const totalTrips = fleetPlates.reduce((sum, p) => sum + getTripsByPlate(p.plate).length, 0)
  const displayName = isUser ? (user?.name ?? 'Emre Yıldız') : `Sahip ${ownerId}`
  const platePickerItems = useMemo(() => toPlatePickerItems(fleetPlates), [fleetPlates])

  if (fleetPlates.length === 0) {
    return (
      <div className={s.empty}>
        <p className={s.emptyTitle}>Araç bilgisi bulunamadı.</p>
      </div>
    )
  }

  return (
    <>
      <div className={s.breadcrumb}>
        {APP_NAME} &gt; {isUser ? 'Filo Paneli' : 'Taksi Sahibi Paneli'}
      </div>

      <div className={os.ownerHero}>
        <span className={os.ownerBadge}>{isUser ? 'Filo Sahibi' : `Taksi Sahibi ${ownerId}`}</span>
        <h2>Hoş geldiniz, {displayName}</h2>
        <p>
          {fleetPlates.length} plaka · toplam ciro {formatMoney(totalCiro)}
        </p>
      </div>

      <div className={os.statsRow}>
        <div className={os.statCard}><span>Plaka</span><strong>{fleetPlates.length}</strong></div>
        <div className={os.statCard}><span>Toplam Ciro</span><strong className={os.teal}>{formatMoney(totalCiro)}</strong></div>
        <div className={os.statCard}><span>Yolculuk</span><strong>{totalTrips}</strong></div>
        <div className={os.statCard}>
          <span>{isUser ? 'Toplam Ana Cüzdan' : 'Ana Cüzdan'}</span>
          <strong>{formatMoney(totalMainWalletBalance)}</strong>
        </div>
      </div>

      {fleetPlates.length > 1 && (
        <PlateSearchPicker
          plates={platePickerItems}
          selectedPlate={activePlate}
          onSelect={(plate) => {
            setSelectedPlate(plate)
            setTripDateFrom('')
            setTripDateTo('')
          }}
          label="Plaka Ara"
          hint={isUser ? `${fleetPlates.length} plaka — arama ile hızlıca bulun` : undefined}
        />
      )}

      {plateData && fleetRow && (
        <div className={os.plateCard}>
          <div className={os.plateHead}>
            <div>
              <h3>{plateData.plate}</h3>
              <p>
                <MapPin size={14} style={{ verticalAlign: 'middle' }} /> {plateData.city} ·{' '}
                {PLATFORMS.find((x) => x.id === plateData.platform)?.name}
                {isUser
                  ? <> · Sahibi {displayName}</>
                  : assignedDrivers.length > 0 && (
                    <> · {assignedDrivers.length === 1
                      ? `Sürücü ${assignedDrivers[0]}`
                      : `${assignedDrivers.length} sürücü`}
                    </>
                  )}
              </p>
            </div>
            <div className={os.plateMeta}>
              <strong>{formatMoney(plateData.earnings)}</strong>
              <span>Ciro</span>
            </div>
          </div>

          <div className={os.grid2}>
            {isUser ? (
              <div className={os.infoBox}>
                <span><User size={12} /> Sahibi</span>
                <strong>{displayName}</strong>
              </div>
            ) : (
              <div className={os.infoBox}>
                <span>
                  <User size={12} /> Sürücü{assignedDrivers.length > 1 ? 'ler' : ''}
                  {assignedDrivers.length > 0 && ` (${assignedDrivers.length})`}
                </span>
                {assignedDrivers.length === 0 ? (
                  <strong className={os.driverEmpty}>Atanmadı</strong>
                ) : assignedDrivers.length === 1 ? (
                  <strong>{assignedDrivers[0]}</strong>
                ) : (
                  <ul className={os.driverList}>
                    {assignedDrivers.map((name) => (
                      <li key={name}><strong>{name}</strong></li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <div className={os.infoBox}>
              <span><Wallet size={12} /> Ana Cüzdan</span>
              <strong>{walletGroup?.main.walletId ?? WALLET_BY_PLATE[plateData.plate] ?? '—'}</strong>
            </div>
            <div className={os.infoBox}>
              <span>Alt Cüzdanlar (3 şoför)</span>
              <strong>
                {walletGroup
                  ? `${walletGroup.subs.filter((w) => w.driver).length}/3 atanmış`
                  : '—'}
              </strong>
            </div>
            <div className={os.infoBox}>
              <span>Yolculuk / Müşteri</span>
              <strong>{plateTrips.length} yolculuk · {plateData.customers} müşteri</strong>
            </div>
          </div>

          <div className={os.paymentCards}>
            <div className={`${os.payCard} ${os.payCardCredit}`}>
              <CreditCard size={22} />
              <span>Kart</span>
              <strong>{formatMoney(plateData.card)}</strong>
            </div>
            <div className={`${os.payCard} ${os.payCardCash}`}>
              <Banknote size={22} />
              <span>Nakit</span>
              <strong>{formatMoney(plateData.cash)}</strong>
            </div>
            <div className={`${os.payCard} ${os.payCardWallet}`}>
              <Wallet size={22} />
              <span>Cüzdan</span>
              <strong>{formatMoney(plateData.wallet)}</strong>
            </div>
          </div>

          {walletGroup && (
            <div className={os.subWalletRow}>
              {walletGroup.subs.map((sub) => (
                <div
                  key={sub.walletId}
                  className={`${os.subWalletChip} ${!sub.driver ? os.subWalletChipEmpty : ''}`}
                >
                  <span className={os.subWalletLabel}>Alt Cüzdan {sub.slotIndex}</span>
                  <strong>{sub.walletId}</strong>
                  {sub.driver ? (
                    <>
                      <span>{sub.driver}</span>
                      {sub.driverTc && <small className={os.subDriverMeta}>TC: {sub.driverTc}</small>}
                      {sub.driverPhone && <small className={os.subDriverMeta}>{sub.driverPhone}</small>}
                      {sub.driverWalletId && <small className={os.subDriverWallet}>{sub.driverWalletId}</small>}
                    </>
                  ) : (
                    <SubWalletAssignCard
                      sub={sub}
                      onAssign={assignSubWalletDriver}
                      compact
                    />
                  )}
                  <em>{formatMoney(sub.balance)}</em>
                </div>
              ))}
            </div>
          )}

          {fleetRow.posId ? (
            <div className={fs.posDetail}>
              <h4><CreditCard size={16} /> Banka POS — {fleetRow.bankName}</h4>
              <div className={fs.posDetailGrid}>
                <div><span>POS</span><strong>{fleetRow.posId}</strong><small>{fleetRow.posSerial}</small></div>
                <div><span>Sürücü Oranı</span><strong className={fs.bankOut}>%{fleetRow.driverRate?.toFixed(1)}</strong></div>
                <div><span>Atama</span><strong>{fleetRow.posAssignedAt}</strong></div>
                <div><span>Kart Cirosu</span><strong>{formatMoney(fleetRow.cardVolume)}</strong></div>
              </div>
            </div>
          ) : (
            <div className={fs.noPosBox}>
              <CreditCard size={18} />
              <p>Bu araca henüz banka POS atanmamış.</p>
            </div>
          )}

          <div className={os.tripSection}>
            <h4><Calendar size={16} /> Yolculuklar</h4>
            <div className={fs.tripFilterSection}>
              <div className={fs.tripFilterRow}>
                <label className={fs.dateField}>
                  <span>Başlangıç</span>
                  <input type="date" value={tripDateFrom} min={tripBounds.min} max={tripBounds.max}
                    onChange={(e) => setTripDateFrom(e.target.value)} />
                </label>
                <label className={fs.dateField}>
                  <span>Bitiş</span>
                  <input type="date" value={tripDateTo} min={tripDateFrom || tripBounds.min} max={tripBounds.max}
                    onChange={(e) => setTripDateTo(e.target.value)} />
                </label>
                <div className={fs.tripFilterResult}>
                  <strong>{filteredTrips.length}</strong>
                  <span>yolculuk</span>
                </div>
              </div>
              {tripDates.length > 0 && (
                <div className={fs.quickDates}>
                  <span>Hızlı:</span>
                  {tripDates.map((d) => (
                    <button key={d} type="button" className={fs.quickDateBtn}
                      onClick={() => { const iso = tripLabelToInputDate(d); setTripDateFrom(iso); setTripDateTo(iso) }}>
                      {d}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <TripList trips={filteredTrips} showPlate={false}
              emptyText="Seçilen tarihte yolculuk yok." />
          </div>
        </div>
      )}
    </>
  )
}
