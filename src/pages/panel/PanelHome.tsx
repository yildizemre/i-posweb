import { Link } from 'react-router-dom'
import { Users, CreditCard, Banknote, Wallet, Car, ArrowRight } from 'lucide-react'
import { APP_NAME, USER_NAME } from '../../constants/brand'
import {
  PLATFORM_SUMMARY, PAYMENT_TOTALS, PLATES, CASH_SETTLEMENTS, formatMoney,
} from '../../data/mockTaxiData'
import s from './PanelHome.module.css'

const totalEarnings = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.earnings, 0)
const totalCommission = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.commission, 0)
const totalCustomers = PLATFORM_SUMMARY.reduce((sum, p) => sum + p.customers, 0)
const paymentTotal = PAYMENT_TOTALS.card + PAYMENT_TOTALS.cash + PAYMENT_TOTALS.wallet
const totalBlocked = CASH_SETTLEMENTS.reduce((sum, x) => sum + x.blockedAmount, 0)
const maxPlatform = Math.max(...PLATFORM_SUMMARY.map((p) => p.earnings))

export default function PanelHome() {
  const firstName = USER_NAME.split(' ')[0]

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

      <div className={s.platformRow}>
        {PLATFORM_SUMMARY.map((p) => (
          <div key={p.id} className={s.platformMini}>
            <h4>{p.name}</h4>
            <p className={s.platformAmount}>{formatMoney(p.earnings)}</p>
            <div className={s.platformBar}>
              <div style={{ width: `${(p.earnings / maxPlatform) * 100}%` }} />
            </div>
            <span>{p.customers} müşteri · %{p.commission} komisyon</span>
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
          {[...PLATES].sort((a, b) => b.earnings - a.earnings).slice(0, 4).map((p) => (
            <div key={p.plate} className={s.plateRow}>
              <div>
                <strong>{p.plate}</strong>
                <span>{p.driver}</span>
              </div>
              <strong>{formatMoney(p.earnings)}</strong>
            </div>
          ))}
        </div>

        <div className={s.quickLinks}>
          <h3>Hızlı Erişim</h3>
          <Link to="/panel/platformlar" className={s.quickLink}>
            <Car size={20} /> Platform Kazançları <ArrowRight size={16} />
          </Link>
          <Link to="/panel/nakit-hakedis" className={s.quickLink}>
            <Banknote size={20} /> Nakit Hakediş <ArrowRight size={16} />
          </Link>
          <Link to="/panel/pos-atama" className={s.quickLink}>
            <Users size={20} /> POS Atama <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <p className={s.welcome}>Hoş geldiniz, {firstName}!</p>
    </>
  )
}
