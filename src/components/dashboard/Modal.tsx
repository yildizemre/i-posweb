import { ReactNode } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}

export default function Modal({ open, onClose, title, subtitle, children, footer, wide }: ModalProps) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${wide ? styles.wide : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button type="button" className={styles.close} onClick={onClose}><X size={20} color="#e53935" /></button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )
}
