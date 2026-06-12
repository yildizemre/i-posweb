import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, Copy } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSection, FormSelect, FormTextarea } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import { useAccount } from '../../context/AccountContext'
import { usePanelData } from '../../context/PanelDataContext'
import { APP_NAME, APP_DOMAIN } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

const statusMap = {
  pending: { label: 'Onay Bekliyor', cls: s.badgeBlue },
  active: { label: 'Aktif', cls: s.badgeGreen },
  closed: { label: 'Kapandı', cls: s.badgeRed },
}

export default function LinkDetailPage() {
  const { id } = useParams()
  const { type } = useAccount()
  const { getLink, updateLink, deleteLink } = usePanelData()
  const navigate = useNavigate()
  const isBireysel = type === 'bireysel'
  const accountType = isBireysel ? 'bireysel' : 'kurumsal'
  const link = id ? getLink(accountType, id) : undefined

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [form, setForm] = useState(link ?? null)
  const [copied, setCopied] = useState(false)

  if (!link) {
    return (
      <>
        <div className={s.breadcrumb}>{APP_NAME} &gt; Ödeme Linkleri</div>
        <div className={s.content}>
          <p>Link bulunamadı.</p>
          <button className={s.primaryBtn} style={{ marginTop: 16 }} onClick={() => navigate('/panel/linkler')} type="button">Listeye Dön</button>
        </div>
      </>
    )
  }

  const openEdit = () => {
    setForm({ ...link })
    setShowEdit(true)
  }

  const handleSave = () => {
    if (!form || !id) return
    updateLink(accountType, id, form)
    setShowEdit(false)
  }

  const handleDelete = () => {
    if (!id) return
    deleteLink(accountType, id)
    navigate('/panel/linkler')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${APP_DOMAIN}/pay/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const badge = statusMap[link.status]

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Ödeme Linkleri &gt; Link Detayları</div>
      <div className={s.content}>
        <div className={s.detailHeader}>
          <div>
            {!isBireysel && link.site && <p className={s.detailLabel}>{link.site}</p>}
            <h1>{link.product}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className={`${s.outlineBtn} ${s.editBtn}`} onClick={openEdit} type="button"><Pencil size={14} />Düzenle</button>
            <button className={`${s.outlineBtn} ${s.deleteBtn}`} onClick={() => setShowDelete(true)} type="button"><Trash2 size={14} />Sil</button>
          </div>
        </div>

        <div className={s.detailSection}>
          <h3>Genel Bilgiler</h3>
          <div className={s.detailGrid}>
            {!isBireysel && link.site && <div className={s.detailField}><label>Web Site</label><input readOnly value={link.site} /></div>}
            {!isBireysel && link.url && <div className={s.detailField}><label>URL</label><input readOnly value={link.url} /></div>}
            <div className={s.detailField}><label>Ürün Hizmet Adı</label><input readOnly value={link.product} /></div>
            <div className={s.detailField}>
              <label>Ürün Linki</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={`${APP_DOMAIN}/pay/${id}`} style={{ flex: 1 }} />
                <button style={{ padding: '0 12px', border: '1px solid var(--border)', borderRadius: 8 }} onClick={copyLink} type="button" title="Kopyala">
                  <Copy size={16} />
                </button>
              </div>
              {copied && <span style={{ fontSize: 12, color: 'var(--success)' }}>Kopyalandı!</span>}
            </div>
            {link.description && (
              <div className={`${s.detailField} ${s.full}`}><label>Ürün Açıklaması</label><textarea readOnly rows={3} value={link.description} /></div>
            )}
          </div>
        </div>

        <div className={s.detailSection}>
          <h3>Fiyatlar</h3>
          <div className={s.detailGrid}>
            <div className={s.detailField}><label>Ürün Peşin Fiyatı</label><input readOnly value={link.price || '—'} /></div>
            <div className={s.detailField}><label>Taksit Seçeneği</label><input readOnly value={link.taksit} /></div>
          </div>
        </div>

        <div className={s.detailSection}>
          <h3>Daha Fazla Detay</h3>
          <div className={s.detailGrid}>
            <div className={s.detailField}><label>Link Bitiş Tarihi</label><input readOnly value={link.endDate || '—'} /></div>
            <div className={s.detailField}><label>Ödeme Adedi</label><input readOnly value={link.count} /></div>
            <div className={s.detailField}><label>Kalan Ödeme Adedi</label><input readOnly value={link.remaining} style={{ color: '#e53935', fontWeight: 600 }} /></div>
            <div className={s.detailField}><label>Link Durumu</label><span className={`${s.badge} ${badge.cls}`}>{badge.label}</span></div>
            {link.refUrl && <div className={s.detailField}><label>Referans URL Adresi</label><input readOnly value={link.refUrl} /></div>}
          </div>
        </div>
      </div>

      {form && (
        <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Düzenle" subtitle="Lütfen formu doldurunuz" wide
          footer={<button className={s.submitFull} onClick={handleSave} type="button">Kaydet</button>}>
          {!isBireysel && (
            <FormSection title="Site Bilgileri">
              <FormField label="Site / İşletme Adı" value={form.site ?? ''} onChange={(e) => setForm({ ...form, site: e.target.value })} />
              <FormField label="URL" value={form.url ?? ''} onChange={(e) => setForm({ ...form, url: e.target.value })} />
            </FormSection>
          )}
          <FormSection title="Genel Bilgiler">
            <FormField label="Ürün / Hizmet Adı" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} />
            <FormTextarea label="Ürün Açıklaması" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormSection>
          <FormSection title="Fiyatlar">
            <FormField label="Ürün Peşin Fiyatı" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <FormSelect label="Taksit Seçeneği" value={form.taksit} onChange={(e) => setForm({ ...form, taksit: e.target.value })}>
              <option>Peşin</option><option>3 Taksit</option><option>6 Taksit</option><option>12 Taksit</option>
            </FormSelect>
          </FormSection>
          <FormSection title="Daha Fazla Detay">
            <FormField label="Link Bitiş Tarihi" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            <FormField label="Ödeme Adedi" value={form.count} onChange={(e) => setForm({ ...form, count: e.target.value })} />
            <FormField label="Referans URL" value={form.refUrl} onChange={(e) => setForm({ ...form, refUrl: e.target.value })} />
          </FormSection>
        </Modal>
      )}

      <ConfirmDeleteModal open={showDelete} onClose={() => setShowDelete(false)} confirmLabel="Linki Sil" onConfirm={handleDelete} />
    </>
  )
}
