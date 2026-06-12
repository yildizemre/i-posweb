import { createContext, useContext, useState, ReactNode } from 'react'
import { COMPANY_NAME } from '../constants/brand'

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
} | null>(null)

export function PanelDataProvider({ children }: { children: ReactNode }) {
  const [sites, setSites] = useState<Site[]>([])
  const [kurumsalLinks, setKurumsalLinks] = useState(INITIAL_KURUMSAL)
  const [bireyselLinks, setBireyselLinks] = useState(INITIAL_BIREYSEL)

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

  return (
    <PanelDataContext.Provider value={{
      sites, addSite, updateSite, deleteSite,
      kurumsalLinks, bireyselLinks, addLink, updateLink, deleteLink, getLink,
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
