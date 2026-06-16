import { InputHTMLAttributes, ReactNode } from 'react'
import styles from './FormInput.module.css'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: ReactNode
}

export default function FormInput({ label, error, icon, className, ...props }: FormInputProps) {
  return (
    <div className={styles.group}>
      <label className={`${styles.label} ${error ? styles.labelError : ''}`}>{label}</label>
      <div className={`${styles.inputWrap} ${error ? styles.inputError : ''}`}>
        <input className={`${styles.input} ${className ?? ''}`} {...props} />
        {icon && <div className={styles.icon}>{icon}</div>}
      </div>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  )
}
