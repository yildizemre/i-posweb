import { Trash2 } from 'lucide-react'
import styles from './ConfirmDeleteModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  confirmLabel?: string
}

export default function ConfirmDeleteModal({ open, onClose, onConfirm, title = 'Silmek istediğinden emin misin?', confirmLabel = 'Sil' }: Props) {
  if (!open) return null
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}><Trash2 size={28} color="#e53935" /></div>
        <h2>{title}</h2>
        <p>Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?</p>
        <p className={styles.sub}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onClose}>İptal</button>
          <button type="button" className={styles.delete} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
