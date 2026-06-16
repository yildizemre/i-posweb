import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import { useAuth } from '../context/AuthContext'
import { useAccount } from '../context/AccountContext'
import { useProfile } from '../context/ProfileContext'
import { DemoUser } from '../data/demoUsers'
import styles from './LoginPage.module.css'

const QUICK_LOGINS = [
  { label: 'Admin', login: 'admin', password: 'admin', highlight: false },
  { label: 'Emre Yıldız (Filo)', login: 'user', password: 'user', highlight: true },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { setType } = useAccount()
  const { updateProfile } = useProfile()
  const [phone, setPhone] = useState('user')
  const [password, setPassword] = useState('user')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [touched, setTouched] = useState({ phone: false, password: false })

  const phoneValid = phone.trim().length >= 1
  const rawPassword = password
  const passwordValid = rawPassword.length >= 1

  const completeLogin = (user: DemoUser) => {
    setType('kurumsal')
    const roleLabel = user.role === 'admin'
      ? 'Admin'
      : user.role === 'user'
        ? 'Filo Sahibi'
        : user.role === 'owner'
          ? `Taksi Sahibi ${user.ownerId}`
          : 'Kullanıcı'
    updateProfile({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: roleLabel,
    })
    navigate('/panel')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ phone: true, password: true })
    if (!phoneValid || !passwordValid) return

    const result = login(phone, rawPassword)
    if (!result.ok || !result.user) {
      setPasswordError(result.error ?? 'Giriş başarısız.')
      return
    }
    setPasswordError('')
    completeLogin(result.user)
  }

  const quickLogin = (loginId: string, pass: string) => {
    setPhone(loginId)
    setPassword(pass)
    setPasswordError('')
    const result = login(loginId, pass)
    if (result.ok && result.user) completeLogin(result.user)
    else setPasswordError(result.error ?? 'Giriş başarısız.')
  }

  return (
    <AuthLayout>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Giriş Yap</h1>
        <p className={styles.subtitle}>Admin veya filo sahibi olarak giriş yapın.</p>

        <div className={styles.quickLogins}>
          {QUICK_LOGINS.map(({ label, login: l, password: p, highlight }) => (
            <button
              key={l}
              type="button"
              className={`${styles.quickBtn} ${highlight ? styles.quickBtnOwner : ''}`}
              onClick={() => quickLogin(l, p)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.demoHint}>
          <strong>Admin:</strong> admin / admin
          <br />
          <strong>Kullanıcı:</strong> user / user
          <br />
          <strong>Taksi Sahibi A:</strong> a / a &nbsp;(34 ABC 123 · Ahmet Kaya)
          <br />
          <span className={styles.demoHintSmall}>Diğer sahipler: b/b, c/c … i/i</span>
        </div>

        <div className={styles.fields}>
          <FormInput
            label="Kullanıcı Adı"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            icon={
              phoneValid ? (
                <CheckCircle2 size={20} color="var(--success)" fill="var(--success)" stroke="white" />
              ) : undefined
            }
          />

          <FormInput
            label="Şifre"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (passwordError) setPasswordError('')
            }}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={touched.password && passwordError ? passwordError : undefined}
            icon={
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? (
                  <EyeOff size={20} color="var(--error)" />
                ) : (
                  <Eye size={20} color="var(--error)" />
                )}
              </button>
            }
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${phoneValid && passwordValid ? styles.submitActive : ''}`}
          disabled={!phoneValid || !passwordValid}
        >
          Giriş Yap
        </button>

        <div className={styles.links}>
          <Link to="/sifremi-unuttum" className={styles.link}>Telefon Numaram Değişti</Link>
          <span className={styles.divider}>|</span>
          <Link to="/sifremi-unuttum" className={styles.link}>Şifremi Unuttum</Link>
        </div>

        <p className={styles.register}>
          Hesabın yok mu? <Link to="/kayit" className={styles.registerLink}>Kayıt Ol</Link>
        </p>
      </form>
    </AuthLayout>
  )
}
