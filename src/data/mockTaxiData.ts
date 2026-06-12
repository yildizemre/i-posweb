export type Platform = 'uber' | 'yandex' | '724' | 'bitaksi'
export type PaymentMethod = 'card' | 'cash' | 'wallet'

export const PLATFORMS: { id: Platform; name: string; color: string; commission: number }[] = [
  { id: 'uber', name: 'Uber', color: '#000000', commission: 25 },
  { id: 'yandex', name: 'Yandex', color: '#FFCC00', commission: 22 },
  { id: '724', name: '7/24 Taksi', color: '#1a1a1a', commission: 20 },
  { id: 'bitaksi', name: 'BiTaksi', color: '#FFD600', commission: 23 },
]

export const PLATES = [
  { plate: '34 ABC 123', driver: 'Ahmet Kaya', platform: 'uber' as Platform, earnings: 18420, commission: 4605, customers: 142, card: 11200, cash: 5220, wallet: 2000 },
  { plate: '34 DEF 456', driver: 'Mehmet Yılmaz', platform: 'yandex' as Platform, earnings: 15680, commission: 3450, customers: 118, card: 9800, cash: 3880, wallet: 2000 },
  { plate: '34 GHI 789', driver: 'Ali Demir', platform: 'bitaksi' as Platform, earnings: 12340, commission: 2838, customers: 95, card: 7200, cash: 4140, wallet: 1000 },
  { plate: '06 JKL 012', driver: 'Hasan Öztürk', platform: '724' as Platform, earnings: 9870, commission: 1974, customers: 78, card: 5200, cash: 3670, wallet: 1000 },
  { plate: '34 MNO 345', driver: 'Emre Yıldız', platform: 'uber' as Platform, earnings: 21500, commission: 5375, customers: 168, card: 14000, cash: 5500, wallet: 2000 },
  { plate: '35 PQR 678', driver: 'Burak Şahin', platform: 'yandex' as Platform, earnings: 11200, commission: 2464, customers: 86, card: 6800, cash: 3400, wallet: 1000 },
]

export const PLATFORM_SUMMARY = PLATFORMS.map((p) => {
  const plates = PLATES.filter((pl) => pl.platform === p.id)
  const earnings = plates.reduce((s, pl) => s + pl.earnings, 0)
  const commission = plates.reduce((s, pl) => s + pl.commission, 0)
  const customers = plates.reduce((s, pl) => s + pl.customers, 0)
  const card = plates.reduce((s, pl) => s + pl.card, 0)
  const cash = plates.reduce((s, pl) => s + pl.cash, 0)
  const wallet = plates.reduce((s, pl) => s + pl.wallet, 0)
  return { ...p, earnings, commission, customers, card, cash, wallet, plateCount: plates.length }
})

export const PAYMENT_TOTALS = {
  card: PLATES.reduce((s, p) => s + p.card, 0),
  cash: PLATES.reduce((s, p) => s + p.cash, 0),
  wallet: PLATES.reduce((s, p) => s + p.wallet, 0),
}

export const CASH_BLOCK_RATE = 0.10

export const CASH_SETTLEMENTS = PLATFORMS.map((p) => {
  const cashTotal = PLATFORM_SUMMARY.find((s) => s.id === p.id)?.cash ?? 0
  const blocked = Math.round(cashTotal * CASH_BLOCK_RATE)
  const netTransfer = cashTotal - blocked
  return {
    platform: p.name,
    platformId: p.id,
    cashCollected: cashTotal,
    blockedAmount: blocked,
    blockRate: '%10',
    transferAmount: netTransfer,
    status: 'pending' as const,
    transferTime: '23:59',
  }
})

export const POS_DEVICES = [
  { id: 'POS-001', serial: 'SN-88291034', status: 'assigned' as const, driver: 'Ahmet Kaya', plate: '34 ABC 123', platform: 'Uber' },
  { id: 'POS-002', serial: 'SN-88291035', status: 'assigned' as const, driver: 'Mehmet Yılmaz', plate: '34 DEF 456', platform: 'Yandex' },
  { id: 'POS-003', serial: 'SN-88291036', status: 'available' as const, driver: null, plate: null, platform: null },
  { id: 'POS-004', serial: 'SN-88291037', status: 'assigned' as const, driver: 'Emre Yıldız', plate: '34 MNO 345', platform: 'Uber' },
  { id: 'POS-005', serial: 'SN-88291038', status: 'available' as const, driver: null, plate: null, platform: null },
  { id: 'POS-006', serial: 'SN-88291039', status: 'assigned' as const, driver: 'Ali Demir', plate: '34 GHI 789', platform: 'BiTaksi' },
]

export const DRIVERS = PLATES.map((p) => ({ name: p.driver, plate: p.plate, platform: p.platform }))

export function formatMoney(n: number) {
  return `₺ ${n.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
}
