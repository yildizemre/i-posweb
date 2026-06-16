import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { SubWalletDriverAssign, OwnerWalletRecord } from '../../utils/ownerWallets'
import ow from '../../pages/panel/OwnerWalletPage.module.css'
import s from './panel.module.css'

const EMPTY_FORM: SubWalletDriverAssign = {
  fullName: '',
  tc: '',
  phone: '',
  walletNo: '',
}

type Props = {
  sub: OwnerWalletRecord
  onAssign: (subId: string, data: SubWalletDriverAssign) => { ok: boolean; error?: string }
  compact?: boolean
}

export default function SubWalletAssignCard({ sub, onAssign, compact }: Props) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<SubWalletDriverAssign>(EMPTY_FORM)
  const [error, setError] = useState('')

  const update = (field: keyof SubWalletDriverAssign, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const cancel = () => {
    setOpen(false)
    setForm(EMPTY_FORM)
    setError('')
  }

  const save = () => {
    const result = onAssign(sub.id, form)
    if (!result.ok) {
      setError(result.error ?? 'Kayıt başarısız.')
      return
    }
    cancel()
  }

  if (sub.driver) {
    return (
      <dl className={ow.driverInfo}>
        <div><dt>Ad Soyad</dt><dd>{sub.driver}</dd></div>
        {sub.driverTc && <div><dt>TC</dt><dd>{sub.driverTc}</dd></div>}
        {sub.driverPhone && <div><dt>Telefon</dt><dd>{sub.driverPhone}</dd></div>}
        {sub.driverWalletId && (
          <div>
            <dt>Cüzdan No</dt>
            <dd className={ow.driverWalletNo}>{sub.driverWalletId}</dd>
          </div>
        )}
      </dl>
    )
  }

  if (open) {
    return (
      <div className={`${ow.assignForm} ${compact ? ow.assignFormCompact : ''}`}>
        <label htmlFor={`name-${sub.id}`}>Ad Soyad</label>
        <input
          id={`name-${sub.id}`}
          type="text"
          value={form.fullName}
          onChange={(e) => update('fullName', e.target.value)}
          placeholder="Örn. Mehmet Yılmaz"
          autoFocus
        />
        <label htmlFor={`tc-${sub.id}`}>TC</label>
        <input
          id={`tc-${sub.id}`}
          type="text"
          inputMode="numeric"
          maxLength={11}
          value={form.tc}
          onChange={(e) => update('tc', e.target.value.replace(/\D/g, ''))}
          placeholder="11 haneli TC"
        />
        <label htmlFor={`phone-${sub.id}`}>Telefon</label>
        <input
          id={`phone-${sub.id}`}
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="0532 111 22 33"
        />
        <label htmlFor={`wallet-${sub.id}`}>Cüzdan No</label>
        <input
          id={`wallet-${sub.id}`}
          type="text"
          value={form.walletNo}
          onChange={(e) => update('walletNo', e.target.value.toUpperCase())}
          placeholder="CZD-100042"
        />
        {error && <p className={ow.assignError}>{error}</p>}
        <div className={ow.assignActions}>
          <button type="button" className={ow.assignSave} onClick={save}>Kaydet</button>
          <button type="button" className={ow.assignCancel} onClick={cancel}>İptal</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <p className={ow.subDriverEmpty}>Şoför atanmadı</p>
      <button type="button" className={ow.assignBtn} onClick={() => setOpen(true)}>
        <UserPlus size={16} /> Şoför Ata
      </button>
    </>
  )
}

export function SubWalletStatusBadge({ assigned }: { assigned: boolean }) {
  return <span className={s.badgeGreen}>{assigned ? 'Atanmış' : 'Boş'}</span>
}
