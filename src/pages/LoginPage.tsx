import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import styles from './LoginPage.module.css'

const DEMO_PASSWORD = '123456'

export default function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('+90 552 265 67 07')
  const [password, setPassword] = useState('••••••')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('Şifreniz hatalı, lütfen kontrol ediniz.')
  const [touched, setTouched] = useState({ phone: true, password: true })

  const phoneValid = phone.trim().length >= 10
  const rawPassword = password.replace(/•/g, '')
  const passwordValid = rawPassword.length >= 6

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setTouched({ phone: true, password: true })

    if (!phoneValid) return

    if (rawPassword !== DEMO_PASSWORD) {
      setPasswordError('Şifreniz hatalı, lütfen kontrol ediniz.')
      return
    }

    setPasswordError('')
    navigate('/panel')
  }

  const handlePasswordChange = (value: string) => {
    if (password.includes('•') && value.length < password.length) {
      setPassword('')
    } else {
      setPassword(value.replace(/•/g, ''))
    }
    if (passwordError) setPasswordError('')
  }

  return (
    <AuthLayout>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Giriş yap.</h1>
        <p className={styles.subtitle}>Telefon ya da E-Postanız ile giriş yapınız.</p>

        <div className={styles.fields}>
          <FormInput
            label="Cep No ya da E-Posta"
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
            onChange={(e) => handlePasswordChange(e.target.value)}
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
          className={`${styles.submitBtn} ${phoneValid && passwordValid && !passwordError ? styles.submitActive : ''}`}
          disabled={!phoneValid}
        >
          Devam Et
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
