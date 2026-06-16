import { useMemo, useState } from 'react'
import { Pencil, Trash2, Search, Tag, Eye, TrendingUp, Wallet } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import CampaignCards from '../../components/dashboard/CampaignCards'
import { FormField, FormSection, FormSelect, FormTextarea } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { usePanelData, Campaign, CampaignType, CampaignCategory } from '../../context/PanelDataContext'
import {
  CATEGORY_LABELS, getDiscountedPrice, getMarginPerSale, getTotalCampaignEarnings, formatTry,
  buildPayoutWalletOptions, getPayoutWalletLabel,
} from '../../utils/campaignEconomics'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import ls from './SitesPage.module.css'

type CampaignForm = {
  title: string
  description: string
  type: CampaignType
  category: CampaignCategory
  discountType: 'percent' | 'amount'
  discountValue: string
  originalPrice: string
  salePrice: string
  redemptionCount: string
  promoCode: string
  siteId: string
  siteName: string
  startDate: string
  endDate: string
  payoutWalletId: string
}

const EMPTY_CAMPAIGN: CampaignForm = {
  title: '', description: '', type: 'firsat', category: 'lastik',
  discountType: 'percent', discountValue: '', originalPrice: '', salePrice: '',
  redemptionCount: '', promoCode: '', siteId: '', siteName: '', startDate: '', endDate: '',
  payoutWalletId: '',
}

function isCampaignFormValid(form: CampaignForm) {
  const textFields = [
    form.title, form.description, form.discountValue, form.originalPrice,
    form.salePrice, form.redemptionCount, form.promoCode, form.siteName,
    form.startDate, form.endDate, form.payoutWalletId,
  ]
  if (textFields.some((v) => !String(v).trim())) return false
  if (Number(form.originalPrice) <= 0) return false
  if (Number(form.salePrice) <= 0) return false
  if (Number(form.discountValue) < 0) return false
  if (Number(form.redemptionCount) < 0 || Number.isNaN(Number(form.redemptionCount))) return false
  return true
}

const campaignStatusMap = {
  active: { label: 'Yayında', cls: s.badgeGreen },
  draft: { label: 'Taslak', cls: s.badgeBlue },
  expired: { label: 'Süresi Doldu', cls: s.badgeRed },
}

function campaignToForm(c: Campaign): CampaignForm {
  return {
    title: c.title, description: c.description, type: c.type, category: c.category,
    discountType: c.discountType, discountValue: c.discountValue,
    originalPrice: String(c.originalPrice), salePrice: String(c.salePrice),
    redemptionCount: String(c.redemptionCount), promoCode: c.promoCode,
    siteId: c.siteId ?? '', siteName: c.siteName, startDate: c.startDate, endDate: c.endDate,
    payoutWalletId: c.payoutWalletId,
  }
}

function formToCampaign(form: CampaignForm): Omit<Campaign, 'id' | 'status'> {
  return {
    title: form.title,
    description: form.description,
    type: form.type,
    category: form.category,
    discountType: form.discountType,
    discountValue: form.discountValue,
    originalPrice: Number(form.originalPrice) || 0,
    salePrice: Number(form.salePrice) || 0,
    redemptionCount: Number(form.redemptionCount) || 0,
    promoCode: form.promoCode,
    siteId: form.siteId || null,
    siteName: form.siteName,
    startDate: form.startDate,
    endDate: form.endDate,
    payoutWalletId: form.payoutWalletId.trim(),
  }
}

function MarginPreview({ form, walletLabel }: { form: CampaignForm; walletLabel: string }) {
  const draft = formToCampaign(form)
  const discounted = getDiscountedPrice(draft)
  const margin = getMarginPerSale(draft)
  const total = getTotalCampaignEarnings(draft)

  if (!draft.originalPrice) return null

  return (
    <div className={ls.marginBox}>
      <h4><TrendingUp size={16} /> Kazanç Hesabı</h4>
      <div className={ls.marginGrid}>
        <div><span>Liste fiyatı</span><strong>{formatTry(draft.originalPrice)}</strong></div>
        <div><span>İndirimli fiyat (müşteri avantajı)</span><strong>{formatTry(discounted)}</strong></div>
        <div><span>Satış fiyatı ({APP_NAME})</span><strong>{formatTry(draft.salePrice)}</strong></div>
        <div><span>Satış başına kazanç</span><strong className={ls.teal}>{formatTry(margin)}</strong></div>
        <div><span>Kullanım sayısı</span><strong>{draft.redemptionCount}</strong></div>
        <div><span>Toplam kazanç</span><strong className={ls.teal}>{formatTry(total)}</strong></div>
        {form.payoutWalletId && (
          <div className={ls.walletPayout}>
            <Wallet size={16} />
            <div>
              <span>Aktarım cüzdanı</span>
              <strong>{walletLabel || form.payoutWalletId}</strong>
              <em>{formatTry(total)} bu cüzdana gönderilecek</em>
            </div>
          </div>
        )}
      </div>
      <p className={ls.marginHint}>
        Örnek: Lastik {formatTry(100)}, %{form.discountValue} indirim → {formatTry(discounted)} taban fiyat,
        {formatTry(draft.salePrice)}&apos;den satış = satış başına {formatTry(margin)} kazanç.
      </p>
    </div>
  )
}

export default function SitesPage() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, activeCampaigns, wallets } = usePanelData()
  const walletOptions = useMemo(() => buildPayoutWalletOptions(wallets), [wallets])
  const [showAddCampaign, setShowAddCampaign] = useState(false)
  const [showEditCampaign, setShowEditCampaign] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [showDeleteCampaign, setShowDeleteCampaign] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [campaignForm, setCampaignForm] = useState(EMPTY_CAMPAIGN)
  const formValid = useMemo(() => isCampaignFormValid(campaignForm), [campaignForm])

  const totalCampaignEarnings = useMemo(
    () => campaigns.reduce((sum, c) => sum + getTotalCampaignEarnings(c), 0),
    [campaigns],
  )

  const filteredCampaigns = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.promoCode.toLowerCase().includes(search.toLowerCase()) ||
    c.siteName.toLowerCase().includes(search.toLowerCase()) ||
    CATEGORY_LABELS[c.category].toLowerCase().includes(search.toLowerCase())
  )

  const openDetail = (c: Campaign) => {
    setSelectedCampaign(c)
    setShowDetail(true)
  }

  const campaignFields = (
    <>
      <FormSection title="Kampanya Bilgileri">
        <FormField label="Başlık *" value={campaignForm.title} onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })} placeholder="Kış Lastiği Seti" />
        <FormTextarea label="Açıklama *" value={campaignForm.description} onChange={(e) => setCampaignForm({ ...campaignForm, description: e.target.value })} />
        <FormSelect label="Kategori" value={campaignForm.category} onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value as CampaignCategory })}>
          <option value="lastik">Lastik</option>
          <option value="sigorta">Sigorta</option>
          <option value="yag">Yağ</option>
          <option value="oto-yikama">Oto Yıkama</option>
          <option value="genel">Genel</option>
        </FormSelect>
        <FormSelect label="Tür" value={campaignForm.type} onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as CampaignType })}>
          <option value="kampanya">Kampanya</option>
          <option value="indirim">İndirim</option>
          <option value="firsat">Fırsat</option>
        </FormSelect>
      </FormSection>
      <FormSection title="Fiyat & İndirim">
        <FormField label="Liste Fiyatı (₺) *" type="number" min="0" value={campaignForm.originalPrice} onChange={(e) => setCampaignForm({ ...campaignForm, originalPrice: e.target.value })} placeholder="100" />
        <FormSelect label="İndirim Tipi" value={campaignForm.discountType} onChange={(e) => setCampaignForm({ ...campaignForm, discountType: e.target.value as 'percent' | 'amount' })}>
          <option value="percent">Yüzde (%)</option>
          <option value="amount">Tutar (₺)</option>
        </FormSelect>
        <FormField label={`${campaignForm.discountType === 'percent' ? 'İndirim Oranı (%)' : 'İndirim Tutarı (₺)'} *`} value={campaignForm.discountValue} onChange={(e) => setCampaignForm({ ...campaignForm, discountValue: e.target.value })} />
        <FormField label={`Satış Fiyatı (₺) — ${APP_NAME} üzerinden *`} type="number" min="0" value={campaignForm.salePrice} onChange={(e) => setCampaignForm({ ...campaignForm, salePrice: e.target.value })} placeholder="85" />
        <FormField label="Kullanım Sayısı (satış adedi) *" type="number" min="0" value={campaignForm.redemptionCount} onChange={(e) => setCampaignForm({ ...campaignForm, redemptionCount: e.target.value })} placeholder="0" />
        <FormField label="Promosyon Kodu *" value={campaignForm.promoCode} onChange={(e) => setCampaignForm({ ...campaignForm, promoCode: e.target.value.toUpperCase() })} placeholder="LASTIK20" />
      </FormSection>
      <FormSection title="Kazanç Aktarım Cüzdanı">
        <FormSelect
          label="Hedef Cüzdan *"
          value={campaignForm.payoutWalletId}
          onChange={(e) => setCampaignForm({ ...campaignForm, payoutWalletId: e.target.value })}
        >
          <option value="">Cüzdan seçin *</option>
          {walletOptions.map((w) => (
            <option key={w.walletId} value={w.walletId}>{w.label}</option>
          ))}
        </FormSelect>
        <FormField
          label="veya Cüzdan ID girin *"
          value={campaignForm.payoutWalletId}
          onChange={(e) => setCampaignForm({ ...campaignForm, payoutWalletId: e.target.value.toUpperCase() })}
          placeholder="CZD-KAMPANYA"
        />
        <p className={ls.fieldHint}>Kampanya kazancı her satış sonrası bu cüzdan ID&apos;sine aktarılır.</p>
      </FormSection>
      <MarginPreview
        form={campaignForm}
        walletLabel={getPayoutWalletLabel(campaignForm.payoutWalletId, wallets)}
      />
      <FormSection title="Hedef & Tarih">
        <FormField label="Partner / Mağaza *" value={campaignForm.siteName} onChange={(e) => setCampaignForm({ ...campaignForm, siteName: e.target.value })} />
        <FormField label="Başlangıç *" value={campaignForm.startDate} onChange={(e) => setCampaignForm({ ...campaignForm, startDate: e.target.value })} placeholder="GG.AA.YYYY" />
        <FormField label="Bitiş *" value={campaignForm.endDate} onChange={(e) => setCampaignForm({ ...campaignForm, endDate: e.target.value })} placeholder="GG.AA.YYYY" />
      </FormSection>
    </>
  )

  const detailCampaign = selectedCampaign
  const detailMargin = detailCampaign ? getMarginPerSale(detailCampaign) : 0
  const detailEarned = detailCampaign ? getTotalCampaignEarnings(detailCampaign) : 0
  const detailDiscounted = detailCampaign ? getDiscountedPrice(detailCampaign) : 0

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Kampanya Yönetimi</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Kampanya Yönetimi</h1>
            <p className={s.contentSub}>
              Sigorta, lastik, yağ, oto yıkama fırsatları — satış başına ve toplam kazancınızı takip edin
            </p>
          </div>
          <button className={s.primaryBtn} onClick={() => { setCampaignForm(EMPTY_CAMPAIGN); setShowAddCampaign(true) }} type="button">
            <Tag size={18} />Yeni Kampanya Ekle
          </button>
        </div>

        <div className={ls.summaryRow}>
          <div className={ls.summaryCard}>
            <span>Aktif Fırsat</span>
            <strong>{activeCampaigns.length}</strong>
          </div>
          <div className={ls.summaryCard}>
            <span>Toplam Kampanya Kazancı</span>
            <strong className={ls.teal}>{formatTry(totalCampaignEarnings)}</strong>
          </div>
        </div>

        <div className={s.toolbar}>
          <div className={s.search}>
            <Search size={18} color="#8b95a5" />
            <input placeholder="Kampanya, kategori veya kod ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {campaigns.length === 0 ? (
          <div className={s.empty}>
            <Tag size={48} color="#8b95a5" style={{ marginBottom: 16 }} />
            <p className={s.emptyTitle}>Henüz kampanya eklenmedi.</p>
          </div>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>#</th><th>Başlık</th><th>Kategori</th><th>İndirim</th>
                  <th>Satış Fiyatı</th><th>Kazanç/Satış</th><th>Toplam Kazanç</th><th>Cüzdan ID</th><th>Kullanım</th><th>Durum</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((c, i) => (
                  <tr key={c.id} className={ls.clickRow} onClick={() => openDetail(c)}>
                    <td>{i + 1}</td>
                    <td><strong>{c.title}</strong></td>
                    <td><span className={ls.catTag}>{CATEGORY_LABELS[c.category]}</span></td>
                    <td>{c.discountType === 'percent' ? `%${c.discountValue}` : `₺${c.discountValue}`}</td>
                    <td>{c.salePrice ? formatTry(c.salePrice) : '—'}</td>
                    <td><strong className={ls.teal}>{formatTry(getMarginPerSale(c))}</strong></td>
                    <td><strong>{formatTry(getTotalCampaignEarnings(c))}</strong></td>
                    <td><code className={ls.walletCode}>{c.payoutWalletId || '—'}</code></td>
                    <td>{c.redemptionCount}</td>
                    <td><span className={`${s.badge} ${campaignStatusMap[c.status].cls}`}>{campaignStatusMap[c.status].label}</span></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => { setSelectedCampaign(c); setCampaignForm(campaignToForm(c)); setShowEditCampaign(true) }} type="button"><Pencil size={14} />Düzenle</button>
                      <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => { setSelectedCampaign(c); setShowDeleteCampaign(true) }} type="button"><Trash2 size={14} />Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={ls.previewSection}>
          <h2><Eye size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />Aktif Fırsatlar — Önizleme</h2>
          <p className={ls.previewSub}>Karta tıklayarak kampanya kazancı detayını görün.</p>
          <CampaignCards campaigns={activeCampaigns} showEarnings onSelect={openDetail} />
        </div>
      </div>

      <Modal open={showDetail && !!detailCampaign} onClose={() => setShowDetail(false)} title={detailCampaign?.title ?? ''} subtitle="Kampanya kazanç detayı" wide
        footer={
          <button className={s.submitFull} onClick={() => { if (detailCampaign) { setCampaignForm(campaignToForm(detailCampaign)); setShowDetail(false); setShowEditCampaign(true) } }} type="button">
            Düzenle
          </button>
        }>
        {detailCampaign && (
          <>
            <p className={ls.detailDesc}>{detailCampaign.description}</p>
            <div className={ls.detailGrid}>
              <div><span>Kategori</span><strong>{CATEGORY_LABELS[detailCampaign.category]}</strong></div>
              <div><span>Partner</span><strong>{detailCampaign.siteName}</strong></div>
              <div><span>Liste fiyatı</span><strong>{formatTry(detailCampaign.originalPrice)}</strong></div>
              <div><span>İndirim</span><strong>{detailCampaign.discountType === 'percent' ? `%${detailCampaign.discountValue}` : formatTry(Number(detailCampaign.discountValue))}</strong></div>
              <div><span>İndirimli taban</span><strong>{formatTry(detailDiscounted)}</strong></div>
              <div><span>Satış fiyatı</span><strong>{formatTry(detailCampaign.salePrice)}</strong></div>
              <div><span>Satış başına kazanç</span><strong className={ls.teal}>{formatTry(detailMargin)}</strong></div>
              <div><span>Kullanım</span><strong>{detailCampaign.redemptionCount} adet</strong></div>
              <div className={ls.full}><span>Bu kampanyadan toplam kazanç</span><strong className={ls.bigEarn}>{formatTry(detailEarned)}</strong></div>
              <div className={ls.full}>
                <span>Aktarım cüzdanı</span>
                <strong><Wallet size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{getPayoutWalletLabel(detailCampaign.payoutWalletId, wallets)}</strong>
                <em style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  {formatTry(detailEarned)} → <code>{detailCampaign.payoutWalletId}</code> cüzdanına gönderildi / gönderilecek
                </em>
              </div>
            </div>
            <p className={ls.marginHint}>
              {formatTry(detailCampaign.originalPrice)} liste → %{detailCampaign.discountValue} indirim = {formatTry(detailDiscounted)} taban.
              {formatTry(detailCampaign.salePrice)}&apos;den {detailCampaign.redemptionCount} satış = {formatTry(detailEarned)} toplam kazanç.
            </p>
          </>
        )}
      </Modal>

      <Modal open={showAddCampaign} onClose={() => setShowAddCampaign(false)} title="Yeni Kampanya Ekle" subtitle="Tüm alanları doldurun — * zorunlu" wide
        footer={
          <>
            {!formValid && <p className={ls.formError}>Kaydetmek için tüm zorunlu alanları doldurun.</p>}
            <button
              className={s.submitFull}
              disabled={!formValid}
              onClick={() => {
                if (!formValid) return
                addCampaign(formToCampaign(campaignForm))
                setShowAddCampaign(false)
                setSuccessMsg('Kampanya yayınlandı.')
                setShowSuccess(true)
              }}
              type="button"
            >
              Yayınla
            </button>
          </>
        }>
        {campaignFields}
      </Modal>

      <Modal open={showEditCampaign} onClose={() => setShowEditCampaign(false)} title="Kampanyayı Düzenle" subtitle="Tüm alanları doldurun — * zorunlu" wide
        footer={
          <>
            {!formValid && <p className={ls.formError}>Kaydetmek için tüm zorunlu alanları doldurun.</p>}
            <button
              className={s.submitFull}
              disabled={!formValid}
              onClick={() => {
                if (!formValid || !selectedCampaign) return
                updateCampaign(selectedCampaign.id, formToCampaign(campaignForm))
                setShowEditCampaign(false)
              }}
              type="button"
            >
              Kaydet
            </button>
          </>
        }>
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
