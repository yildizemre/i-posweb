import { useState, FormEvent, useRef, useCallback, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff, X } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { APP_NAME } from '../constants/brand'
import styles from './RegisterPage.module.css'

const AGREEMENT_TEXT = Array.from({ length: 8 }, (_, i) => ({
  title: `Madde ${i + 1}`,
  body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
}))

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: 'Emre',
    surname: 'Yıldız',
    phone: '+90 552 265 67 07',
    email: 'emre@example.com',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    if (atBottom) setScrolledToBottom(true)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setShowAgreement(true)
      return
    }
    alert('Kayıt başarılı! (Demo)')
  }

  return (
    <AuthLayout>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Kayıt ol.</h1>
        <p className={styles.subtitle}>Bilgilerinizi girerek hesap oluşturunuz.</p>

        <div className={styles.fields}>
          <FormInput label="Adınız" value={form.name} onChange={update('name')} />
          <FormInput label="Soyadınız" value={form.surname} onChange={update('surname')} />
          <FormInput
            label="Cep No"
            value={form.phone}
            onChange={update('phone')}
            icon={<CheckCircle2 size={20} color="var(--success)" fill="var(--success)" stroke="white" />}
          />
          <FormInput label="E-Posta" type="email" value={form.email} onChange={update('email')} />
          <FormInput
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={update('password')}
            placeholder="Şifrenizi giriniz"
            icon={
              <button type="button" className={styles.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} color="var(--text-muted)" /> : <Eye size={20} color="var(--text-muted)" />}
              </button>
            }
          />
        </div>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => {
              if (!agreed) setShowAgreement(true)
              else setAgreed(false)
            }}
          />
          <span>
            <button type="button" className={styles.agreementLink} onClick={() => setShowAgreement(true)}>
              Kullanıcı Sözleşmesi
            </button>
            'ni okudum ve kabul ediyorum.
          </span>
        </label>

        <button type="submit" className={styles.submitBtn}>
          Devam Et
        </button>

        <p className={styles.login}>
          Hesabın var mı? <Link to="/giris" className={styles.loginLink}>Giriş Yap</Link>
        </p>
      </form>

      {showAgreement && (
        <div className={styles.overlay} onClick={() => setShowAgreement(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h2>{APP_NAME} Kullanıcı Sözleşmesi</h2>
                <p className={styles.modalDate}>Son Düzenleme Tarihi: 20 Nisan 2024, Pazar</p>
              </div>
              <button type="button" className={styles.closeBtn} onClick={() => setShowAgreement(false)}>
                <X size={20} color="var(--error)" />
              </button>
            </div>

            {!scrolledToBottom && (
              <p className={styles.scrollWarning}>Onaylamak için en aşağıya kadar kaydır.</p>
            )}

            <div className={styles.modalBody} ref={scrollRef} onScroll={handleScroll}>
              {AGREEMENT_TEXT.map((section) => (
                <div key={section.title} className={styles.article}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={`${styles.acceptBtn} ${scrolledToBottom ? styles.acceptActive : ''}`}
              disabled={!scrolledToBottom}
              onClick={() => {
                setAgreed(true)
                setShowAgreement(false)
              }}
            >
              Kabul Et ve Kapat
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  )
}
