import { CreditCard } from 'lucide-react'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

export default function PhysicalPosPage() {
  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Fiziki POS</div>
      <div className={s.content}>
        <div className={s.empty} style={{ padding: '100px 20px' }}>
          <CreditCard size={80} color="var(--teal)" strokeWidth={1.2} style={{ marginBottom: 24 }} />
          <p className={s.emptyTitle}>Fiziki POS Hizmetimiz</p>
          <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: 8, margin: '16px 0 8px' }}>ÇOK YAKINDA</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', letterSpacing: 12 }}>BURADA</p>
        </div>
      </div>
    </>
  )
}
