import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, CreditCard, Banknote, Wallet, Car, Smartphone, Route, Tag, ArrowRight } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import CampaignCards from '../../components/dashboard/CampaignCards'
import { usePanelData } from '../../context/PanelDataContext'
import { APP_NAME, USER_NAME } from '../../constants/brand'
import {
  PLATFORM_SUMMARY, PAYMENT_TOTALS, PLATES, CASH_SETTLEMENTS,
  RECENT_TRIPS, TRIPS, getTripsByPlate, POS_DEVICES, formatMoney,
} from '../../data/mockTaxiData'
import s from './PanelHome.module.css'

const totalEarnings = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.earnings, 0)
const totalCommission = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.commissionTotal, 0)
const totalCustomers = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.customers, 0)
const paymentTotal = PAYMENT_TOTALS.card + PAYMENT_TOTALS.cash + PAYMENT_TOTALS.wallet
const totalBlocked = CASH_SETTLEMENTS.reduce((sum, x) => sum + x.blockedAmount, 0)
const maxPlatform = Math.max(...PLATFORM_SUMMARY.map((p) => p.earnings))
const topPlates = [...PLATES].sort((a, b) => b.earnings - a.earnings).slice(0, 4)
const assignedPos = POS_DEVICES.filter((d) => d.status === 'assigned').length

export default function PanelHome() {
  const { activeCampaigns } = usePanelData()
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const firstName = USER_NAME.split(' ')[0]
  const plate = selectedPlate ? PLATES.find((p) => p.plate === selectedPlate) : null
  const platformName = plate ? PLATFORM_SUMMARY.find((x) => x.id === plate.platform)?.name : ''
  const plateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Panel</div>

      <div className={s.hero}>
        <div>
          <p className={s.heroLabel}>Bugünkü Toplam Kazanç</p>
          <p className={s.heroAmount}>{formatMoney(totalEarnings)}</p>
          <p className={s.heroSub}>{totalCustomers} müşteri · {PLATES.length} aktif plaka</p>
        </div>
        <div className={s.heroStats}>
          <div><span>Komisyon</span><strong className={s.red}>{formatMoney(totalCommission)}</strong></div>
          <div><span>Net Kazanç</span><strong className={s.yellow}>{formatMoney(totalEarnings - totalCommission)}</strong></div>
          <div><span>Nakit Bloke</span><strong>{formatMoney(totalBlocked)}</strong></div>
        </div>
      </div>

      {activeCampaigns.length > 0 && (
        <div className={s.campaignBanner}>
          <div className={s.campaignBannerHead}>
            <h3><Tag size={18} /> Güncel Fırsatlar & Kampanyalar</h3>
            <Link to="/panel/firsatlar" className={s.campaignLink}>Tümünü Gör <ArrowRight size={14} /></Link>
          </div>
          <CampaignCards campaigns={activeCampaigns.slice(0, 3)} />
        </div>
      )}

      <div className={s.platformRow}>
        {PLATFORM_SUMMARY.map((p) => (
          <div key={p.id} className={s.platformMini}>
            <h4>{p.name}</h4>
            <p className={s.platformAmount}>{formatMoney(p.earnings)}</p>
            <div className={s.platformBar}>
              <div style={{ width: `${(p.earnings / maxPlatform) * 100}%` }} />
            </div>
            <span>{p.customers} müşteri · %{p.commissionRate} komisyon</span>
          </div>
        ))}
      </div>

      <div className={s.grid}>
        <div className={s.chartCard}>
          <h3>Ödeme Yöntemleri</h3>
          <div className={s.paymentList}>
            {[
              { label: 'Kredi Kartı', icon: CreditCard, amount: PAYMENT_TOTALS.card, cls: s.payCard },
              { label: 'Nakit', icon: Banknote, amount: PAYMENT_TOTALS.cash, cls: s.payCash },
              { label: 'Cüzdan', icon: Wallet, amount: PAYMENT_TOTALS.wallet, cls: s.payWallet },
            ].map(({ label, icon: Icon, amount, cls }) => (
              <div key={label} className={s.paymentItem}>
                <div className={`${s.payIcon} ${cls}`}><Icon size={18} /></div>
                <div className={s.payInfo}>
                  <span>{label}</span>
                  <div className={s.payBar}><div style={{ width: `${(amount / paymentTotal) * 100}%` }} /></div>
                </div>
                <strong>{formatMoney(amount)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={s.chartCard}>
          <h3>Platform Kazanç Grafiği</h3>
          <div className={s.barChart}>
            {PLATFORM_SUMMARY.map((p) => (
              <div key={p.id} className={s.barGroup}>
                <div className={s.barWrap}>
                  <div className={s.bar} style={{ height: `${(p.earnings / maxPlatform) * 100}%` }} />
                </div>
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.chartCard}>
          <h3>En Çok Kazanan Plakalar</h3>
          <p className={s.plateHint}>Yolculuklar için plakaya tıklayın</p>
          {topPlates.map((p) => (
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
              <strong>{formatMoney(p.earnings)}</strong>
            </button>
          ))}

          {plate && (
            <div className={s.plateDetail}>
              <h4>{plate.plate} — {plate.driver}</h4>
              <p className={s.platePlatform}>{platformName} · {plateTrips.length} yolculuk</p>
              <div className={s.detailGrid}>
                <div><span>Toplam</span><strong>{formatMoney(plate.earnings)}</strong></div>
                <div><span>Komisyon</span><strong className={s.red}>{formatMoney(plate.commission)}</strong></div>
                <div><span>Net</span><strong className={s.green}>{formatMoney(plate.earnings - plate.commission)}</strong></div>
                <div><span>Müşteri</span><strong>{plate.customers}</strong></div>
              </div>
              <TripList trips={plateTrips} showPlate={false} variant="dark" />
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
          <TripList trips={RECENT_TRIPS} showPlatform showPlate={false} />
        </div>
      </div>

      <p className={s.welcome}>Hoş geldiniz, {firstName}!</p>
    </>
  )
}
