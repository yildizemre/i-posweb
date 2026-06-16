import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSelect, FormTextarea } from '../../components/dashboard/FormField'
import { APP_NAME, COMPANY_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

const TICKETS = [
  { id: '1', title: 'Param 5 Gündür Hesabıma Geçmiyor...', desc: 'Ödeme alındı ancak hesaba geçmedi', ticketNo: 'TK-2024-001', date: '16.04.2024', status: 'waiting' as const },
]

export default function SupportPage() {
  const navigate = useNavigate()
  const [empty, setEmpty] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Yardım ve Destek</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>Destek Talepleriniz</h1><p className={s.contentSub}>Lorem ipsum dolor sit amet consectetur.</p></div>
          <button className={s.primaryBtn} onClick={() => setShowAdd(true)}><Plus size={18} />Yeni Talep Oluştur</button>
        </div>

        {empty ? (
          <div className={s.empty}>
            <div className={s.clouds}><div className={s.cloud1} /><div className={s.cloud2} /></div>
            <p className={s.emptyTitle}>Hiç destek talebi oluşturmadınız.</p>
            <p className={s.emptySub}>Şimdi...</p>
          </div>
        ) : (
          <div className={s.tableWrap}><table className={s.table}>
            <thead><tr><th>Sıra</th><th>Başlık</th><th>Açıklama</th><th>Ticket No</th><th>Talep Tarihi</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {TICKETS.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.title}</td>
                  <td>{t.desc}</td>
                  <td>{t.ticketNo}</td>
                  <td>{t.date}</td>
                  <td><span className={`${s.badge} ${s.badgeBlue}`}>Cevap Bekliyor</span></td>
                  <td>
                    <button className={`${s.actionLink} ${s.actionView}`} onClick={() => navigate(`/panel/destek/${t.id}`)}>
                      <Eye size={14} />Görüntüle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Destek Talebi Oluştur" subtitle="Lütfen formu doldurunuz" wide
        footer={<button className={s.submitFull} onClick={() => { setShowAdd(false); setEmpty(false) }}>Destek Talebi Oluştur</button>}>
        <FormSelect label="Konu"><option>POS İşlemleri</option><option>Ödeme Linkleri</option><option>Diğer</option></FormSelect>
        <FormSelect label="Destek Talebi Neden Firma"><option>{COMPANY_NAME}</option></FormSelect>
        <FormField label="Başlık" defaultValue="Pos Hizmetini kullanamıyorum" />
        <FormTextarea label="Mesajınız" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
        <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          Dosya Yükle<br /><span style={{ fontSize: 11 }}>Maksimum 10 MB ve 1 adet</span>
        </div>
      </Modal>
    </>
  )
}
