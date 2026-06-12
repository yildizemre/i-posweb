import { useState } from 'react'
import { Pencil, Trash2, Search, Tag, Eye } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import CampaignCards from '../../components/dashboard/CampaignCards'
import { FormField, FormSection, FormSelect, FormTextarea } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { usePanelData, Campaign, CampaignType } from '../../context/PanelDataContext'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import ls from './SitesPage.module.css'

const EMPTY_CAMPAIGN: {
  title: string; description: string; type: CampaignType
  discountType: 'percent' | 'amount'; discountValue: string; promoCode: string
  siteId: string; siteName: string; startDate: string; endDate: string
} = {
  title: '', description: '', type: 'kampanya',
  discountType: 'percent', discountValue: '', promoCode: '',
  siteId: '', siteName: 'Tüm Siteler', startDate: '', endDate: '',
}

const campaignStatusMap = {
  active: { label: 'Yayında', cls: s.badgeGreen },
  draft: { label: 'Taslak', cls: s.badgeBlue },
  expired: { label: 'Süresi Doldu', cls: s.badgeRed },
}

const campaignTypeMap = { kampanya: 'Kampanya', indirim: 'İndirim', firsat: 'Fırsat' }

export default function SitesPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, activeCampaigns } = usePanelData()
  const [showAddCampaign, setShowAddCampaign] = useState(false)
  const [showEditCampaign, setShowEditCampaign] = useState(false)
  const [showDeleteCampaign, setShowDeleteCampaign] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignForm, setCampaignForm] = useState(EMPTY_CAMPAIGN)

  const filteredCampaigns = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.promoCode.toLowerCase().includes(search.toLowerCase()) ||
    c.siteName.toLowerCase().includes(search.toLowerCase())
  )

  const campaignFields = (
    <>
      <FormSection title="Kampanya Bilgileri">
        <FormField label="Başlık" value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} placeholder="Yaz İndirimi" />
        <FormTextarea label="Açıklama" value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} placeholder="Kullanıcıların göreceği açıklama" />
        <FormSelect label="Tür" value={campaignForm.type} onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as CampaignType })}>
          <option value="kampanya">Kampanya</option>
          <option value="indirim">İndirim</option>
          <option value="firsat">Fırsat</option>
        </FormSelect>
      </FormSection>
      <FormSection title="İndirim Detayı">
        <FormSelect label="İndirim Tipi" value={campaignForm.discountType} onChange={(e) => setCampaignForm({ ...campaignForm, discountType: e.target.value as 'percent' | 'amount' })}>
          <option value="percent">Yüzde (%)</option>
          <option value="amount">Tutar (₺)</option>
        </FormSelect>
        <FormField label={campaignForm.discountType === 'percent' ? 'İndirim Oranı (%)' : 'İndirim Tutarı (₺)'} value={campaignForm.discountValue} onChange={(e) => setCampaignForm({ ...campaignForm, discountValue: e.target.value })} />
        <FormField label="Promosyon Kodu" value={campaignForm.promoCode} onChange={(e) => setCampaignForm({ ...campaignForm, promoCode: e.target.value.toUpperCase() })} placeholder="YAZ15" />
      </FormSection>
      <FormSection title="Hedef & Tarih">
        <FormField label="Mağaza / Site Adı" value={campaignForm.siteName} onChange={(e) => setCampaignForm({ ...campaignForm, siteName: e.target.value })} placeholder="Tüm Siteler veya mağaza adı" />
        <FormField label="Başlangıç" value={campaignForm.startDate} onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })} placeholder="GG.AA.YYYY" />
        <FormField label="Bitiş" value={campaignForm.endDate} onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })} placeholder="GG.AA.YYYY" />
      </FormSection>
    </>
  )

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Kampanya Yönetimi</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Kampanya Yönetimi</h1>
            <p className={s.contentSub}>İndirim, fırsat ve kampanyaları girin — kullanıcılar Fırsatlar sayfasında görür</p>
          </div>
          <button className={s.primaryBtn} onClick={() => { setCampaignForm(EMPTY_CAMPAIGN); setShowAddCampaign(true) }} type="button">
            <Tag size={18} />Yeni Kampanya Ekle
          </button>
        </div>

        <div className={s.toolbar}>
          <div className={s.search}>
            <Search size={18} color="#8b95a5" />
            <input placeholder="Kampanya, kod veya mağaza ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className={s.empty}>
            <Tag size={48} color="#8b95a5" style={{ marginBottom: 16 }} />
            <p className={s.emptyTitle}>Henüz kampanya eklenmedi.</p>
            <p className={s.emptySub}>Yeni Kampanya Ekle ile indirim ve fırsat oluşturun.</p>
          </div>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr><th>#</th><th>Başlık</th><th>Tür</th><th>İndirim</th><th>Kod</th><th>Mağaza</th><th>Tarih</th><th>Durum</th><th></th></tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c, i) => (
                  <tr key={c.id}>
                    <td>{i + 1}</td>
                    <td><strong>{c.title}</strong></td>
                    <td>{campaignTypeMap[c.type]}</td>
                    <td>{c.discountType === 'percent' ? `%${c.discountValue}` : `₺${c.discountValue}`}</td>
                    <td><code>{c.promoCode}</code></td>
                    <td>{c.siteName}</td>
                    <td>{c.startDate} — {c.endDate}</td>
                    <td><span className={`${s.badge} ${campaignStatusMap[c.status].cls}`}>{campaignStatusMap[c.status].label}</span></td>
                    <td>
                      <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => { setSelectedCampaign(c); setCampaignForm({ title: c.title, description: c.description, type: c.type, discountType: c.discountType, discountValue: c.discountValue, promoCode: c.promoCode, siteId: c.siteId ?? '', siteName: c.siteName, startDate: c.startDate, endDate: c.endDate }); setShowEditCampaign(true) }} type="button"><Pencil size={14} />Düzenle</button>
                      <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => { setSelectedCampaign(c); setShowDeleteCampaign(true) }} type="button"><Trash2 size={14} />Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={ls.previewSection}>
          <h2><Eye size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Kullanıcı Önizlemesi — Aktif Fırsatlar</h2>
          <p className={ls.previewSub}>Müşteriler ve sürücüler Fırsatlar & Kampanyalar sayfasında bunları görür.</p>
          <CampaignCards campaigns={activeCampaigns} />
        </div>
      </div>

      <Modal open={showAddCampaign} onClose={() => setShowAddCampaign(false)} title="Yeni Kampanya Ekle" subtitle="İndirim, fırsat veya kampanya oluşturun" wide
        footer={<button className={s.submitFull} disabled={!campaignForm.title || !campaignForm.discountValue} onClick={() => { addCampaign({ ...campaignForm, siteId: null }); setShowAddCampaign(false); setSuccessMsg('Kampanya yayınlandı.'); setShowSuccess(true) }} type="button">Yayınla</button>}>
        {campaignFields}
      </Modal>

      <Modal open={showEditCampaign} onClose={() => setShowEditCampaign(false)} title="Kampanyayı Düzenle" wide
        footer={<button className={s.submitFull} onClick={() => { if (selectedCampaign) updateCampaign(selectedCampaign.id, { ...campaignForm, siteId: null }); setShowEditCampaign(false) }} type="button">Kaydet</button>}>
        {campaignFields}
        <FormSelect label="Durum" value={selectedCampaign?.status ?? 'active'} onChange={(e) => selectedCampaign && updateCampaign(selectedCampaign.id, { status: e.target.value as Campaign['status'] })}>
          <option value="active">Yayında</option>
          <option value="draft">Taslak</option>
          <option value="expired">Süresi Doldu</option>
        </FormSelect>
      </Modal>

      <ConfirmDeleteModal open={showDeleteCampaign} onClose={() => setShowDeleteCampaign(false)} title="Kampanyayı silmek istiyor musunuz?" confirmLabel="Sil" onConfirm={() => { if (selectedCampaign) deleteCampaign(selectedCampaign.id); setShowDeleteCampaign(false) }} />
      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} title="Başarılı" body={successMsg} />
    </>
  )
}
