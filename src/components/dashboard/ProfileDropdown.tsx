import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Settings, LogOut, User, Building2, Pencil } from 'lucide-react'
import Modal from './Modal'
import { FormField } from './FormField'
import { useProfile } from '../../context/ProfileContext'
import { useAuth } from '../../context/AuthContext'
import { USER_INITIALS } from '../../constants/brand'
import s from './ProfileDropdown.module.css'
import modalS from './panel.module.css'

export default function ProfileDropdown() {
  const { profile, updateProfile } = useProfile()
  const { logout: authLogout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState(profile)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initials = profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || USER_INITIALS

  const openEdit = () => {
    setForm(profile)
    setOpen(false)
    setShowEdit(true)
  }

  const saveProfile = () => {
    updateProfile(form)
    setShowEdit(false)
  }

  const logout = () => {
    setOpen(false)
    authLogout()
    navigate('/giris')
  }

  return (
    <>
      <div className={s.wrap} ref={ref}>
        <button className={s.trigger} onClick={() => setOpen(!open)} type="button">
          <div className={s.avatar}>{initials}</div>
          <div className={s.info}>
            <span className={s.role}>{profile.role}</span>
            <span className={s.name}>{profile.name}</span>
          </div>
          <ChevronDown size={14} className={`${s.chevron} ${open ? s.chevronOpen : ''}`} />
        </button>

        {open && (
          <div className={s.menu}>
            <div className={s.menuHeader}>
              <div className={s.avatarLg}>{initials}</div>
              <div>
                <strong>{profile.name}</strong>
                <span>{profile.email}</span>
              </div>
            </div>
            <div className={s.divider} />
            <button className={s.menuItem} onClick={openEdit} type="button">
              <Pencil size={16} /> Profili Düzenle
            </button>
            <button className={s.menuItem} onClick={() => { setOpen(false); navigate('/panel/ayarlar') }} type="button">
              <Settings size={16} /> Ayarlar
            </button>
            {isAdmin && (
              <button className={s.menuItem} onClick={() => { setOpen(false); navigate('/sirket-sec') }} type="button">
                <Building2 size={16} /> Şirket Değiştir
              </button>
            )}
            {isAdmin && (
              <button className={s.menuItem} onClick={() => { setOpen(false); navigate('/panel/kullanicilar') }} type="button">
                <User size={16} /> Kullanıcı Yönetimi
              </button>
            )}
            <div className={s.divider} />
            <button className={`${s.menuItem} ${s.logout}`} onClick={logout} type="button">
              <LogOut size={16} /> Çıkış Yap
            </button>
          </div>
        )}
      </div>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Profili Düzenle" subtitle="Hesap bilgilerinizi güncelleyin"
        footer={<button className={modalS.submitFull} onClick={saveProfile} type="button">Kaydet</button>}>
        <FormField label="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormField label="E-Posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <FormField label="Telefon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </Modal>
    </>
  )
}
