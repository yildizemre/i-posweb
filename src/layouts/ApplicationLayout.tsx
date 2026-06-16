import { Outlet } from 'react-router-dom'
import { Bell, ChevronDown, Clock, Headphones, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from '../components/Logo'
import { USER_NAME, USER_INITIALS } from '../constants/brand'
import styles from './ApplicationLayout.module.css'

export default function ApplicationLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Logo />
        <nav className={styles.nav}>
          <NavLink to="/basvuru" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
            <Clock size={18} />Başvuru
          </NavLink>
          <p className={styles.section}>Daha Fazla</p>
          <button className={styles.navItem}><Headphones size={18} />Yardım ve Destek</button>
          <button className={styles.navItem}><Settings size={18} />Ayarlar</button>
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <strong>{USER_NAME}</strong>
            <span className={styles.dot} />Bireysel
          </div>
          <div className={styles.headerRight}>
            <button className={styles.bell}><Bell size={18} /></button>
            <button className={styles.profile}>
              <div className={styles.avatar}>{USER_INITIALS}</div>
              <span className={styles.profileName}>{USER_NAME}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className={styles.page}><Outlet /></div>
      </div>
    </div>
  )
}
