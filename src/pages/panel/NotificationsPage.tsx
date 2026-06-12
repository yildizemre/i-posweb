import { Trash2, Eye } from 'lucide-react'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

const NOTIFICATIONS = [
  { id: '1', title: 'Buffalo banana Aussie broccoli ranch wing pizza', date: '21.10.2024', body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.' },
  { id: '2', title: 'Party chicken lot pizza ranch wing', date: '21.10.2024', body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.' },
  { id: '3', title: 'Yeni işlem bildirimi', date: '20.10.2024', body: 'Hesabınıza yeni bir ödeme işlemi yansıtılmıştır.' },
]

export default function NotificationsPage() {
  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Bildirimler</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>Bildirimler</h1><p className={s.contentSub}>Lorem ipsum dolor sit amet.</p></div>
          <button className={s.deleteBtn} style={{ padding: '12px 20px' }}><Trash2 size={16} />Tümünü Sil</button>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Sıra</th><th>Başlık</th><th>Tarih</th><th>Bildirim İçeriği</th><th></th></tr></thead>
            <tbody>
              {NOTIFICATIONS.map((n, i) => (
                <tr key={n.id}>
                  <td>{i + 1}</td>
                  <td style={{ fontWeight: 600, maxWidth: 200 }}>{n.title}</td>
                  <td>{n.date}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 300 }}>{n.body}</td>
                  <td>
                    <button className={s.actionLink} style={{ color: '#e53935' }}><Trash2 size={14} /></button>
                    <button className={s.actionLink} style={{ color: '#e53935' }}><Eye size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
