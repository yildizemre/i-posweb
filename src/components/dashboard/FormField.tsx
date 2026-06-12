import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import styles from './FormField.module.css'

export function FormField({ label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <input {...props} />
    </div>
  )
}

export function FormTextarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <textarea rows={4} {...props} />
    </div>
  )
}

export function FormSelect({ label, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <div className={styles.field}>
      <label>{label}</label>
      <select {...props}>{children}</select>
    </div>
  )
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}
