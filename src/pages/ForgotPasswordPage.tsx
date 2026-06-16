import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'
import styles from './ForgotPasswordPage.module.css'

export default function ForgotPasswordPage() {
  const [contact, setContact] = useState('+90 552 695 67 07')
  const contactValid = contact.trim().length >= 10

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!contactValid) return
    alert('Şifre sıfırlama bağlantısı gönderildi. (Demo)')
  }

  return (
    <AuthLayout>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Şifremi unuttum.</h1>
        <p className={styles.subtitle}>Şifrenizi sıfırlayınız.</p>

        <div className={styles.fields}>
          <FormInput
            label="Cep No ya da E-Posta"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            icon={
              contactValid ? (
                <CheckCircle2 size={20} color="var(--success)" fill="var(--success)" stroke="white" />
              ) : undefined
            }
          />
        </div>

        <button
          type="submit"
          className={`${styles.submitBtn} ${contactValid ? styles.submitActive : ''}`}
          disabled={!contactValid}
        >
          Devam Et
        </button>

        <div className={styles.separator}>
          <span>ya da</span>
        </div>

        <Link to="/sifremi-unuttum" className={styles.altLink}>
          Cep Numaram Değişti
        </Link>

        <p className={styles.help}>
          Bir sorun mu yaşıyorsun? <a href="#" className={styles.helpLink}>İletişime Geç</a>
        </p>
      </form>
    </AuthLayout>
  )
}
