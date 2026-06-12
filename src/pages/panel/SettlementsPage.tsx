import { Search, Filter, Eye } from 'lucide-react'
import { APP_NAME, COMPANY_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import rs from './ReportsPage.module.css'

const ROWS = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  status: i % 2 === 0 ? 'pending' : 'paid',
}))

export default function SettlementsPage() {
  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Raporlar &gt; Hakedişler</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>Hakedişler</h1><p className={s.contentSub}>Lorem ipsum dolor sit amet.</p></div>
        </div>
        <div className={s.toolbar}>
          <div className={s.search}><Search size={18} color="#8b95a5" /><input placeholder="Ara..." /></div>
          <select className={s.pageSize}><option>5</option></select>
          <button className={rs.filterBtn}><Filter size={16} />Filtrele</button>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Sıra</th><th>İş Yeri Adı</th><th>İşlem Tarihi</th><th>Valör Tarihi</th><th>IBAN</th><th>Brüt Tutar</th><th>Net Tutar</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{COMPANY_NAME}</td>
                  <td>29.08.2024</td>
                  <td>29.08.2024</td>
                  <td>TR90 0067 7896 6789 6363 0678 54</td>
                  <td>₺50.000,00</td>
                  <td style={{ color: '#2e7d32', fontWeight: 600 }}>₺50.000,00</td>
                  <td><span className={`${s.badge} ${r.status === 'pending' ? s.badgeBlue : s.badgeGreen}`}>{r.status === 'pending' ? 'Ödenecek' : 'Ödendi'}</span></td>
                  <td><button className={`${s.actionLink} ${s.actionView}`}><Eye size={14} />İşlemleri Gör</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
