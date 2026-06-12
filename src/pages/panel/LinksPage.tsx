import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Eye, Pencil, Trash2 } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSection, FormSelect, FormTextarea } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { useAccount } from '../../context/AccountContext'
import { usePanelData, PaymentLink } from '../../context/PanelDataContext'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

const statusMap = {
  pending: { label: 'Onay Bekliyor', cls: s.badgeBlue },
  active: { label: 'Aktif', cls: s.badgeGreen },
  closed: { label: 'Kapandı', cls: s.badgeRed },
}

const EMPTY_FORM = {
  product: '', description: '', price: '', taksit: 'Peşin',
  endDate: '', count: '100', refUrl: '', site: '', url: '',
}

export default function LinksPage() {
  const { type } = useAccount()
  const { kurumsalLinks, bireyselLinks, addLink, deleteLink } = usePanelData()
  const navigate = useNavigate()
  const isBireysel = type === 'bireysel'
  const links = isBireysel ? bireyselLinks : kurumsalLinks

  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<PaymentLink | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = links.filter((l) => {
    const q = search.toLowerCase()
    return isBireysel
      ? l.product.toLowerCase().includes(q)
      : (l.site ?? '').toLowerCase().includes(q) || (l.url ?? '').toLowerCase().includes(q)
  })

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, product: isBireysel ? '' : 'Ödeme' })
    setConfirmed(false)
    setShowAdd(true)
  }

  const openDelete = (link: PaymentLink) => {
    setSelected(link)
    setShowDelete(true)
  }

  const handleAdd = () => {
    const accountType = isBireysel ? 'bireysel' : 'kurumsal'
    addLink(accountType, {
      product: form.product,
      description: form.description,
      price: form.price,
      taksit: form.taksit,
      endDate: form.endDate,
      count: form.count,
      remaining: form.count,
      refUrl: form.refUrl,
      site: isBireysel ? undefined : form.site,
      url: isBireysel ? undefined : form.url,
    })
    setShowAdd(false)
    setShowSuccess(true)
  }

  const handleDelete = () => {
    if (!selected) return
    deleteLink(isBireysel ? 'bireysel' : 'kurumsal', selected.id)
    setShowDelete(false)
  }

  const canSubmit = confirmed && (isBireysel ? form.product : form.site)

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Ödeme Linkleri</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Linkleriniz</h1>
            <p className={s.contentSub}>Toplam {links.length} link</p>
          </div>
          <button className={s.primaryBtn} onClick={openAdd} type="button"><Plus size={18} />Yeni Link Oluştur</button>
        </div>

        {links.length === 0 ? (
          <div className={s.empty}>
            <div className={s.clouds}><div className={s.cloud1} /><div className={s.cloud2} /></div>
            <p className={s.emptyTitle}>Hiç bir link oluşturmadınız.</p>
            <p className={s.emptySub}>Yeni Link Oluştur butonuyla başlayın.</p>
          </div>
        ) : (
          <>
            <div className={s.toolbar}>
              <div className={s.search}>
                <Search size={18} color="#8b95a5" />
                <input placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className={s.pageSize}><option>10</option><option>25</option></select>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                {isBireysel ? (
                  <>
                    <thead><tr><th>Sıra</th><th>Ürün / Hizmet Adı</th><th>Taksit</th><th>Link Bitiş Tarihi</th><th>Ö. Adedi</th><th>Durum</th><th></th></tr></thead>
                    <tbody>
                      {filtered.map((link, i) => (
                        <tr key={link.id}>
                          <td>{i + 1}</td>
                          <td>{link.product}</td>
                          <td>{link.taksit}</td>
                          <td>{link.endDate || '—'}</td>
                          <td>{link.count}</td>
                          <td><span className={`${s.badge} ${statusMap[link.status].cls}`}>{statusMap[link.status].label}</span></td>
                          <td>
                            <button className={`${s.actionLink} ${s.actionView}`} onClick={() => navigate(`/panel/linkler/${link.id}`)} type="button"><Eye size={14} />Görüntüle</button>
                            <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => navigate(`/panel/linkler/${link.id}`)} type="button"><Pencil size={14} />Düzenle</button>
                            <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => openDelete(link)} type="button"><Trash2 size={14} />Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <>
                    <thead><tr><th>Sıra</th><th>Site / İşletme</th><th>URL</th><th>Taksit</th><th>Durum</th><th></th></tr></thead>
                    <tbody>
                      {filtered.map((link, i) => (
                        <tr key={link.id}>
                          <td>{i + 1}</td>
                          <td>{link.site}</td>
                          <td>{link.url}</td>
                          <td>{link.taksit}</td>
                          <td><span className={`${s.badge} ${statusMap[link.status].cls}`}>{statusMap[link.status].label}</span></td>
                          <td>
                            <button className={`${s.actionLink} ${s.actionView}`} onClick={() => navigate(`/panel/linkler/${link.id}`)} type="button"><Eye size={14} />Görüntüle</button>
                            <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => navigate(`/panel/linkler/${link.id}`)} type="button"><Pencil size={14} />Düzenle</button>
                            <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => openDelete(link)} type="button"><Trash2 size={14} />Sil</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
            <div className={s.pagination}>
              <span>Toplam {filtered.length} kayıt</span>
            </div>
          </>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Ödeme Linki Ekle" subtitle="Lütfen formu doldurunuz" wide
        footer={<button className={s.submitFull} disabled={!canSubmit} onClick={handleAdd} type="button">Ekle</button>}>
        {!isBireysel && (
          <FormSection title="Site Bilgileri">
            <FormField label="Site / İşletme Adı" value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
            <FormField label="URL" placeholder="www.ornek.com" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          </FormSection>
        )}
        <FormSection title="Genel Bilgiler">
          <FormField label="Ürün / Hizmet Adı" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
          <FormTextarea label="Ürün Açıklaması" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </FormSection>
        <FormSection title="Fiyatlar">
          <FormField label="Ürün Peşin Fiyatı" placeholder="₺ 0,00" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <FormSelect label="Taksit Seçeneği" value={form.taksit} onChange={(e) => setForm({ ...form, taksit: e.target.value })}>
            <option>Peşin</option><option>3 Taksit</option><option>6 Taksit</option><option>12 Taksit</option>
          </FormSelect>
        </FormSection>
        <FormSection title="Daha Fazla Detay">
          <FormField label="Link Bitiş Tarihi" placeholder="GG.AA.YYYY" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <FormField label="Ödeme Adedi" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} />
          <FormField label="Referans URL Adresi" placeholder="https://" value={form.refUrl} onChange={(e) => setForm({ ...form, refUrl: e.target.value })} />
        </FormSection>
        <label className={s.checkbox}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          Bilgilerin doğruluğunu onaylıyorum.
        </label>
      </Modal>

      <ConfirmDeleteModal open={showDelete} onClose={() => setShowDelete(false)} title="Linki silmek istediğinize emin misiniz?" confirmLabel="Linki Sil" onConfirm={handleDelete} />

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} title="Link eklendi"
        body="Ödeme linkiniz listeye eklendi. Onay sürecinden sonra aktif olacaktır." buttonLabel="Tamam" />
    </>
  )
}
