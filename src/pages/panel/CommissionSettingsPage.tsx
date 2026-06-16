import { useState } from 'react'
import { Plus, Pencil, Trash2, Percent, Car } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSection } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { usePanelData, PlatformSetting } from '../../context/PanelDataContext'
import { computeAdminSummary } from '../../utils/platformStats'
import { formatMoney } from '../../data/mockTaxiData'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import cs from './CommissionSettingsPage.module.css'

const EMPTY_PLATFORM = {
  name: '',
  color: '#0a6b6b',
  platformCommissionRate: '10',
  adminCommissionRate: '1',
}

const PRESET_COLORS = ['#000000', '#FFCC00', '#1a1a1a', '#FFD600', '#0a6b6b', '#e91e63', '#2196F3']

export default function CommissionSettingsPage() {
  const { platformSettings, addPlatform, updatePlatform, deletePlatform } = usePanelData()
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [selected, setSelected] = useState<PlatformSetting | null>(null)
  const [form, setForm] = useState(EMPTY_PLATFORM)

  const stats = computeAdminSummary(platformSettings)

  const openAdd = () => {
    setForm(EMPTY_PLATFORM)
    setShowAdd(true)
  }

  const openEdit = (p: PlatformSetting) => {
    setSelected(p)
    setForm({
      name: p.name,
      color: p.color,
      platformCommissionRate: String(p.platformCommissionRate),
      adminCommissionRate: String(p.adminCommissionRate),
    })
    setShowEdit(true)
  }

  const parseForm = () => ({
    name: form.name.trim(),
    color: form.color,
    platformCommissionRate: Number(form.platformCommissionRate) || 0,
    adminCommissionRate: Number(form.adminCommissionRate) || 0,
  })

  const saveAdd = () => {
    const data = parseForm()
    if (!data.name) return
    addPlatform(data)
    setShowAdd(false)
    setSuccessMsg(`${data.name} platformu eklendi.`)
    setShowSuccess(true)
  }

  const saveEdit = () => {
    if (!selected) return
    const data = parseForm()
    if (!data.name) return
    updatePlatform(selected.id, data)
    setShowEdit(false)
    setSuccessMsg('Komisyon oranları güncellendi.')
    setShowSuccess(true)
  }

  const formFields = (
    <>
      <FormSection title="Platform Bilgileri">
        <FormField label="Platform Adı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Örn: Martı, Uber" />
        <div className={cs.colorRow}>
          <FormField label="Renk Kodu" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
          <div className={cs.colorPresets}>
            {PRESET_COLORS.map((c) => (
              <button key={c} type="button" className={cs.colorSwatch} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} aria-label={c} />
            ))}
          </div>
        </div>
      </FormSection>
      <FormSection title="Komisyon Oranları">
        <FormField
          label="Platform Komisyonu (%)"
          type="number"
          value={form.platformCommissionRate}
          onChange={(e) => setForm({ ...form, platformCommissionRate: e.target.value })}
          placeholder="10"
        />
        <p className={cs.fieldHint}>Uber, Yandex vb. platformların aldığı komisyon oranı</p>
        <FormField
          label="Admin Payı (%)"
          type="number"
          value={form.adminCommissionRate}
          onChange={(e) => setForm({ ...form, adminCommissionRate: e.target.value })}
          placeholder="1"
        />
        <p className={cs.fieldHint}>Toplam ciro üzerinden admin hakediş oranı</p>
      </FormSection>
    </>
  )

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Komisyon Ayarları</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Komisyon & Platform Ayarları</h1>
            <p className={s.contentSub}>Taksi platformlarını ekleyin, platform ve admin komisyon oranlarını belirleyin</p>
          </div>
          <button className={s.primaryBtn} onClick={openAdd} type="button">
            <Plus size={18} />Platform Ekle
          </button>
        </div>

        <div className={cs.grid}>
          {stats.map((p) => (
            <div key={p.id} className={cs.card} style={{ borderTopColor: p.color }}>
              <div className={cs.cardHead}>
                <h3><Car size={18} /> {p.name}</h3>
                <div className={cs.cardActions}>
                  <button type="button" className={s.actionLink} onClick={() => openEdit(platformSettings.find((x) => x.id === p.id)!)}>
                    <Pencil size={14} /> Düzenle
                  </button>
                  <button
                    type="button"
                    className={`${s.actionLink} ${s.actionDelete}`}
                    onClick={() => { setSelected(platformSettings.find((x) => x.id === p.id)!); setShowDelete(true) }}
                  >
                    <Trash2 size={14} /> Sil
                  </button>
                </div>
              </div>
              <div className={cs.rates}>
                <div className={cs.rateBox}>
                  <Percent size={16} />
                  <div>
                    <span>Platform Komisyonu</span>
                    <strong>%{p.platformCommissionRate}</strong>
                  </div>
                </div>
                <div className={cs.rateBox}>
                  <Percent size={16} />
                  <div>
                    <span>Admin Payı</span>
                    <strong>%{p.adminCommissionRate}</strong>
                  </div>
                </div>
              </div>
              <div className={cs.preview}>
                <div><span>Hacim</span><strong>{formatMoney(p.totalVolume)}</strong></div>
                <div><span>Platform Kesintisi</span><strong>{formatMoney(p.platformCommission)}</strong></div>
                <div><span>Admin Hakediş</span><strong className={cs.adminPay}>{formatMoney(p.adminEarnings)}</strong></div>
                <div><span>Plaka / Yolculuk</span><strong>{p.plateCount} / {p.tripCount}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {platformSettings.length === 0 && (
          <div className={s.empty}>
            <p className={s.emptyTitle}>Henüz platform tanımlanmadı.</p>
            <p className={s.emptySub}>Platform Ekle ile Uber, Yandex veya yeni platform ekleyin.</p>
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Platform Ekle" subtitle="Platform adı ve komisyon oranlarını girin" wide
        footer={<button className={s.submitFull} disabled={!form.name.trim()} onClick={saveAdd} type="button">Platformu Ekle</button>}>
        {formFields}
      </Modal>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Komisyon Oranlarını Düzenle" wide
        footer={<button className={s.submitFull} disabled={!form.name.trim()} onClick={saveEdit} type="button">Kaydet</button>}>
        {formFields}
      </Modal>

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={`${selected?.name} platformunu silmek istiyor musunuz?`}
        confirmLabel="Sil"
        onConfirm={() => { if (selected) deletePlatform(selected.id); setShowDelete(false) }}
      />

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} title="Başarılı" body={successMsg} />
    </>
  )
}
