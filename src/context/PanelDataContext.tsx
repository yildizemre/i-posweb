import { createContext, useContext, useState, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { COMPANY_NAME } from '../constants/brand'
import { DRIVERS, PLATFORMS, COMMISSION_RATE, ADMIN_COMMISSION_RATE } from '../data/mockTaxiData'

export interface PlatformSetting {
  id: string
  name: string
  color: string
  platformCommissionRate: number
  adminCommissionRate: number
  active: boolean
}

const INITIAL_PLATFORM_SETTINGS: PlatformSetting[] = PLATFORMS.map((p) => ({
  id: p.id,
  name: p.name,
  color: p.color,
  platformCommissionRate: COMMISSION_RATE,
  adminCommissionRate: ADMIN_COMMISSION_RATE,
  active: true,
}))

function slugify(name: string) {
  return name.toLowerCase()
    .replace(/[^a-z0-9ğüşıöç\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    || `platform-${Date.now()}`
}

export type ItemStatus = 'pending' | 'active' | 'closed'

export interface Site {
  id: string
  title: string
  storeName: string
  url: string
  successUrl: string
  errorUrl: string
  ip: string
  iban: string
  accountHolder: string
  bankTitle: string
  installment: string
  status: ItemStatus
}

export type CampaignType = 'kampanya' | 'indirim' | 'firsat'
export type CampaignStatus = 'active' | 'draft' | 'expired'

export type WalletStatus = 'active' | 'frozen' | 'closed'

export interface DriverWallet {
  id: string
  walletId: string
  driver: string
  plate: string
  platform: string
  balance: number
  status: WalletStatus
  createdAt: string
}

export interface Campaign {
  id: string
  title: string
  description: string
  type: CampaignType
  discountType: 'percent' | 'amount'
  discountValue: string
  promoCode: string
  siteId: string | null
  siteName: string
  startDate: string
  endDate: string
  status: CampaignStatus
}

export interface PaymentLink {
  id: string
  product: string
  description: string
  price: string
  taksit: string
  endDate: string
  count: string
  remaining: string
  refUrl: string
  status: ItemStatus
  site?: string
  url?: string
  webSite?: string
}

const INITIAL_KURUMSAL: PaymentLink[] = [
  { id: '1', product: 'Ödeme', description: '', price: '', taksit: 'Peşin', endDate: '', count: '', remaining: '', refUrl: '', site: COMPANY_NAME, url: 'www.fineros.com', status: 'pending' },
  { id: '2', product: 'Market Ödemesi', description: '', price: '₺ 500,00', taksit: '3 Taksit', endDate: '15.12.2025', count: '100', remaining: '80', refUrl: '', site: 'Migros', url: 'www.migros.com.tr', status: 'active' },
  { id: '3', product: 'Hızlı Market', description: '', price: '', taksit: '6 Taksit', endDate: '', count: '', remaining: '', refUrl: '', site: 'Getir', url: 'www.getir.com', status: 'closed' },
]

const INITIAL_WALLETS: DriverWallet[] = DRIVERS.slice(0, 4).map((d, i) => ({
  id: `w${i + 1}`,
  walletId: `CZD-${100001 + i}`,
  driver: d.name,
  plate: d.plate,
  platform: PLATFORMS.find((p) => p.id === d.platform)?.name ?? '',
  balance: [1250, 890, 2100, 450][i] ?? 0,
  status: 'active' as const,
  createdAt: `${10 + i}.06.2025`,
}))

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1', title: 'Yaz İndirimi', description: 'Tüm online ödemelerde geçerli %15 indirim fırsatı.',
    type: 'indirim', discountType: 'percent', discountValue: '15', promoCode: 'YAZ15',
    siteId: null, siteName: 'Tüm Siteler', startDate: '01.06.2025', endDate: '31.08.2025', status: 'active',
  },
  {
    id: 'c2', title: 'İlk Yolculuk Hediyesi', description: 'Yeni müşterilere 100 TL taksi kredisi.',
    type: 'firsat', discountType: 'amount', discountValue: '100', promoCode: 'ILKYOL100',
    siteId: null, siteName: 'i-pos Taksi', startDate: '01.06.2025', endDate: '30.06.2025', status: 'active',
  },
  {
    id: 'c3', title: 'Hafta Sonu Kampanyası', description: 'Cumartesi-Pazar POS ödemelerinde ekstra %10 indirim.',
    type: 'kampanya', discountType: 'percent', discountValue: '10', promoCode: 'HSND10',
    siteId: null, siteName: 'Fineros Mağaza', startDate: '14.06.2025', endDate: '15.06.2025', status: 'active',
  },
]

const INITIAL_BIREYSEL: PaymentLink[] = [
  { id: 'b1', product: 'Arçelik Televizyon QHD', description: '55 inç QLED televizyon', price: '₺ 18.000,00', taksit: 'Peşin', endDate: '12.09.2025', count: '100', remaining: '92', refUrl: 'google.com', status: 'pending' },
  { id: 'b2', product: 'Vestel Klima', description: '12000 BTU inverter klima', price: '₺ 22.000,00', taksit: '3 Taksit', endDate: '15.10.2025', count: '50', remaining: '41', refUrl: '', status: 'active' },
  { id: 'b3', product: 'Samsung Buzdolabı', description: 'No-frost buzdolabı', price: '₺ 35.000,00', taksit: '6 Taksit', endDate: '01.11.2025', count: '25', remaining: '20', refUrl: '', status: 'active' },
]

function newId() {
  return String(Date.now())
}

const PanelDataContext = createContext<{
  sites: Site[]
  addSite: (site: Omit<Site, 'id' | 'status'>) => void
  updateSite: (id: string, site: Partial<Site>) => void
  deleteSite: (id: string) => void
  kurumsalLinks: PaymentLink[]
  bireyselLinks: PaymentLink[]
  addLink: (type: 'bireysel' | 'kurumsal', link: Omit<PaymentLink, 'id' | 'status'>) => void
  updateLink: (type: 'bireysel' | 'kurumsal', id: string, link: Partial<PaymentLink>) => void
  deleteLink: (type: 'bireysel' | 'kurumsal', id: string) => void
  getLink: (type: 'bireysel' | 'kurumsal', id: string) => PaymentLink | undefined
  campaigns: Campaign[]
  addCampaign: (c: Omit<Campaign, 'id' | 'status'>) => void
  updateCampaign: (id: string, c: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
  activeCampaigns: Campaign[]
  wallets: DriverWallet[]
  addWallet: (driver: string, plate: string, platform: string) => void
  deleteWallet: (id: string) => void
  updateWallet: (id: string, data: Partial<DriverWallet>) => void
  driversWithoutWallet: { name: string; plate: string; platform: string }[]
  platformSettings: PlatformSetting[]
  addPlatform: (data: Omit<PlatformSetting, 'id' | 'active'>) => void
  updatePlatform: (id: string, data: Partial<PlatformSetting>) => void
  deletePlatform: (id: string) => void
} | null>(null)

export function PanelDataProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS)
  const [wallets, setWallets] = useState(INITIAL_WALLETS)
  const [walletSeq, setWalletSeq] = useState(100005)
  const [kurumsalLinks, setKurumsalLinks] = useState(INITIAL_KURUMSAL)
  const [bireyselLinks, setBireyselLinks] = useState(INITIAL_BIREYSEL)
  const [platformSettings, setPlatformSettings] = useState(INITIAL_PLATFORM_SETTINGS)

  const activeCampaigns = campaigns.filter((c) => c.status === 'active')

  const driversWithoutWallet = DRIVERS
    .filter((d) => !wallets.some((w) => w.plate === d.plate))
    .map((d) => ({
      name: d.name,
      plate: d.plate,
      platform: PLATFORMS.find((p) => p.id === d.platform)?.name ?? '',
    }))

  const addSite = (site: Omit<Site, 'id' | 'status'>) => {
    setSites((prev) => [...prev, { ...site, id: newId(), status: 'pending' }])
  }

  const updateSite = (id: string, data: Partial<Site>) => {
    setSites((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
  }

  const deleteSite = (id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id))
  }

  const addLink = (type: 'bireysel' | 'kurumsal', link: Omit<PaymentLink, 'id' | 'status'>) => {
    const item: PaymentLink = { ...link, id: newId(), status: 'pending' }
    if (type === 'bireysel') setBireyselLinks((prev) => [...prev, item])
    else setKurumsalLinks((prev) => [...prev, item])
  }

  const updateLink = (type: 'bireysel' | 'kurumsal', id: string, data: Partial<PaymentLink>) => {
    const map = (prev: PaymentLink[]) => prev.map((l) => (l.id === id ? { ...l, ...data } : l))
    if (type === 'bireysel') setBireyselLinks(map)
    else setKurumsalLinks(map)
  }

  const deleteLink = (type: 'bireysel' | 'kurumsal', id: string) => {
    if (type === 'bireysel') setBireyselLinks((prev) => prev.filter((l) => l.id !== id))
    else setKurumsalLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const getLink = (type: 'bireysel' | 'kurumsal', id: string) => {
    const list = type === 'bireysel' ? bireyselLinks : kurumsalLinks
    return list.find((l) => l.id === id)
  }

  const addCampaign = (c: Omit<Campaign, 'id' | 'status'>) => {
    if (!isAdmin) return
    setCampaigns((prev) => [...prev, { ...c, id: newId(), status: 'active' }])
  }

  const updateCampaign = (id: string, data: Partial<Campaign>) => {
    if (!isAdmin) return
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  }

  const deleteCampaign = (id: string) => {
    if (!isAdmin) return
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
  }

  const addWallet = (driver: string, plate: string, platform: string) => {
    const walletId = `CZD-${walletSeq}`
    setWalletSeq((n) => n + 1)
    setWallets((prev) => [...prev, {
      id: newId(),
      walletId,
      driver,
      plate,
      platform,
      balance: 0,
      status: 'active',
      createdAt: new Date().toLocaleDateString('tr-TR'),
    }])
  }

  const deleteWallet = (id: string) => {
    setWallets((prev) => prev.filter((w) => w.id !== id))
  }

  const updateWallet = (id: string, data: Partial<DriverWallet>) => {
    setWallets((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)))
  }

  const addPlatform = (data: Omit<PlatformSetting, 'id' | 'active'>) => {
    if (!isAdmin) return
    const base = slugify(data.name)
    let id = base
    let n = 1
    while (platformSettings.some((p) => p.id === id)) {
      id = `${base}-${n++}`
    }
    setPlatformSettings((prev) => [...prev, { ...data, id, active: true }])
  }

  const updatePlatform = (id: string, data: Partial<PlatformSetting>) => {
    if (!isAdmin) return
    setPlatformSettings((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  }

  const deletePlatform = (id: string) => {
    if (!isAdmin) return
    setPlatformSettings((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <PanelDataContext.Provider value={{
      sites, addSite, updateSite, deleteSite,
      kurumsalLinks, bireyselLinks, addLink, updateLink, deleteLink, getLink,
      campaigns, addCampaign, updateCampaign, deleteCampaign, activeCampaigns,
      wallets, addWallet, deleteWallet, updateWallet, driversWithoutWallet,
      platformSettings, addPlatform, updatePlatform, deletePlatform,
    }}>
      {children}
    </PanelDataContext.Provider>
  )
}

export function usePanelData() {
  const ctx = useContext(PanelDataContext)
  if (!ctx) throw new Error('usePanelData must be used within PanelDataProvider')
  return ctx
}
