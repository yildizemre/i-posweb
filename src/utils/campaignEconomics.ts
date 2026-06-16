import { Campaign, CampaignCategory, DriverWallet, ADMIN_PAYOUT_WALLETS } from '../context/PanelDataContext'

export const CATEGORY_LABELS: Record<CampaignCategory, string> = {
  sigorta: 'Sigorta',
  lastik: 'Lastik',
  yag: 'Yağ',
  'oto-yikama': 'Oto Yıkama',
  genel: 'Genel',
}

export function getDiscountedPrice(c: Pick<Campaign, 'originalPrice' | 'discountType' | 'discountValue'>) {
  const discount = Number(c.discountValue) || 0
  if (!c.originalPrice) return 0
  if (c.discountType === 'percent') {
    return Math.round(c.originalPrice * (1 - discount / 100))
  }
  return Math.max(0, c.originalPrice - discount)
}

export function getMarginPerSale(c: Pick<Campaign, 'originalPrice' | 'salePrice' | 'discountType' | 'discountValue'>) {
  if (!c.originalPrice || !c.salePrice) return 0
  return Math.max(0, c.salePrice - getDiscountedPrice(c))
}

export function getTotalCampaignEarnings(c: Pick<Campaign, 'originalPrice' | 'salePrice' | 'discountType' | 'discountValue' | 'redemptionCount'>) {
  return getMarginPerSale(c) * (c.redemptionCount || 0)
}

export function formatTry(n: number) {
  return `₺ ${n.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`
}

export function getPayoutWalletLabel(walletId: string, driverWallets: DriverWallet[] = []) {
  if (!walletId) return '—'
  const admin = ADMIN_PAYOUT_WALLETS.find((w) => w.walletId === walletId)
  if (admin) return `${admin.walletId} — ${admin.label}`
  const driver = driverWallets.find((w) => w.walletId === walletId)
  if (driver) return `${driver.walletId} — ${driver.driver} (${driver.plate})`
  return walletId
}

export function buildPayoutWalletOptions(driverWallets: DriverWallet[]) {
  const admin = ADMIN_PAYOUT_WALLETS.map((w) => ({ walletId: w.walletId, label: `${w.walletId} — ${w.label}` }))
  const drivers = driverWallets
    .filter((w) => w.status === 'active')
    .map((w) => ({ walletId: w.walletId, label: `${w.walletId} — ${w.driver} (${w.plate})` }))
  return [...admin, ...drivers]
}
