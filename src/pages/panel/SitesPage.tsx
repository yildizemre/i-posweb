import { useState } from 'react'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSection, FormSelect } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { usePanelData, Site } from '../../context/PanelDataContext'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

const EMPTY_FORM = {
  iban: '', accountHolder: '', bankTitle: '',
  title: '', storeName: '', url: '', successUrl: '', errorUrl: '', ip: '', installment: '12',
}

const statusMap = {
  pending: { label: 'Onay Bekliyor', cls: s.badgeBlue },
  active: { label: 'Aktif', cls: s.badgeGreen },
  closed: { label: 'Kapandı', cls: s.badgeRed },
}

export default function SitesPage() {
  const { sites, addSite, updateSite, deleteSite } = usePanelData()
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Site | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const filtered = sites.filter((site) =>
    site.title.toLowerCase().includes(search.toLowerCase()) ||
    site.storeName.toLowerCase().includes(search.toLowerCase()) ||
    site.url.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setConfirmed(false)
    setShowAdd(true)
  }

  const openEdit = (site: Site) => {
    setSelected(site)
    setForm({
      iban: site.iban, accountHolder: site.accountHolder, bankTitle: site.bankTitle,
      title: site.title, storeName: site.storeName, url: site.url,
      successUrl: site.successUrl, errorUrl: site.errorUrl, ip: site.ip, installment: site.installment,
    })
    setShowEdit(true)
  }

  const openDelete = (site: Site) => {
    setSelected(site)
    setShowDelete(true)
  }

  const handleAdd = () => {
    addSite(form)
    setShowAdd(false)
    setShowSuccess(true)
  }

  const handleSave = () => {
    if (!selected) return
    updateSite(selected.id, form)
    setShowEdit(false)
  }

  const handleDelete = () => {
    if (!selected) return
    deleteSite(selected.id)
    setShowDelete(false)
  }

  const formFields = (
    <>
      <FormSection title="Hesap Bilgileri">
        <FormField label="IBAN Numarası" placeholder="TR00 0000 0000 0000 0000 0000 00" value={form.iban} onChange={(e) => setForm({ ...form, iban: e.target.value })} />
        <FormField label="Hesap Sahibi Adı" placeholder="Ad Soyad" value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} />
        <FormField label="Banka Hesap Ünvanı" placeholder="Ünvan" value={form.bankTitle} onChange={(e) => setForm({ ...form, bankTitle: e.target.value })} />
      </FormSection>
      <FormSection title="Web Site Bilgileri">
        <FormField label="Web Site Başlığı" placeholder="Site başlığı" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FormField label="Mağaza / İşletme Adı" placeholder="Mağaza adı" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
        <FormField label="Web Site URL" placeholder="https://" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <FormField label="Başarılı Yönlendirme URL" placeholder="https://" value={form.successUrl} onChange={(e) => setForm({ ...form, successUrl: e.target.value })} />
        <FormField label="Hatalı Yönlendirme URL" placeholder="https://" value={form.errorUrl} onChange={(e) => setForm({ ...form, errorUrl: e.target.value })} />
        <FormField label="Web Site IP Adresi" placeholder="0.0.0.0" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} />
      </FormSection>
      <FormSection title="Diğer Bilgiler">
        <FormSelect label="Taksit Seçeneği" value={form.installment} onChange={(e) => setForm({ ...form, installment: e.target.value })}>
          <option value="12">12</option><option value="6">6</option><option value="3">3</option>
        </FormSelect>
      </FormSection>
    </>
  )

  const canSubmit = confirmed && form.title && form.storeName && form.url

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Web Site Yönetimi &gt; Liste</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Web Siteleriniz</h1>
            <p className={s.contentSub}>Toplam {sites.length} site</p>
          </div>
          <button className={s.primaryBtn} onClick={openAdd} type="button"><Plus size={18} />Yeni Site Ekle</button>
        </div>

        {sites.length === 0 ? (
          <div className={s.empty}>
            <div className={s.clouds}><div className={s.cloud1} /><div className={s.cloud2} /></div>
            <p className={s.emptyTitle}>Hiç bir site eklemedin.</p>
            <p className={s.emptySub}>Yeni Site Ekle butonuyla başlayın.</p>
          </div>
        ) : (
          <>
            <div className={s.toolbar}>
              <div className={s.search}>
                <Search size={18} color="#8b95a5" />
                <input placeholder="Ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Sıra</th><th>Site Başlığı</th><th>Mağaza Adı</th><th>URL</th><th>Taksit</th><th>Durum</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((site, i) => (
                    <tr key={site.id}>
                      <td>{i + 1}</td>
                      <td>{site.title}</td>
                      <td>{site.storeName}</td>
                      <td>{site.url}</td>
                      <td>{site.installment} Taksit</td>
                      <td><span className={`${s.badge} ${statusMap[site.status].cls}`}>{statusMap[site.status].label}</span></td>
                      <td>
                        <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => openEdit(site)} type="button"><Pencil size={14} />Düzenle</button>
                        <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => openDelete(site)} type="button"><Trash2 size={14} />Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Site Ekle" subtitle="Lütfen formu doldurunuz" wide
        footer={<button className={s.submitFull} disabled={!canSubmit} onClick={handleAdd} type="button">Ekle</button>}>
        {formFields}
        <label className={s.checkbox}>
          <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
          Bilgilerin doğruluğunu onaylıyorum.
        </label>
      </Modal>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Siteyi Düzenle" subtitle="Bilgileri güncelleyin" wide
        footer={<button className={s.submitFull} onClick={handleSave} type="button">Kaydet</button>}>
        {formFields}
      </Modal>

      <ConfirmDeleteModal open={showDelete} onClose={() => setShowDelete(false)} title="Siteyi silmek istediğinize emin misiniz?" confirmLabel="Siteyi Sil" onConfirm={handleDelete} />

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} title="Site eklendi"
        body="Web siteniz listeye eklendi. Onay sürecinden sonra aktif olacaktır." buttonLabel="Tamam" />
    </>
  )
}
