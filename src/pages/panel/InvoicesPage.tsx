import { Search, Filter, Eye } from 'lucide-react'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import rs from './ReportsPage.module.css'

const INVOICES = [
  { id: '1', no: '2345678901', date: '12.09.2024', amount: '550.000,00', status: 'paid' as const },
  { id: '2', no: '2345678902', date: '11.09.2024', amount: '320.000,00', status: 'refund' as const },
]

export default function InvoicesPage() {
  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Raporlar &gt; Faturalar</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>Faturalar</h1><p className={s.contentSub}>Lorem ipsum dolor sit amet.</p></div>
        </div>
        <div className={s.toolbar}>
          <div className={s.search}><Search size={18} color="#8b95a5" /><input placeholder="Ara..." /></div>
          <select className={s.pageSize}><option>5</option></select>
          <button className={rs.filterBtn}><Filter size={16} />Filtrele</button>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Sıra</th><th>Fatura No</th><th>İşlem Tarihi</th><th>İşlem Tutarı</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {INVOICES.map((inv, i) => (
                <tr key={inv.id}>
                  <td>{i + 1}</td>
                  <td>{inv.no}</td>
                  <td>{inv.date}</td>
                  <td style={{ color: '#2e7d32', fontWeight: 600 }}>{inv.amount}</td>
                  <td><span className={`${s.badge} ${inv.status === 'paid' ? s.badgeBlue : s.badgeRed}`}>{inv.status === 'paid' ? 'Ödendi' : 'İade'}</span></td>
                  <td><button className={`${s.actionLink} ${s.actionView}`}><Eye size={14} />Dekontu Gör</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
