import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CreditCard, Percent,
  Headphones, Settings, Bell, ChevronDown, Menu, X,
  Car, Banknote, Smartphone, Tag, Wallet, TrendingUp,
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from '../components/dashboard/ProfileDropdown'
import { useProfile } from '../context/ProfileContext'
import { COMPANY_NAME } from '../constants/brand'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout() {
  const { profile } = useProfile()
  const { isAdmin, isUser } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const link = (to: string, label: string, Icon: typeof LayoutDashboard) => (
    <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
      <Icon size={18} />{label}
    </NavLink>
  )

  const adminNav = (
    <nav className={styles.nav}>
      {link('/panel', 'Panel', LayoutDashboard)}
      {link('/panel/taksi-filo', 'Taksi Filosu & Ciro', Car)}
      <p className={styles.navSection}>YÖNETİM</p>
      {link('/panel/komisyon-ayarlari', 'Komisyon Ayarları', Percent)}
      {link('/panel/kampanya-yonetimi', 'Kampanya Yönetimi', Tag)}
      {link('/panel/firsatlar', 'Fırsatlar & Kampanyalar', Tag)}
      <p className={styles.navSection}>Daha Fazla</p>
      {link('/panel/kazanc-ozeti', 'Kazanç Özeti', TrendingUp)}
      {link('/panel/destek', 'Yardım ve Destek', Headphones)}
      {link('/panel/ayarlar', 'Ayarlar', Settings)}
    </nav>
  )

  const userNav = (
    <nav className={styles.nav}>
      {link('/panel', 'Panel', LayoutDashboard)}
      <p className={styles.navSection}>TAKSİ PLATFORMLARI</p>
      {link('/panel/platformlar', 'Platform İstatistikleri', Car)}
      {link('/panel/nakit-hakedis', 'Nakit Hakediş', Banknote)}
      {link('/panel/firsatlar', 'Fırsatlar & Kampanyalar', Tag)}
      <p className={styles.navSection}>FİZİKİ POS</p>
      {link('/panel/fiziki-pos', 'Fiziki POS', CreditCard)}
      {link('/panel/pos-atama', 'POS Atama', Smartphone)}
      {link('/panel/cuzdanlar', 'Cüzdanlar', Wallet)}
      <p className={styles.navSection}>Daha Fazla</p>
      {link('/panel/destek', 'Yardım ve Destek', Headphones)}
      {link('/panel/ayarlar', 'Ayarlar', Settings)}
    </nav>
  )

  const roleLabel = isAdmin ? 'Admin' : 'Kullanıcı'
  const headerName = isUser ? profile.name : COMPANY_NAME

  return (
    <div className={styles.layout}>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}><Logo /></div>
        {isAdmin ? adminNav : userNav}
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className={styles.company}>
              <strong>{headerName}</strong>
              <span className={styles.companyType}>
                <span className={styles.statusDot} />
                {roleLabel}
              </span>
            </div>
            {isAdmin && (
              <button className={styles.changeBtn} onClick={() => navigate('/sirket-sec')}>
                Değiştir<ChevronDown size={14} />
              </button>
            )}
          </div>
          <div className={styles.headerRight}>
            <button className={styles.bellBtn} onClick={() => navigate('/panel/bildirimler')}>
              <Bell size={18} /><span className={styles.badge}>8</span>
            </button>
            <ProfileDropdown />
          </div>
        </header>
        <div className={styles.page}><Outlet /></div>
      </div>
    </div>
  )
}
