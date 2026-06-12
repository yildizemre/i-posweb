import { useState, useRef, useCallback } from 'react'
import { Phone, Mail, Lock, Clock, Pencil, ChevronRight, X } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSelect } from '../../components/dashboard/FormField'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { useProfile } from '../../context/ProfileContext'
import { APP_NAME } from '../../constants/brand'
import s from './SettingsPage.module.css'

const AGREEMENT = Array.from({ length: 6 }, (_, i) => ({
  title: `Madde ${i + 1}`,
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
}))

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile()
  const [modal, setModal] = useState<'password' | 'phone' | 'email' | 'agreement' | null>(null)
  const [success, setSuccess] = useState(false)
  const [phoneForm, setPhoneForm] = useState('')
  const [emailForm, setEmailForm] = useState('')
  const [toggles, setToggles] = useState({ sms: true, email: true, phone: true, voice: false })
  const [, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true)
  }, [])

  const closeModal = () => { setModal(null); setScrolled(false) }
  const saveAndSuccess = () => { closeModal(); setSuccess(true) }

  const savePhone = () => {
    if (phoneForm) updateProfile({ phone: phoneForm })
    saveAndSuccess()
  }

  const saveEmail = () => {
    if (emailForm) updateProfile({ email: emailForm })
    saveAndSuccess()
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Ayarlar</div>
      <div className={s.grid}>
        <div className={s.card}>
          <h2>Oturum Açma Seçenekleriniz</h2>
          <p className={s.cardSub}>Hesap güvenliğiniz için bilgilerinizi güncel tutun.</p>
          <div className={s.row}><Phone size={18} color="var(--teal)" /><div className={s.rowInfo}><strong>Telefon Numaranız</strong><span>Son değişiklik: 7 Eyl 2023</span></div><span>{profile.phone}</span><button onClick={() => { setPhoneForm(''); setModal('phone') }} type="button"><Pencil size={16} /></button></div>
          <div className={s.row}><Mail size={18} color="var(--teal)" /><div className={s.rowInfo}><strong>E-Posta Adresiniz</strong><span>Son değişiklik: 7 Eyl 2023</span></div><span>{profile.email}</span><button onClick={() => { setEmailForm(''); setModal('email') }} type="button"><Pencil size={16} /></button></div>
          <div className={s.row}><Lock size={18} color="var(--teal)" /><div className={s.rowInfo}><strong>Şifreniz</strong><span>Son değişiklik: Az önce</span></div><span>••••••</span><button onClick={() => setModal('password')}><Pencil size={16} /></button></div>
          <div className={s.row}><Clock size={18} color="var(--teal)" /><div className={s.rowInfo}><strong>Şifre Güncelleme Sıklığı</strong><span>Şifrenizi düzenli aralıklarla güncelleyin.</span></div><span>6 Ay</span></div>
        </div>

        <div className={s.card}>
          <h2>Başarısız Giriş Denemeleri</h2>
          <p className={s.cardSub}>Son başarısız giriş denemeleriniz.</p>
          {['17.04.2024 - 11:46:12', '16.04.2024 - 09:22:05', '15.04.2024 - 18:30:44', '14.04.2024 - 14:15:33'].map((t) => (
            <div key={t} className={s.failRow}><div><strong>Şifre Denemesi Hatası</strong><span>{t}</span></div><span className={s.webBadge}>WEB Panel</span></div>
          ))}
        </div>

        <div className={s.card}>
          <h2>İletişim İzinleri</h2>
          <p className={s.cardSub}>Açtığınızda ticari ileti izni vermiş olursunuz.</p>
          {([['sms', 'SMS Mesajları'], ['email', 'E-Posta Bültenleri'], ['phone', 'Telefon Çağrıları'], ['voice', 'Sesli Yanıt Sistemi']] as const).map(([key, label]) => (
            <div key={key} className={s.toggleRow}><span>{label}</span>
              <button className={`${s.toggle} ${toggles[key] ? s.toggleOn : ''}`} onClick={() => setToggles({ ...toggles, [key]: !toggles[key] })}><span className={s.toggleKnob} /></button>
            </div>
          ))}
        </div>

        <div className={s.card}>
          <h2>Onayladığınız Sözleşmeler</h2>
          <p className={s.cardSub}>Kabul ettiğiniz sözleşmeleri görüntüleyin.</p>
          {[{ t: 'KVKK Aydınlatma Metni', v: 'v1.2 - 12.03.2024' }, { t: 'Açık Rıza Metni', v: 'v1.0 - 01.01.2024' }, { t: `${APP_NAME} Kullanıcı Sözleşmesi`, v: 'v2.1 - 20.04.2024' }].map((a) => (
            <button key={a.t} className={s.agreeRow} onClick={() => setModal('agreement')}><div><strong>{a.t}</strong><span>{a.v}</span></div><ChevronRight size={18} /></button>
          ))}
        </div>
      </div>

      <Modal open={modal === 'password'} onClose={closeModal} title="Şifremi Değiştir" subtitle="Şifrenizi güncelleyebilirsiniz"
        footer={<button className={s.submitFull} onClick={saveAndSuccess}>Devam Et</button>}>
        <FormField label="Mevcut Şifreniz" defaultValue="145678" type="password" />
        <FormField label="Yeni Şifreniz" defaultValue="736579" type="password" />
        <FormField label="Yeni Şifreniz (Tekrardan)" defaultValue="••••••" type="password" />
        <FormSelect label="Şifre Değiştirme Süresi"><option>6 Ay</option><option>3 Ay</option><option>1 Ay</option></FormSelect>
      </Modal>

      <Modal open={modal === 'phone'} onClose={closeModal} title="Telefon Numaramı Değiştir" subtitle="Yeni numaranızı giriniz"
        footer={<button className={s.submitFull} onClick={savePhone} type="button">Devam Et</button>}>
        <FormField label="Mevcut Telefon Numaranız" value={profile.phone} readOnly />
        <FormField label="Yeni Telefon Numaranız" placeholder="+90 5XX XXX XX XX" value={phoneForm} onChange={(e) => setPhoneForm(e.target.value)} />
      </Modal>

      <Modal open={modal === 'email'} onClose={closeModal} title="E-Postamı Değiştir" subtitle="Yeni e-posta adresinizi giriniz"
        footer={<button className={s.submitFull} onClick={saveEmail} type="button">Devam Et</button>}>
        <FormField label="Yeni E-Posta Adresiniz" placeholder="ornek@mail.com" value={emailForm} onChange={(e) => setEmailForm(e.target.value)} />
      </Modal>

      {modal === 'agreement' && (
        <div className={s.agreeOverlay} onClick={closeModal}>
          <div className={s.agreeModal} onClick={(e) => e.stopPropagation()}>
            <div className={s.agreeHeader}>
              <div><h2>{APP_NAME} Kullanıcı Sözleşmesi</h2><p>Son Düzenleme Tarihi: 28 Nisan 2024, Pazar</p></div>
              <button onClick={closeModal}><X size={20} color="#e53935" /></button>
            </div>
            <div className={s.agreeBody} ref={scrollRef} onScroll={handleScroll}>
              {AGREEMENT.map((a) => (<div key={a.title} className={s.article}><h3>{a.title}</h3><p>{a.body}</p></div>))}
            </div>
          </div>
        </div>
      )}

      <SuccessModal open={success} onClose={() => setSuccess(false)} body="Değişiklikleriniz başarıyla kaydedildi." />
    </>
  )
}
