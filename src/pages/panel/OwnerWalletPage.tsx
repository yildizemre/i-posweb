import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Wallet, User, Car, ArrowDown } from 'lucide-react'
import SubWalletAssignCard, { SubWalletStatusBadge } from '../../components/dashboard/SubWalletAssignCard'
import PlateSearchPicker from '../../components/dashboard/PlateSearchPicker'
import { useAuth } from '../../context/AuthContext'
import { usePanelData } from '../../context/PanelDataContext'
import { formatMoney, PLATFORMS } from '../../data/mockTaxiData'
import { getFleetPlates } from '../../utils/fleetScope'
import { toPlatePickerItems } from '../../utils/platePicker'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import ws from './WalletsPage.module.css'
import ow from './OwnerWalletPage.module.css'

export default function OwnerWalletPage() {
  const { ownerId, isUser, user } = useAuth()
  const [searchParams] = useSearchParams()
  const { getOwnerWallets, assignSubWalletDriver, ownerWalletGroups } = usePanelData()
  const fleetPlates = useMemo(
    () => getFleetPlates(isUser, ownerId),
    [isUser, ownerId],
  )
  const platePickerItems = useMemo(() => toPlatePickerItems(fleetPlates), [fleetPlates])
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)

  const plateFromUrl = searchParams.get('plaka')

  useEffect(() => {
    if (plateFromUrl && fleetPlates.some((p) => p.plate === plateFromUrl)) {
      setSelectedPlate(plateFromUrl)
    }
  }, [plateFromUrl, fleetPlates])

  const activePlate = selectedPlate ?? fleetPlates[0]?.plate ?? null
  const plateData = fleetPlates.find((p) => p.plate === activePlate)
  const walletOwnerKey = plateData?.owner ?? ownerId ?? ''

  const group = useMemo(
    () => (walletOwnerKey ? getOwnerWallets(walletOwnerKey) : undefined),
    [getOwnerWallets, walletOwnerKey, ownerWalletGroups],
  )

  const displayName = isUser ? (user?.name ?? 'Emre Yıldız') : `Sahip ${ownerId}`

  if (!group || !plateData) {
    return (
      <div className={s.empty}>
        <p className={s.emptyTitle}>Cüzdan bilgisi bulunamadı.</p>
      </div>
    )
  }

  const platformName = PLATFORMS.find((p) => p.id === group.platform)?.name ?? group.platform
  const subTotal = group.subs.reduce((sum, w) => sum + w.balance, 0)
  const grandTotal = group.main.balance + subTotal
  const assignedCount = group.subs.filter((w) => w.driver).length
  const emptyCount = group.subs.filter((w) => !w.driver).length

  const selectPlate = (plate: string) => {
    setSelectedPlate(plate)
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Cüzdanım</div>

      {fleetPlates.length > 1 && (
        <PlateSearchPicker
          plates={platePickerItems}
          selectedPlate={activePlate}
          onSelect={selectPlate}
          label="Plaka Ara"
          hint={isUser ? `${displayName} — ${fleetPlates.length} plaka` : `${fleetPlates.length} plaka`}
        />
      )}

      <div className={ws.stats}>
        <div className={ws.stat}>
          <Wallet size={24} />
          <div><strong>{formatMoney(grandTotal)}</strong><span>Toplam Bakiye</span></div>
        </div>
        <div className={ws.stat}>
          <Car size={24} />
          <div><strong>{group.plate}</strong><span>Plaka</span></div>
        </div>
        <div className={ws.stat}>
          <User size={24} />
          <div><strong>{assignedCount}/3</strong><span>Şoför Alt Cüzdanı</span></div>
        </div>
        {isUser && (
          <div className={ws.stat}>
            <User size={24} />
            <div><strong>{displayName}</strong><span>Sahibi</span></div>
          </div>
        )}
      </div>

      <div className={ow.flowHint}>
        <Wallet size={16} />
        <span>1 ana cüzdan</span>
        <span className={ow.flowArrow}>→</span>
        <span>3 alt cüzdan (şoför başına)</span>
        <span className={ow.flowArrow}>→</span>
        <span>
          {emptyCount > 0
            ? `${emptyCount} boş slota şoför atayın (Ad Soyad, TC, Telefon, Cüzdan No)`
            : 'Tüm şoför slotları dolu'}
        </span>
      </div>

      <div className={ow.mainCard}>
        <div className={ow.mainCardTop}>
          <div>
            <span className={ow.mainBadge}>ANA CÜZDAN</span>
            <h2>
              {isUser
                ? `${group.plate} — ${displayName}`
                : `Sahip ${group.ownerId} — Merkez Hesap`}
            </h2>
            <p className={ow.mainWalletId}>{group.main.walletId}</p>
          </div>
          <div className={ow.mainBalance}>
            {formatMoney(group.main.balance)}
            <span>Ana bakiye</span>
          </div>
        </div>
        <div className={ow.mainMeta}>
          <span><Car size={14} style={{ verticalAlign: 'middle' }} /> {group.plate}</span>
          {isUser && <span>Sahibi: {displayName}</span>}
          <span>{platformName}</span>
          <span>Açılış: {group.main.createdAt}</span>
        </div>
      </div>

      <div className={ow.subSection}>
        <h3><ArrowDown size={18} style={{ verticalAlign: 'middle' }} /> Alt Cüzdanlar (3 Şoför)</h3>
        <p>Her şoföre ayrı alt cüzdan — boş kartlarda <strong>Şoför Ata</strong> ile ad soyad, TC, telefon ve cüzdan no girin.</p>

        <div className={ow.subGrid}>
          {group.subs.map((sub) => (
            <div
              key={sub.walletId}
              className={`${ow.subCard} ${sub.driver ? ow.subCardAssigned : ow.subCardEmpty}`}
            >
              <div className={ow.subCardTop}>
                <span className={ow.subSlot}>Alt Cüzdan {sub.slotIndex}</span>
                <SubWalletStatusBadge assigned={!!sub.driver} />
              </div>
              <p className={ow.subWalletId}>{sub.walletId}</p>
              <SubWalletAssignCard sub={sub} onAssign={assignSubWalletDriver} />
              <p className={ow.subPlate}>{group.plate} · {platformName}</p>
              <p className={ow.subBalance}>{formatMoney(sub.balance)}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
