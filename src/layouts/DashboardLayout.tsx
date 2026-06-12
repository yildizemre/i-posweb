import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Users, CreditCard,
  Headphones, Settings, Bell, ChevronDown, User, Briefcase, Menu, X,
  Car, Banknote, Smartphone, Tag, Wallet,
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAccount } from '../context/AccountContext'
import ProfileDropdown from '../components/dashboard/ProfileDropdown'
import { useProfile } from '../context/ProfileContext'
import { COMPANY_NAME } from '../constants/brand'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout() {
  const { type, setType } = useAccount()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const isBireysel = type === 'bireysel'
  const link = (to: string, label: string, Icon: typeof LayoutDashboard) => (
    <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ''}`}>
      <Icon size={18} />{label}
    </NavLink>
  )

  const nav = (
    <nav className={styles.nav}>
      {link('/panel', 'Panel', LayoutDashboard)}
      <p className={styles.navSection}>TAKSİ PLATFORMLARI</p>
      {link('/panel/platformlar', 'Platform Kazançları', Car)}
      {link('/panel/nakit-hakedis', 'Nakit Hakediş', Banknote)}
      {!isBireysel && (
        <>
          <p className={styles.navSection}>SANAL POS</p>
          {link('/panel/kampanya-yonetimi', 'Kampanya Yönetimi', Tag)}
          {link('/panel/firsatlar', 'Fırsatlar & Kampanyalar', Tag)}
        </>
      )}
      {isBireysel && link('/panel/firsatlar', 'Fırsatlar & Kampanyalar', Tag)}
      <p className={styles.navSection}>RAPORLAR</p>
      {link('/panel/raporlar/islem', 'İşlem Raporları', FileText)}
      {link('/panel/raporlar/hakedis', 'Hakedişler', FileText)}
      {link('/panel/raporlar/faturalar', 'Faturalar', FileText)}
      {!isBireysel && (
        <>
          {link('/panel/kullanicilar', 'Kullanıcı Yönetimi', Users)}
          <p className={styles.navSection}>FİZİKİ POS</p>
          {link('/panel/fiziki-pos', 'Fiziki POS', CreditCard)}
          {link('/panel/pos-atama', 'POS Atama', Smartphone)}
          {link('/panel/cuzdanlar', 'Cüzdanlar', Wallet)}
        </>
      )}
      <p className={styles.navSection}>Daha Fazla</p>
      {link('/panel/destek', 'Yardım ve Destek', Headphones)}
      {link('/panel/ayarlar', 'Ayarlar', Settings)}
    </nav>
  )

  return (
    <div className={styles.layout}>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarTop}><Logo /></div>
        <div className={styles.toggle}>
          <button className={`${styles.toggleBtn} ${isBireysel ? styles.toggleActive : ''}`} onClick={() => setType('bireysel')}>
            <User size={16} />Bireysel
          </button>
          <button className={`${styles.toggleBtn} ${!isBireysel ? styles.toggleActive : ''}`} onClick={() => setType('kurumsal')}>
            <Briefcase size={16} />Kurumsal
          </button>
        </div>
        {nav}
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className={styles.company}>
              <strong>{isBireysel ? profile.name : COMPANY_NAME}</strong>
              <span className={styles.companyType}><span className={styles.statusDot} />{isBireysel ? 'Bireysel' : 'Kurumsal'}</span>
            </div>
            {!isBireysel && (
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
