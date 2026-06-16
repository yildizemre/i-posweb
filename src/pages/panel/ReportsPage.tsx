import { useState } from 'react'
import { Search, Filter, Eye, Trash2 } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSelect } from '../../components/dashboard/FormField'
import { APP_NAME, COMPANY_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import rs from './ReportsPage.module.css'

const TRANSACTIONS = [
  { id: '1', name: 'Party chicken lot pizza ranch wing', site: `www.${COMPANY_NAME.toLowerCase().replace(' ', '')}.com`, date: '17.04.2024', type: 'Peşin', amount: '₺ 1.250,00', status: 'approved' as const },
  { id: '2', name: 'Buffalo banana Aussie broccoli', site: 'www.migros.com.tr', date: '16.04.2024', type: '3 Taksit', amount: '₺ 3.450,00', status: 'refund' as const },
  { id: '3', name: 'Online Satış', site: 'www.getir.com', date: '15.04.2024', type: 'Peşin', amount: '₺ 890,00', status: 'approved' as const },
]

export default function ReportsPage() {
  const [showDetail, setShowDetail] = useState(false)
  const [showFilter, setShowFilter] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showRefund, setShowRefund] = useState(false)

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Raporlar &gt; İşlem Raporları</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>İşlem Raporları</h1><p className={s.contentSub}>Tüm işlemlerinizi görüntüleyin.</p></div>
        </div>
        <div className={s.toolbar}>
          <div className={s.search}><Search size={18} color="#8b95a5" /><input placeholder="Ara..." /></div>
          <input type="text" className={s.pageSize} defaultValue="01.04.2024 - 30.04.2024" />
          <button className={rs.filterBtn} onClick={() => setShowFilter(true)}><Filter size={16} />Filtrele</button>
        </div>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Sıra</th><th>İşlem Adı</th><th>Web Site</th><th>İşlem Tarihi</th><th>Satış Tipi</th><th>İşlem Tutarı</th><th>Durum</th><th></th></tr></thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td><td>{t.name}</td><td>{t.site}</td><td>{t.date}</td><td>{t.type}</td><td>{t.amount}</td>
                  <td><span className={`${s.badge} ${t.status === 'approved' ? s.badgeBlue : s.badgeRed}`}>{t.status === 'approved' ? 'Onaylandı' : 'İade'}</span></td>
                  <td><button className={`${s.actionLink} ${s.actionView}`} onClick={() => setShowDetail(true)}><Eye size={14} />Detaylar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="İşlem Detayları" subtitle="Lütfen formu doldurunuz" wide
        footer={
          <div className={rs.modalFooter}>
            <button className={rs.cancelBtn} onClick={() => { setShowDetail(false); setShowCancel(true) }}>İptal Et</button>
            <button className={rs.refundBtn} onClick={() => { setShowDetail(false); setShowRefund(true) }}>İade Yap</button>
            <button className={rs.receiptBtn}>Dekont Al</button>
          </div>
        }>
        <div className={rs.section}><h4>Web Site Bilgileri</h4><input readOnly defaultValue={`www.${COMPANY_NAME.toLowerCase().replace(' ', '')}.com`} className={rs.field} /></div>
        <div className={rs.section}><h4>İşlem Bilgileri</h4>
          <div className={rs.grid}>
            <div><label>İşlem No</label><input readOnly defaultValue="TRX-2024-001234" className={rs.field} /></div>
            <div><label>Sipariş No</label><input readOnly defaultValue="ORD-98765" className={rs.field} /></div>
            <div><label>İşlem Tarihi</label><input readOnly defaultValue="17.04.2024 14:32" className={rs.field} /></div>
            <div><label>Hakediş Tarihi</label><input readOnly defaultValue="18.04.2024" className={rs.field} /></div>
            <div><label>Brüt Tutar</label><input readOnly defaultValue="₺ 1.250,00" className={rs.field} /></div>
            <div><label>Komisyon Tutarı</label><input readOnly defaultValue="₺ 37,50" className={rs.field} style={{ color: '#e53935' }} /></div>
            <div><label>Net Tutar</label><input readOnly defaultValue="₺ 1.212,50" className={rs.field} style={{ color: '#2e7d32' }} /></div>
          </div>
        </div>
      </Modal>

      <Modal open={showFilter} onClose={() => setShowFilter(false)} title="Filtrele" subtitle="Lütfen formu doldurunuz" wide
        footer={<button className={s.submitFull} onClick={() => setShowFilter(false)}>Uygula</button>}>
        <div className={rs.section}><h4>Tarih Aralığı</h4>
          <div className={rs.grid}>
            <FormField label="Başlangıç Tarihi" defaultValue="12.09.2024, Perşembe" />
            <FormField label="Bitiş Tarihi" defaultValue="20.09.2024, Cuma" />
          </div>
        </div>
        <div className={rs.section}><h4>Daha Fazla Filtre</h4>
          <FormSelect label="İşlem Türü"><option>Hepsi</option></FormSelect>
          <FormSelect label="İşlem Tipi"><option>Hepsi</option></FormSelect>
          <FormSelect label="WEB Site"><option>Hepsi</option></FormSelect>
          <FormSelect label="İşlem Yapılan Banka"><option>Akbank</option></FormSelect>
          <FormSelect label="Para Birimi"><option>TRY</option></FormSelect>
        </div>
      </Modal>

      {showCancel && (
        <div className={rs.actionOverlay} onClick={() => setShowCancel(false)}>
          <div className={rs.actionModal} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={32} color="#e53935" />
            <h2>İşlemi İptal Et</h2>
            <p>Bu işlemin geri dönüşü olmayacaktır.</p>
            <FormField label="İptal Sebebi" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
            <div className={rs.actionBtns}>
              <button className={rs.vazgec} onClick={() => setShowCancel(false)}>Vazgeç</button>
              <button className={rs.confirmRed} onClick={() => setShowCancel(false)}>İptal Et</button>
            </div>
          </div>
        </div>
      )}

      {showRefund && (
        <div className={rs.actionOverlay} onClick={() => setShowRefund(false)}>
          <div className={rs.actionModal} onClick={(e) => e.stopPropagation()}>
            <Trash2 size={32} color="#f57c00" />
            <h2>İade Et</h2>
            <p>Bu işlemin geri dönüşü olmayacaktır.</p>
            <FormField label="İptal Sebebi" defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
            <div className={rs.actionBtns}>
              <button className={rs.vazgec} onClick={() => setShowRefund(false)}>Vazgeç</button>
              <button className={rs.confirmOrange} onClick={() => setShowRefund(false)}>İadeyi Onayla</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
