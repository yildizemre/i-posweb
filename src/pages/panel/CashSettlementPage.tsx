import { useState } from 'react'
import { Clock, CheckCircle2, AlertTriangle, Send } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../constants/brand'
import { CASH_SETTLEMENTS, CASH_BLOCK_RATE, formatMoney } from '../../data/mockTaxiData'
import SuccessModal from '../../components/dashboard/SuccessModal'
import s from './CashSettlementPage.module.css'

type Settlement = Omit<(typeof CASH_SETTLEMENTS)[number], 'status'> & { status: 'pending' | 'completed' }

export default function CashSettlementPage() {
  const { isAdmin, hideFinancials } = useAuth()
  const [settlements, setSettlements] = useState<Settlement[]>(CASH_SETTLEMENTS)
  const [showSuccess, setShowSuccess] = useState(false)

  if (isAdmin) return <Navigate to="/panel" replace />

  const totalCash = settlements.reduce((s, x) => s + x.cashCollected, 0)
  const totalBlocked = settlements.reduce((s, x) => s + x.blockedAmount, 0)
  const totalTransfer = settlements.reduce((s, x) => s + x.transferAmount, 0)
  const money = (n: number) => hideFinancials ? '—' : formatMoney(n)

  const runEndOfDay = () => {
    setSettlements(settlements.map((x) => ({ ...x, status: 'completed' as const })))
    setShowSuccess(true)
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Nakit Hakediş</div>

      <div className={s.infoBanner}>
        <AlertTriangle size={20} />
        <div>
          <strong>Nakit Ödeme Bloke Kuralı</strong>
          <p>Platform sürücüleri elden aldıkları nakit ödemelerin <strong>%{(CASH_BLOCK_RATE * 100)}'u</strong> gün sonuna kadar bloke edilir. Gün sonunda (23:59) bloke tutarlar otomatik olarak ilgili platformlara (Uber, Yandex, 7/24, BiTaksi) transfer edilir.</p>
        </div>
      </div>

      <div className={s.summaryRow}>
        <div className={s.summaryCard}>
          <span>Toplam Nakit Tahsilat</span>
          <strong>{money(totalCash)}</strong>
        </div>
        <div className={`${s.summaryCard} ${s.blocked}`}>
          <span>Bloke Tutar (%10)</span>
          <strong>{money(totalBlocked)}</strong>
        </div>
        <div className={`${s.summaryCard} ${s.transfer}`}>
          <span>Gün Sonu Transfer</span>
          <strong>{money(totalTransfer)}</strong>
        </div>
        <div className={s.summaryCard}>
          <span>Transfer Saati</span>
          <strong className={s.time}><Clock size={18} /> 23:59</strong>
        </div>
      </div>

      <div className={s.content}>
        <div className={s.header}>
          <h1>Platform Nakit Hakedişleri</h1>
          <button className={s.transferBtn} onClick={runEndOfDay}>
            <Send size={18} /> Gün Sonu Transferini Başlat
          </button>
        </div>

        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Nakit Tahsilat</th>
                <th>Bloke (%10)</th>
                <th>Transfer Tutarı</th>
                <th>Transfer Saati</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {settlements.map((row) => (
                <tr key={row.platformId}>
                  <td><strong>{row.platform}</strong></td>
                  <td>{money(row.cashCollected)}</td>
                  <td className={s.blockedText}>{money(row.blockedAmount)}</td>
                  <td className={s.transferText}>{money(row.transferAmount)}</td>
                  <td>{row.transferTime}</td>
                  <td>
                    {row.status === 'completed' ? (
                      <span className={s.badgeDone}><CheckCircle2 size={14} /> Transfer Edildi</span>
                    ) : (
                      <span className={s.badgePending}><Clock size={14} /> Bekliyor</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={s.flow}>
          <h3>Nakit Akış Şeması</h3>
          <div className={s.flowSteps}>
            <div className={s.step}><span>1</span><p>Müşteri nakit öder</p></div>
            <div className={s.arrow}>→</div>
            <div className={s.step}><span>2</span><p>Sürücü elden alır</p></div>
            <div className={s.arrow}>→</div>
            <div className={s.step}><span>3</span><p>%10 bloke edilir</p></div>
            <div className={s.arrow}>→</div>
            <div className={s.step}><span>4</span><p>23:59 otomatik transfer</p></div>
            <div className={s.arrow}>→</div>
            <div className={s.step}><span>5</span><p>Platforma gönderilir</p></div>
          </div>
        </div>
      </div>

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Gün Sonu Transferi Tamamlandı"
        body={hideFinancials
          ? 'Nakit transferleri Uber, Yandex, 7/24 ve BiTaksi platformlarına otomatik olarak tamamlandı.'
          : `Toplam ${formatMoney(totalTransfer)} tutarı Uber, Yandex, 7/24 ve BiTaksi platformlarına otomatik olarak transfer edildi.`}
        buttonLabel="Tamam"
      />
    </>
  )
}
