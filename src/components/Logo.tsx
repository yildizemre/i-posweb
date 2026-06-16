import { APP_NAME } from '../constants/brand'
import styles from './Logo.module.css'

export default function Logo() {
  return (
    <div className={styles.logo}>
      <svg className={styles.icon} viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="4" width="28" height="3" rx="1.5" fill="currentColor" />
        <rect x="0" y="11" width="20" height="3" rx="1.5" fill="currentColor" />
        <rect x="0" y="18" width="32" height="3" rx="1.5" fill="currentColor" />
        <rect x="0" y="25" width="24" height="3" rx="1.5" fill="currentColor" />
      </svg>
      <span className={styles.text}>{APP_NAME}</span>
    </div>
  )
}
