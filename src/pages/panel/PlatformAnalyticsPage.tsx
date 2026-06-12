import { useState } from 'react'
import { Users, CreditCard, Banknote, Wallet } from 'lucide-react'
import { APP_NAME } from '../../constants/brand'
import {
  PLATFORM_SUMMARY, PLATES, PAYMENT_TOTALS, formatMoney,
} from '../../data/mockTaxiData'
import s from './PlatformAnalyticsPage.module.css'

const maxEarning = Math.max(...PLATFORM_SUMMARY.map((p) => p.earnings))
const maxPlate = Math.max(...PLATES.map((p) => p.earnings))
const paymentTotal = PAYMENT_TOTALS.card + PAYMENT_TOTALS.cash + PAYMENT_TOTALS.wallet

export default function PlatformAnalyticsPage() {
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)
  const plate = selectedPlate ? PLATES.find((p) => p.plate === selectedPlate) : null

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Platform Kazançları</div>

      <div className={s.platformGrid}>
        {PLATFORM_SUMMARY.map((p) => (
          <div key={p.id} className={s.platformCard} style={{ borderTopColor: p.color }}>
            <div className={s.platformHeader}>
              <h3>{p.name}</h3>
              <span className={s.commissionBadge}>%{p.commission} komisyon</span>
            </div>
            <p className={s.bigAmount}>{formatMoney(p.earnings)}</p>
            <div className={s.platformStats}>
              <span><Users size={14} /> {p.customers} müşteri</span>
              <span>{p.plateCount} plaka</span>
            </div>
            <div className={s.miniBar}>
              <div className={s.miniBarFill} style={{ width: `${(p.earnings / maxEarning) * 100}%` }} />
            </div>
            <div className={s.platformPayments}>
              <span>💳 {formatMoney(p.card)}</span>
              <span>💵 {formatMoney(p.cash)}</span>
              <span>📱 {formatMoney(p.wallet)}</span>
            </div>
            <p className={s.commissionLine}>Komisyon: <strong>{formatMoney(p.commission)}</strong></p>
          </div>
        ))}
      </div>

      <div className={s.chartsRow}>
        <div className={s.chartCard}>
          <h3>Platform Bazlı Kazanç</h3>
          <div className={s.barChart}>
            {PLATFORM_SUMMARY.map((p) => (
              <div key={p.id} className={s.barGroup}>
                <div className={s.barWrap}>
                  <div className={s.bar} style={{ height: `${(p.earnings / maxEarning) * 100}%` }} />
                </div>
                <span className={s.barLabel}>{p.name}</span>
                <span className={s.barValue}>{formatMoney(p.earnings)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={s.chartCard}>
          <h3>Ödeme Yöntemleri</h3>
          <div className={s.paymentChart}>
            {[
              { key: 'card', label: 'Kredi Kartı', icon: CreditCard, amount: PAYMENT_TOTALS.card, color: 'var(--teal)' },
              { key: 'cash', label: 'Nakit', icon: Banknote, amount: PAYMENT_TOTALS.cash, color: 'var(--teal-light)' },
              { key: 'wallet', label: 'Cüzdan', icon: Wallet, amount: PAYMENT_TOTALS.wallet, color: '#4db6ac' },
            ].map(({ key, label, icon: Icon, amount, color }) => (
              <div key={key} className={s.paymentRow}>
                <div className={s.paymentIcon} style={{ background: color, color: key === 'cash' ? '#000' : '#fff' }}>
                  <Icon size={18} />
                </div>
                <div className={s.paymentInfo}>
                  <span>{label}</span>
                  <div className={s.paymentBarBg}>
                    <div className={s.paymentBarFill} style={{ width: `${(amount / paymentTotal) * 100}%`, background: color }} />
                  </div>
                </div>
                <strong>{formatMoney(amount)}</strong>
                <span className={s.percent}>{Math.round((amount / paymentTotal) * 100)}%</span>
              </div>
            ))}
          </div>
          <p className={s.customerTotal}>
            <Users size={16} /> Toplam <strong>{PLATES.reduce((s, p) => s + p.customers, 0)}</strong> müşteri
          </p>
        </div>
      </div>

      <div className={s.chartCard}>
        <h3>Plaka Bazlı Kazançlar</h3>
        <div className={s.plateChart}>
          {PLATES.map((p) => (
            <button
              key={p.plate}
              className={`${s.plateBar} ${selectedPlate === p.plate ? s.plateActive : ''}`}
              onClick={() => setSelectedPlate(selectedPlate === p.plate ? null : p.plate)}
            >
              <div className={s.plateBarInner}>
                <div className={s.plateBarFill} style={{ width: `${(p.earnings / maxPlate) * 100}%` }} />
              </div>
              <div className={s.plateInfo}>
                <strong>{p.plate}</strong>
                <span>{p.driver} · {PLATFORM_SUMMARY.find((x) => x.id === p.platform)?.name}</span>
              </div>
              <div className={s.plateRight}>
                <strong>{formatMoney(p.earnings)}</strong>
                <span>{p.customers} müşteri</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {plate && (
        <div className={s.plateDetail}>
          <h3>{plate.plate} — {plate.driver}</h3>
          <div className={s.detailGrid}>
            <div className={s.detailItem}><span>Toplam Kazanç</span><strong>{formatMoney(plate.earnings)}</strong></div>
            <div className={s.detailItem}><span>Komisyon</span><strong className={s.red}>{formatMoney(plate.commission)}</strong></div>
            <div className={s.detailItem}><span>Net Kazanç</span><strong className={s.green}>{formatMoney(plate.earnings - plate.commission)}</strong></div>
            <div className={s.detailItem}><span>Müşteri Sayısı</span><strong>{plate.customers}</strong></div>
            <div className={s.detailItem}><span>Kredi Kartı</span><strong>{formatMoney(plate.card)}</strong></div>
            <div className={s.detailItem}><span>Nakit</span><strong>{formatMoney(plate.cash)}</strong></div>
            <div className={s.detailItem}><span>Cüzdan</span><strong>{formatMoney(plate.wallet)}</strong></div>
          </div>
        </div>
      )}
    </>
  )
}
