import { CheckCircle2 } from 'lucide-react'
import styles from './SuccessModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  title?: string
  body?: string
  buttonLabel?: string
  outline?: boolean
}

export default function SuccessModal({ open, onClose, title = 'İşlem Başarılı', body = 'İşleminiz başarıyla tamamlandı.', buttonLabel = 'Tamam', outline }: Props) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}><CheckCircle2 size={36} color="white" fill="#2e9e6a" /></div>
        <h2>{title}</h2>
        <p>{body}</p>
        <button type="button" className={outline ? styles.btnOutline : styles.btn} onClick={onClose}>{buttonLabel}</button>
      </div>
    </div>
  )
}
