import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Calendar, CreditCard, Banknote, Wallet, Route, TrendingUp } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import PlateSearchPicker from '../../components/dashboard/PlateSearchPicker'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../constants/brand'
import { getTripsByPlate, Platform } from '../../data/mockTaxiData'
import { getFleetPlates } from '../../utils/fleetScope'
import { toPlatePickerItems } from '../../utils/platePicker'
import {
  filterTripsByDateRange, getTripDateBounds, getUniqueTripDates, tripLabelToInputDate,
} from '../../utils/tripFilters'
import { aggregatePlateByPlatform, sumTripPayments, formatMoney } from '../../utils/platePlatformStats'
import fs from './AdminTaxiFleetPage.module.css'
import s from './PlatformAnalyticsPage.module.css'

export default function PlatformAnalyticsPage() {
  const { isAdmin, isUser, ownerId } = useAuth()
  const fleetPlates = useMemo(() => getFleetPlates(isUser, ownerId), [isUser, ownerId])
  const platePickerItems = useMemo(() => toPlatePickerItems(fleetPlates), [fleetPlates])

  const [selectedPlate, setSelectedPlate] = useState<string | null>(fleetPlates[0]?.plate ?? null)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const plateData = fleetPlates.find((p) => p.plate === selectedPlate)
  const allPlateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []
  const filteredTrips = useMemo(
    () => filterTripsByDateRange(allPlateTrips, dateFrom, dateTo),
    [allPlateTrips, dateFrom, dateTo],
  )
  const tripBounds = useMemo(() => getTripDateBounds(allPlateTrips), [allPlateTrips])
  const tripDates = useMemo(() => getUniqueTripDates(allPlateTrips), [allPlateTrips])
  const platformStats = useMemo(
    () => aggregatePlateByPlatform(filteredTrips),
    [filteredTrips],
  )
  const totals = useMemo(() => sumTripPayments(filteredTrips), [filteredTrips])
  const maxPlatformTrips = Math.max(...platformStats.map((p) => p.tripCount), 1)

  const activePlatform = selectedPlatform
    ? platformStats.find((p) => p.platformId === selectedPlatform)
    : null

  if (isAdmin) return <Navigate to="/panel" replace />

  const selectPlate = (plateId: string) => {
    setSelectedPlate(plateId)
    setSelectedPlatform(null)
    setDateFrom('')
    setDateTo('')
  }

  const selectPlatform = (id: Platform) => {
    setSelectedPlatform(selectedPlatform === id ? null : id)
  }

  const clearDates = () => {
    setDateFrom('')
    setDateTo('')
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Platform İstatistikleri</div>
      <p className={s.hint}>
        Plaka seçin, tarih aralığı girin — Uber, Yandex ve diğer platformlardan toplam ciro ve yolculukları görün.
      </p>

      <PlateSearchPicker
        plates={platePickerItems}
        selectedPlate={selectedPlate}
        onSelect={selectPlate}
        label="Plaka Ara"
        hint="Plaka seçin, tarih aralığı ile platform cirolarını görün"
      />

      {selectedPlate && plateData && (
        <>
          <div className={s.filterCard}>
            <h3><Calendar size={16} /> Tarih Aralığı — {selectedPlate}</h3>
            <div className={fs.tripFilterRow}>
              <label className={fs.dateField}>
                <span>Başlangıç</span>
                <input
                  type="date"
                  value={dateFrom}
                  min={tripBounds.min}
                  max={tripBounds.max}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </label>
              <label className={fs.dateField}>
                <span>Bitiş</span>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom || tripBounds.min}
                  max={tripBounds.max}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </label>
              <div className={fs.tripFilterResult}>
                <strong>{filteredTrips.length}</strong>
                <span>yolculuk</span>
              </div>
              {(dateFrom || dateTo) && (
                <button type="button" className={s.clearDatesBtn} onClick={clearDates}>
                  Tarihi temizle
                </button>
              )}
            </div>
            {tripDates.length > 0 && (
              <div className={fs.quickDates}>
                <span>Hızlı:</span>
                {tripDates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={fs.quickDateBtn}
                    onClick={() => {
                      const iso = tripLabelToInputDate(d)
                      setDateFrom(iso)
                      setDateTo(iso)
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={s.summaryHero}>
            <div className={s.summaryMain}>
              <span className={s.summaryLabel}>Toplam Ciro</span>
              <strong className={s.summaryCiro}>{formatMoney(totals.total)}</strong>
              <span className={s.summarySub}>
                {selectedPlate} · {filteredTrips.length} yolculuk
                {(dateFrom || dateTo) && ' · seçili tarih aralığı'}
              </span>
            </div>
            <div className={s.summaryPayments}>
              <div className={s.payItem}>
                <CreditCard size={18} />
                <div>
                  <strong>{formatMoney(totals.card)}</strong>
                  <span>Kart</span>
                </div>
              </div>
              <div className={s.payItem}>
                <Banknote size={18} />
                <div>
                  <strong>{formatMoney(totals.cash)}</strong>
                  <span>Nakit</span>
                </div>
              </div>
              <div className={s.payItem}>
                <Wallet size={18} />
                <div>
                  <strong>{formatMoney(totals.wallet)}</strong>
                  <span>Cüzdan</span>
                </div>
              </div>
            </div>
          </div>

          <p className={s.sectionHint}>Platforma tıklayın — bu plakanın yolculuk detaylarını görün</p>
          <div className={s.platformGrid}>
            {platformStats.map((p) => (
              <button
                key={p.platformId}
                type="button"
                className={`${s.platformCard} ${selectedPlatform === p.platformId ? s.platformActive : ''} ${p.tripCount === 0 ? s.platformEmpty : ''}`}
                style={{ borderTopColor: p.color }}
                onClick={() => p.tripCount > 0 && selectPlatform(p.platformId)}
                disabled={p.tripCount === 0}
              >
                <div className={s.platformHeader}>
                  <h3>{p.name}</h3>
                  <span className={s.commissionBadge}>{p.tripCount} yolculuk</span>
                </div>
                <p className={s.bigAmount}>{formatMoney(p.totalCiro)}</p>
                <div className={s.platformStats}>
                  <span><Route size={14} /> {p.tripCount} yolculuk</span>
                  <span><TrendingUp size={14} /> Ciro</span>
                </div>
                {p.tripCount > 0 && (
                  <div className={s.platformPayments}>
                    <span>Kart {formatMoney(p.card)}</span>
                    <span>Nakit {formatMoney(p.cash)}</span>
                    <span>Cüzdan {formatMoney(p.wallet)}</span>
                  </div>
                )}
                <div className={s.miniBar}>
                  <div
                    className={s.miniBarFill}
                    style={{ width: `${(p.tripCount / maxPlatformTrips) * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>

          {activePlatform && activePlatform.tripCount > 0 && (
            <div className={s.tripPanel}>
              <h3>
                {activePlatform.name} — {selectedPlate} Yolculukları ({activePlatform.tripCount})
              </h3>
              <p className={s.tripPanelSub}>
                Ciro: <strong>{formatMoney(activePlatform.totalCiro)}</strong>
                {' · '}Kart {formatMoney(activePlatform.card)}
                {' · '}Nakit {formatMoney(activePlatform.cash)}
                {' · '}Cüzdan {formatMoney(activePlatform.wallet)}
              </p>
              <TripList trips={activePlatform.trips} showPlatform={false} />
            </div>
          )}

          {!selectedPlatform && filteredTrips.length > 0 && (
            <div className={s.tripPanel}>
              <h3>{selectedPlate} — Tüm Platformlar ({filteredTrips.length} yolculuk)</h3>
              <TripList trips={filteredTrips} showPlatform />
            </div>
          )}

          {filteredTrips.length === 0 && (
            <div className={s.emptyFilter}>
              <p>Seçilen plaka ve tarih aralığında yolculuk bulunamadı.</p>
            </div>
          )}
        </>
      )}
    </>
  )
}
