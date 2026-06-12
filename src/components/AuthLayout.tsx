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
              <svg className={styles.taxi} viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <ellipse cx="140" cy="175" rx="110" ry="8" fill="#0a6b6b" opacity="0.12" />
                <rect x="30" y="155" width="220" height="6" rx="3" fill="#d4d4d4" />
                <rect x="55" y="95" width="170" height="62" rx="10" fill="#FFD600" />
                <path d="M75 95 L95 68 H185 L205 95 Z" fill="#FFD600" />
                <rect x="95" y="68" width="90" height="14" rx="4" fill="#1a1a1a" />
                <text x="140" y="79" textAnchor="middle" fill="#FFD600" fontSize="9" fontWeight="bold" fontFamily="Inter,sans-serif">TAKSİ</text>
                <rect x="70" y="102" width="52" height="32" rx="6" fill="#87CEEB" opacity="0.85" />
                <rect x="158" y="102" width="52" height="32" rx="6" fill="#87CEEB" opacity="0.85" />
                <rect x="122" y="102" width="36" height="32" rx="4" fill="#1a1a1a" opacity="0.15" />
                <line x1="140" y1="102" x2="140" y2="134" stroke="#1a1a1a" strokeWidth="1" opacity="0.2" />
                <rect x="68" y="145" width="144" height="12" rx="4" fill="#1a1a1a" />
                <circle cx="95" cy="157" r="16" fill="#2a2a2a" />
                <circle cx="95" cy="157" r="9" fill="#555" />
                <circle cx="95" cy="157" r="4" fill="#888" />
                <circle cx="185" cy="157" r="16" fill="#2a2a2a" />
                <circle cx="185" cy="157" r="9" fill="#555" />
                <circle cx="185" cy="157" r="4" fill="#888" />
                <rect x="210" y="118" width="18" height="10" rx="3" fill="#ff6b6b" opacity="0.9" />
                <rect x="52" y="118" width="14" height="10" rx="3" fill="#fff" opacity="0.9" />
                <rect x="118" y="55" width="44" height="16" rx="4" fill="#0a6b6b" />
                <circle cx="128" cy="63" r="3" fill="#4db6ac" />
                <circle cx="140" cy="63" r="3" fill="#4db6ac" />
                <circle cx="152" cy="63" r="3" fill="#4db6ac" />
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
