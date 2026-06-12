import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Car, Smartphone, Route, Tag, ArrowRight, Percent, TrendingUp, MapPin } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import CampaignCards from '../../components/dashboard/CampaignCards'
import { usePanelData } from '../../context/PanelDataContext'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../context/ProfileContext'
import { APP_NAME } from '../../constants/brand'
import {
  PLATES, RECENT_TRIPS, TRIPS, getTripsByPlate,
  POS_DEVICES, PLATFORM_SUMMARY, formatMoney,
} from '../../data/mockTaxiData'
import { computeAdminSummary, getPlateAdminPay, getPlatesForPlatform } from '../../utils/platformStats'
import { buildFleetRows, computeCityStats } from '../../utils/fleetStats'
import s from './PanelHome.module.css'

const totalCustomers = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.customers, 0)
const assignedPos = POS_DEVICES.filter((d) => d.status === 'assigned').length

function AdminPanelHome() {
  const { activeCampaigns, platformSettings } = usePanelData()
  const { profile } = useProfile()
  const firstName = profile.name.split(' ')[0]
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)

  const adminSummary = computeAdminSummary(platformSettings)
  const fleetRows = buildFleetRows(platformSettings)
  const cityStats = computeCityStats(fleetRows)
  const totalAdminEarnings = adminSummary.reduce((sum, p) => sum + p.adminEarnings, 0)
  const totalCiro = fleetRows.reduce((sum, p) => sum + p.earnings, 0)
  const maxAdminPlatform = Math.max(...adminSummary.map((p) => p.adminEarnings), 1)

  const platformInfo = selectedPlatform ? adminSummary.find((p) => p.id === selectedPlatform) : null
  const platformPlates = selectedPlatform ? getPlatesForPlatform(selectedPlatform) : []
  const plate = selectedPlate ? PLATES.find((p) => p.plate === selectedPlate) : null
  const plateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []

  const selectPlatform = (id: string) => {
    setSelectedPlate(null)
    setSelectedPlatform(selectedPlatform === id ? null : id)
  }

  const selectPlate = (plateId: string) => {
    setSelectedPlate(selectedPlate === plateId ? null : plateId)
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Admin Panel</div>
      <div className={s.hero}>
        <div>
          <p className={s.heroLabel}>Toplam Admin Hakedişi</p>
          <p className={s.heroAmount}>{formatMoney(totalAdminEarnings)}</p>
          <p className={s.heroSub}>
            {adminSummary.length} platform · komisyon oranları ayarlardan yönetilir
          </p>
        </div>
        <div className={s.heroStats}>
          <div><span>Taksi</span><strong>{fleetRows.length}</strong></div>
          <div><span>Toplam Ciro</span><strong>{formatMoney(totalCiro)}</strong></div>
          <div><span>Şehir</span><strong>{cityStats.length}</strong></div>
        </div>
      </div>

      <div className={s.chartCard} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}><MapPin size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Şehir Özeti</h3>
          <Link to="/panel/taksi-filo" className={s.campaignLink}>Tüm Filo & Filtreler <ArrowRight size={14} /></Link>
        </div>
        <div className={s.platformRow}>
          {cityStats.slice(0, 4).map((c) => (
            <div key={c.city} className={s.platformMini}>
              <h4>{c.city}</h4>
              <p className={s.platformAmount}>{c.taxiCount} taksi</p>
              <div className={s.platformBar}>
                <div style={{ width: `${(c.totalCiro / totalCiro) * 100}%` }} />
              </div>
              <span>Ciro: {formatMoney(c.totalCiro)} · Admin: {formatMoney(c.totalAdminPay)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className={s.platformHint}>Platforma tıklayın — hangi taksilerden kazandığınızı görün</p>
      <div className={s.platformRow}>
        {adminSummary.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`${s.platformMiniBtn} ${selectedPlatform === p.id ? s.platformMiniActive : ''}`}
            onClick={() => selectPlatform(p.id)}
          >
            <h4>{p.name}</h4>
            <p className={s.platformAmount}>{formatMoney(p.adminEarnings)}</p>
            <div className={s.platformBar}>
              <div style={{ width: `${(p.adminEarnings / maxAdminPlatform) * 100}%` }} />
            </div>
            <span>{p.tripCount} yolculuk · {p.plateCount} plaka</span>
            <span className={s.platformMeta}>
              Hacim: {formatMoney(p.totalVolume)} · Platform %{p.platformCommissionRate} · Admin %{p.adminCommissionRate}
            </span>
          </button>
        ))}
      </div>

      {platformInfo && (
        <div className={s.chartCard} style={{ marginBottom: 20 }}>
          <h3>{platformInfo.name} — Taksi / Plaka Bazlı Admin Kazancı</h3>
          <p className={s.plateHint}>Plakaya tıklayarak yolculuk detaylarını görün</p>
          {platformPlates.map((p) => {
            const adminPay = getPlateAdminPay(p.earnings, platformInfo.adminCommissionRate)
            const trips = getTripsByPlate(p.plate).length
            return (
              <button
                key={p.plate}
                type="button"
                className={`${s.plateRow} ${selectedPlate === p.plate ? s.plateActive : ''}`}
                onClick={() => selectPlate(p.plate)}
              >
                <div>
                  <strong>{p.plate}</strong>
                  <span>{p.city} · {p.driver} · {trips} yolculuk · {p.customers} müşteri</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>{formatMoney(adminPay)}</strong>
                  <span className={s.platformMeta}>Hacim: {formatMoney(p.earnings)}</span>
                </div>
              </button>
            )
          })}
          {plate && plate.platform === selectedPlatform && (
            <div className={s.plateDetail}>
              <h4>{plate.plate} — {plate.driver}</h4>
              <p className={s.platePlatform}>
                {platformInfo.name} · {plateTrips.length} yolculuk · Admin payı: {formatMoney(getPlateAdminPay(plate.earnings, platformInfo.adminCommissionRate))}
              </p>
              <div className={s.detailGrid}>
                <div><span>Hacim</span><strong>{formatMoney(plate.earnings)}</strong></div>
                <div><span>Platform Komisyonu (%{platformInfo.platformCommissionRate})</span><strong className={s.red}>{formatMoney(Math.round(plate.earnings * platformInfo.platformCommissionRate / 100))}</strong></div>
                <div><span>Admin Payı (%{platformInfo.adminCommissionRate})</span><strong className={s.yellow}>{formatMoney(getPlateAdminPay(plate.earnings, platformInfo.adminCommissionRate))}</strong></div>
                <div><span>Müşteri</span><strong>{plate.customers}</strong></div>
              </div>
              <TripList trips={plateTrips} showPlate={false} variant="dark" />
            </div>
          )}
        </div>
      )}

      <div className={s.grid}>
        <div className={s.chartCard}>
          <h3><TrendingUp size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Platform Bazlı Admin Kazancı</h3>
          <div className={s.barChart}>
            {adminSummary.map((p) => (
              <div key={p.id} className={s.barGroup}>
                <div className={s.barWrap}>
                  <div className={s.bar} style={{ height: `${(p.adminEarnings / maxAdminPlatform) * 100}%` }} />
                </div>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.sidePanel}>
          <h3><Percent size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Komisyon Özeti</h3>
          <div className={s.statList}>
            {adminSummary.map((p) => (
              <div key={p.id} className={s.statItem}>
                <Car size={20} />
                <div>
                  <strong>{formatMoney(p.adminEarnings)}</strong>
                  <span>{p.name} · %{p.adminCommissionRate} admin payı</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/panel/taksi-filo" className={s.campaignLink} style={{ marginTop: 16, display: 'inline-flex' }}>
            Taksi Filosu & Ciro <ArrowRight size={14} />
          </Link>
          <Link to="/panel/komisyon-ayarlari" className={s.campaignLink} style={{ marginTop: 8, display: 'inline-flex' }}>
            Komisyon Ayarları <ArrowRight size={14} />
          </Link>
          <Link to="/panel/kampanya-yonetimi" className={s.campaignLink} style={{ marginTop: 8, display: 'inline-flex' }}>
            Kampanya Yönetimi <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {activeCampaigns.length > 0 && (
        <div className={s.campaignBanner}>
          <div className={s.campaignBannerHead}>
            <h3><Tag size={18} /> Yayında Olan Kampanyalar</h3>
            <Link to="/panel/kampanya-yonetimi" className={s.campaignLink}>Yönet <ArrowRight size={14} /></Link>
          </div>
          <CampaignCards campaigns={activeCampaigns.slice(0, 3)} />
        </div>
      )}

      <p className={s.welcome}>Hoş geldiniz, {firstName}!</p>
    </>
  )
}

function UserPanelHome() {
  const { activeCampaigns } = usePanelData()
  const { profile } = useProfile()
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const firstName = profile.name.split(' ')[0]
  const plate = selectedPlate ? PLATES.find((p) => p.plate === selectedPlate) : null
  const platformName = plate ? PLATFORM_SUMMARY.find((x) => x.id === plate.platform)?.name : ''
  const plateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []
  const maxTrips = Math.max(...PLATFORM_SUMMARY.map((p) => p.tripCount))

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Panel</div>
      <div className={s.hero}>
        <div>
          <p className={s.heroLabel}>Operasyon Özeti</p>
          <p className={s.heroAmount}>{TRIPS.length}</p>
          <p className={s.heroSub}>toplam yolculuk · {PLATES.length} aktif plaka · {totalCustomers} müşteri</p>
        </div>
        <div className={s.heroStats}>
          <div><span>POS Atanmış</span><strong>{assignedPos}/{POS_DEVICES.length}</strong></div>
          <div><span>Platform</span><strong>{PLATFORM_SUMMARY.length}</strong></div>
          <div><span>Kampanya</span><strong>{activeCampaigns.length}</strong></div>
        </div>
      </div>

      {activeCampaigns.length > 0 && (
        <div className={s.campaignBanner}>
          <div className={s.campaignBannerHead}>
            <h3><Tag size={18} /> Aktif Fırsatlar</h3>
            <Link to="/panel/firsatlar" className={s.campaignLink}>Tümünü Gör <ArrowRight size={14} /></Link>
          </div>
          <CampaignCards campaigns={activeCampaigns.slice(0, 3)} />
        </div>
      )}

      <div className={s.platformRow}>
        {PLATFORM_SUMMARY.map((p) => (
          <div key={p.id} className={s.platformMini}>
            <h4>{p.name}</h4>
            <p className={s.platformAmount}>{p.tripCount}</p>
            <div className={s.platformBar}>
              <div style={{ width: `${(p.tripCount / maxTrips) * 100}%` }} />
            </div>
            <span>{p.customers} müşteri · {p.plateCount} plaka · {p.tripCount} yolculuk</span>
          </div>
        ))}
      </div>

      <div className={s.grid}>
        <div className={s.chartCard}>
          <h3>Plakalar</h3>
          <p className={s.plateHint}>Yolculuklar için plakaya tıklayın</p>
          {PLATES.map((p) => (
            <button
              key={p.plate}
              type="button"
              className={`${s.plateRow} ${selectedPlate === p.plate ? s.plateActive : ''}`}
              onClick={() => setSelectedPlate(selectedPlate === p.plate ? null : p.plate)}
            >
              <div>
                <strong>{p.plate}</strong>
                <span>{p.driver} · {PLATFORM_SUMMARY.find((x) => x.id === p.platform)?.name}</span>
              </div>
              <strong>{getTripsByPlate(p.plate).length} yolculuk</strong>
            </button>
          ))}
          {plate && (
            <div className={s.plateDetail}>
              <h4>{plate.plate} — {plate.driver}</h4>
              <p className={s.platePlatform}>{platformName} · {plateTrips.length} yolculuk · {plate.customers} müşteri</p>
              <TripList trips={plateTrips} showPlate={false} variant="dark" hideAmounts />
            </div>
          )}
        </div>

        <div className={s.sidePanel}>
          <h3>Günlük Özet</h3>
          <div className={s.statList}>
            <div className={s.statItem}>
              <Route size={20} />
              <div><strong>{TRIPS.length}</strong><span>Toplam Yolculuk</span></div>
            </div>
            <div className={s.statItem}>
              <Car size={20} />
              <div><strong>{PLATES.length}</strong><span>Aktif Plaka</span></div>
            </div>
            <div className={s.statItem}>
              <Smartphone size={20} />
              <div><strong>{assignedPos}/{POS_DEVICES.length}</strong><span>POS Atanmış</span></div>
            </div>
            <div className={s.statItem}>
              <Users size={20} />
              <div><strong>{totalCustomers}</strong><span>Toplam Müşteri</span></div>
            </div>
          </div>
          <h3 className={s.subTitle}>Son Yolculuklar</h3>
          <TripList trips={RECENT_TRIPS} showPlatform showPlate={false} hideAmounts />
        </div>
      </div>

      <p className={s.welcome}>Hoş geldiniz, {firstName}!</p>
    </>
  )
}

export default function PanelHome() {
  const { isAdmin, isUser } = useAuth()
  if (isAdmin) return <AdminPanelHome />
  if (isUser) return <UserPanelHome />
  return <UserPanelHome />
}
