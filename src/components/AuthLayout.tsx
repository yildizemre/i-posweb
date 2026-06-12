import { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { APP_DOMAIN } from '../constants/brand'
import Logo from './Logo'
import LanguageSelector from './LanguageSelector'
import styles from './AuthLayout.module.css'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <aside className={styles.left}>
          <div className={styles.leftInner}>
            <Logo />
            <div className={styles.illustration}>
              <div className={styles.shapeCircle} />
              <div className={styles.shapeTriangle} />
              <div className={styles.shapeSmall} />
              <svg className={styles.flower} viewBox="0 0 200 160" fill="none">
                <path d="M100 80 C90 60 70 55 75 75 C55 70 50 90 70 95 C50 100 55 120 75 115 C70 135 90 130 100 110 C110 130 130 135 125 115 C145 120 150 100 130 95 C150 90 145 70 125 75 C130 55 110 60 100 80Z" fill="#c97b8a" opacity="0.9"/>
                <line x1="100" y1="110" x2="100" y2="155" stroke="#6b8f71" strokeWidth="3"/>
                <ellipse cx="85" cy="130" rx="12" ry="6" fill="#7aab7e" opacity="0.7" transform="rotate(-30 85 130)"/>
                <ellipse cx="115" cy="140" rx="10" ry="5" fill="#7aab7e" opacity="0.7" transform="rotate(20 115 140)"/>
              </svg>
            </div>
            <a href={APP_DOMAIN} className={styles.siteLink} target="_blank" rel="noreferrer">
              <Lock size={14} />
              {APP_DOMAIN.replace('https://', '')}
            </a>
            <ul className={styles.tips}>
              <li>6 adet rakamdan oluşmalıdır.</li>
              <li>En az 4 farklı rakam içermelidir.</li>
              <li>İlk 2 hane ile son 2 hane aynı olmamalıdır.</li>
            </ul>
          </div>
        </aside>

        <main className={styles.right}>
          <div className={styles.langWrap}>
            <LanguageSelector />
          </div>
          <div className={styles.formArea}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
