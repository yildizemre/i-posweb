import { useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, ChevronRight, Plus, Briefcase, Headphones, Settings } from 'lucide-react'
import Logo from '../components/Logo'
import { APP_NAME, COMPANY_NAME, USER_NAME, USER_INITIALS } from '../constants/brand'
import s from './CompanySelectPage.module.css'

const COMPANIES = [
  { id: '1', name: COMPANY_NAME, initials: 'FN', role: 'Yönetici', status: 'active' as const },
  { id: '2', name: 'Migros A.Ş.', initials: 'MA', role: 'Operasyon', status: 'active' as const },
  { id: '3', name: 'Getir Teknoloji', initials: 'GT', role: 'Yönetici', status: 'pending' as const },
]

export default function CompanySelectPage() {
  const navigate = useNavigate()
  const firstName = USER_NAME.split(' ')[0]

  return (
    <div className={s.layout}>
      <aside className={s.sidebar}>
        <Logo />
        <nav className={s.nav}>
          <button className={`${s.navItem} ${s.navActive}`}><Briefcase size={18} />Şirketleriniz</button>
          <p className={s.section}>Daha Fazla</p>
          <button className={s.navItem}><Headphones size={18} />Yardım ve Destek</button>
          <button className={s.navItem}><Settings size={18} />Ayarlar</button>
        </nav>
      </aside>
      <div className={s.main}>
        <header className={s.header}>
          <div>
            <h1>Şirket Seçiniz</h1>
            <span className={s.brand}>• {APP_NAME}</span>
          </div>
          <div className={s.headerRight}>
            <button className={s.bell}><Bell size={18} /></button>
            <button className={s.profile}>
              <div className={s.avatar}>{USER_INITIALS}</div>
              <span>{USER_NAME}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        <div className={s.page}>
          <h2 className={s.sectionTitle}>Kurumsal</h2>
          <div className={s.grid}>
            {COMPANIES.map((c) => (
              <div key={c.id} className={s.companyCard}>
                <div className={s.cardTop}>
                  <div className={s.initials}>{c.initials}</div>
                  <div><span className={s.label}>Firma</span><strong>{c.name}</strong></div>
                  {c.status === 'pending' ? (
                    <span className={s.pending}>Onay Bekliyor</span>
                  ) : (
                    <button className={s.continue} onClick={() => navigate('/panel')}>Devam Et <ChevronRight size={14} /></button>
                  )}
                </div>
                <div className={s.divider} />
                <div className={s.cardBottom}>
                  <div className={s.miniAvatar}>{USER_INITIALS}</div>
                  <span>{firstName}</span>
                  <span className={s.role}>Yetkiniz: <strong>{c.role}</strong></span>
                </div>
              </div>
            ))}
            <button className={s.newCard} onClick={() => navigate('/basvuru')}>
              <div className={s.plusIcon}><Plus size={24} color="#1976d2" /></div>
              <span>Yeni Kurumsal Başvuru</span>
            </button>
          </div>

          <h2 className={s.sectionTitle}>Bireysel</h2>
          <div className={s.individualCard} onClick={() => navigate('/panel')}>
            <div className={s.cardTop}>
              <div className={s.miniAvatar}>{USER_INITIALS}</div>
              <div><span className={s.greeting}>İyi günler,</span><strong>{USER_NAME}</strong></div>
            </div>
            <div className={s.divider} />
            <div className={s.cardBottom}>
              <span>Hesap No: <strong className={s.accountNo}>1234567890</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
