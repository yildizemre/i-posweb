import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Users, Route } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../constants/brand'
import {
  PLATFORM_SUMMARY, PLATES,
  getTripsByPlatform, getTripsByPlate, Platform,
} from '../../data/mockTaxiData'
import s from './PlatformAnalyticsPage.module.css'

const maxTrips = Math.max(...PLATFORM_SUMMARY.map((p) => p.tripCount))

export default function PlatformAnalyticsPage() {
  const { isAdmin } = useAuth()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)

  if (isAdmin) return <Navigate to="/panel" replace />

  const plate = selectedPlate ? PLATES.find((p) => p.plate === selectedPlate) : null
  const platform = selectedPlatform ? PLATFORM_SUMMARY.find((p) => p.id === selectedPlatform) : null
  const platformTrips = selectedPlatform ? getTripsByPlatform(selectedPlatform) : []
  const plateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []

  const selectPlatform = (id: Platform) => {
    setSelectedPlate(null)
    setSelectedPlatform(selectedPlatform === id ? null : id)
  }

  const selectPlate = (plateId: string) => {
    setSelectedPlatform(null)
    setSelectedPlate(selectedPlate === plateId ? null : plateId)
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Platform İstatistikleri</div>
      <p className={s.hint}>Platform veya plakaya tıklayarak yolculuk detaylarını görün</p>

      <div className={s.platformGrid}>
        {PLATFORM_SUMMARY.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${s.platformCard} ${selectedPlatform === p.id ? s.platformActive : ''}`}
            style={{ borderTopColor: p.color }}
            onClick={() => selectPlatform(p.id)}
          >
            <div className={s.platformHeader}>
              <h3>{p.name}</h3>
              <span className={s.commissionBadge}>{p.tripCount} yolculuk</span>
            </div>
            <p className={s.bigAmount}>{p.tripCount}</p>
            <div className={s.platformStats}>
              <span><Users size={14} /> {p.customers} müşteri</span>
              <span>{p.plateCount} plaka</span>
              <span><Route size={14} /> {p.tripCount} yolculuk</span>
            </div>
            <div className={s.miniBar}>
              <div className={s.miniBarFill} style={{ width: `${(p.tripCount / maxTrips) * 100}%` }} />
            </div>
          </button>
        ))}
      </div>

      {platform && (
        <div className={s.tripPanel}>
          <h3>{platform.name} — Yolculuklar ({platformTrips.length})</h3>
          <TripList trips={platformTrips} showPlatform={false} hideAmounts />
        </div>
      )}

      <div className={s.chartCard}>
        <h3>Plaka Bazlı Yolculuklar</h3>
        <div className={s.plateChart}>
          {PLATES.map((p) => {
            const tripCount = getTripsByPlate(p.plate).length
            const maxPlateTrips = Math.max(...PLATES.map((pl) => getTripsByPlate(pl.plate).length))
            return (
              <button
                key={p.plate}
                type="button"
                className={`${s.plateBar} ${selectedPlate === p.plate ? s.plateActive : ''}`}
                onClick={() => selectPlate(p.plate)}
              >
                <div className={s.plateBarInner}>
                  <div className={s.plateBarFill} style={{ width: `${(tripCount / maxPlateTrips) * 100}%` }} />
                </div>
                <div className={s.plateInfo}>
                  <strong>{p.plate}</strong>
                  <span>{p.driver} · {PLATFORM_SUMMARY.find((x) => x.id === p.platform)?.name}</span>
                </div>
                <div className={s.plateRight}>
                  <strong>{tripCount}</strong>
                  <span>yolculuk</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {plate && (
        <div className={s.plateDetail}>
          <h3>{plate.plate} — {plate.driver}</h3>
          <div className={s.detailGrid}>
            <div className={s.detailItem}><span>Müşteri</span><strong>{plate.customers}</strong></div>
            <div className={s.detailItem}><span>Yolculuk</span><strong>{plateTrips.length}</strong></div>
            <div className={s.detailItem}><span>Platform</span><strong>{PLATFORM_SUMMARY.find((x) => x.id === plate.platform)?.name}</strong></div>
          </div>
          <h4 className={s.tripTitle}>Yolculuklar</h4>
          <TripList trips={plateTrips} showPlate={false} variant="dark" hideAmounts />
        </div>
      )}
    </>
  )
}
