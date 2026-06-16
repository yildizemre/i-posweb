import { Outlet } from 'react-router-dom'
import { Bell, Clock, Headphones, Settings } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import Logo from '../components/Logo'
import ProfileDropdown from '../components/dashboard/ProfileDropdown'
import { useProfile } from '../context/ProfileContext'
import { useAccount } from '../context/AccountContext'
import styles from './ApplicationLayout.module.css'

export default function ApplicationLayout() {
  const { profile } = useProfile()
  const { type } = useAccount()
  const accountLabel = type === 'kurumsal' ? 'Kurumsal' : 'Bireysel'

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <Logo />
        <nav className={styles.nav}>
          <NavLink to="/basvuru" end className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
            <Clock size={18} />Başvuru
          </NavLink>
          <p className={styles.section}>Daha Fazla</p>
          <button type="button" className={styles.navItem}><Headphones size={18} />Yardım ve Destek</button>
          <button type="button" className={styles.navItem}><Settings size={18} />Ayarlar</button>
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <strong>{profile.name}</strong>
            <span className={styles.dot} />{accountLabel}
          </div>
          <div className={styles.headerRight}>
            <button type="button" className={styles.bell}><Bell size={18} /></button>
            <ProfileDropdown />
          </div>
        </header>
        <div className={styles.page}><Outlet /></div>
      </div>
    </div>
  )
}
