import { ChevronDown } from 'lucide-react'
import styles from './LanguageSelector.module.css'

export default function LanguageSelector() {
  return (
    <button className={styles.selector} type="button">
      <span className={styles.flag}>🇹🇷</span>
      <span>Türkçe</span>
      <ChevronDown size={16} className={styles.chevron} />
    </button>
  )
}
