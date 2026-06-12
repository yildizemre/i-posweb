export type Platform = 'uber' | 'yandex' | '724' | 'bitaksi'
export type PaymentMethod = 'card' | 'cash' | 'wallet'

export const COMMISSION_RATE = 10
export const ADMIN_COMMISSION_RATE = 1

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  card: 'Kredi Kartı',
  cash: 'Nakit',
  wallet: 'Cüzdan',
}

export const PLATFORMS: { id: Platform; name: string; color: string; commissionRate: number }[] = [
  { id: 'uber', name: 'Uber', color: '#000000', commissionRate: COMMISSION_RATE },
  { id: 'yandex', name: 'Yandex', color: '#FFCC00', commissionRate: COMMISSION_RATE },
  { id: '724', name: '7/24 Taksi', color: '#1a1a1a', commissionRate: COMMISSION_RATE },
  { id: 'bitaksi', name: 'BiTaksi', color: '#FFD600', commissionRate: COMMISSION_RATE },
]

export const CITY_BY_PREFIX: Record<string, string> = {
  '34': 'İstanbul',
  '06': 'Ankara',
  '35': 'İzmir',
  '16': 'Bursa',
  '01': 'Adana',
}

export function getCityFromPlate(plate: string) {
  return CITY_BY_PREFIX[plate.slice(0, 2)] ?? 'Diğer'
}

const PLATE_RAW = [
  { plate: '34 ABC 123', driver: 'Ahmet Kaya', city: 'İstanbul', platform: 'uber' as Platform, earnings: 18420, customers: 142, card: 11200, cash: 5220, wallet: 2000 },
  { plate: '34 DEF 456', driver: 'Mehmet Yılmaz', city: 'İstanbul', platform: 'yandex' as Platform, earnings: 15680, customers: 118, card: 9800, cash: 3880, wallet: 2000 },
  { plate: '34 GHI 789', driver: 'Ali Demir', city: 'İstanbul', platform: 'bitaksi' as Platform, earnings: 12340, customers: 95, card: 7200, cash: 4140, wallet: 1000 },
  { plate: '34 MNO 345', driver: 'Emre Yıldız', city: 'İstanbul', platform: 'uber' as Platform, earnings: 21500, customers: 168, card: 14000, cash: 5500, wallet: 2000 },
  { plate: '34 STU 901', driver: 'Cem Aydın', city: 'İstanbul', platform: '724' as Platform, earnings: 14200, customers: 102, card: 8800, cash: 3900, wallet: 1500 },
  { plate: '06 JKL 012', driver: 'Hasan Öztürk', city: 'Ankara', platform: '724' as Platform, earnings: 9870, customers: 78, card: 5200, cash: 3670, wallet: 1000 },
  { plate: '06 VWX 234', driver: 'Serkan Polat', city: 'Ankara', platform: 'uber' as Platform, earnings: 13450, customers: 91, card: 8100, cash: 4350, wallet: 1000 },
  { plate: '35 PQR 678', driver: 'Burak Şahin', city: 'İzmir', platform: 'yandex' as Platform, earnings: 11200, customers: 86, card: 6800, cash: 3400, wallet: 1000 },
  { plate: '35 YZA 567', driver: 'Deniz Akın', city: 'İzmir', platform: 'bitaksi' as Platform, earnings: 9680, customers: 72, card: 5900, cash: 2780, wallet: 1000 },
]

export const PLATES = PLATE_RAW.map((p) => ({
  ...p,
  commission: Math.round(p.earnings * (COMMISSION_RATE / 100)),
}))

export interface Trip {
  id: string
  platform: Platform
  plate: string
  driver: string
  customer: string
  from: string
  to: string
  amount: number
  payment: PaymentMethod
  date: string
  duration: string
  distance: string
}

export const TRIPS: Trip[] = [
  { id: 't1', platform: 'uber', plate: '34 MNO 345', driver: 'Emre Yıldız', customer: 'Ayşe Korkmaz', from: 'Kadıköy Moda', to: 'Sabiha Gökçen Havalimanı', amount: 485, payment: 'card', date: '12.06.2025, 14:32', duration: '42 dk', distance: '28 km' },
  { id: 't2', platform: 'uber', plate: '34 ABC 123', driver: 'Ahmet Kaya', customer: 'Murat Çelik', from: 'Beşiktaş', to: 'Levent', amount: 165, payment: 'wallet', date: '12.06.2025, 13:15', duration: '18 dk', distance: '9 km' },
  { id: 't3', platform: 'uber', plate: '34 MNO 345', driver: 'Emre Yıldız', customer: 'Zeynep Arslan', from: 'Taksim', to: 'Şişli', amount: 120, payment: 'cash', date: '12.06.2025, 11:48', duration: '14 dk', distance: '6 km' },
  { id: 't4', platform: 'uber', plate: '34 ABC 123', driver: 'Ahmet Kaya', customer: 'Can Özdemir', from: 'Üsküdar', to: 'Fatih', amount: 210, payment: 'card', date: '12.06.2025, 10:22', duration: '25 dk', distance: '14 km' },
  { id: 't5', platform: 'yandex', plate: '34 DEF 456', driver: 'Mehmet Yılmaz', customer: 'Elif Yıldırım', from: 'Ataşehir', to: 'Maltepe', amount: 145, payment: 'card', date: '12.06.2025, 15:05', duration: '16 dk', distance: '8 km' },
  { id: 't6', platform: 'yandex', plate: '35 PQR 678', driver: 'Burak Şahin', customer: 'Hakan Demir', from: 'Bakırköy', to: 'Ataköy', amount: 95, payment: 'cash', date: '12.06.2025, 12:40', duration: '11 dk', distance: '5 km' },
  { id: 't7', platform: 'yandex', plate: '34 DEF 456', driver: 'Mehmet Yılmaz', customer: 'Selin Aktaş', from: 'Kartal', to: 'Pendik', amount: 175, payment: 'wallet', date: '12.06.2025, 09:55', duration: '20 dk', distance: '12 km' },
  { id: 't8', platform: 'bitaksi', plate: '34 GHI 789', driver: 'Ali Demir', customer: 'Oğuz Kara', from: 'Eminönü', to: 'Sultanahmet', amount: 85, payment: 'cash', date: '12.06.2025, 16:10', duration: '8 dk', distance: '3 km' },
  { id: 't9', platform: 'bitaksi', plate: '34 GHI 789', driver: 'Ali Demir', customer: 'Deniz Akın', from: 'Nişantaşı', to: 'Mecidiyeköy', amount: 130, payment: 'card', date: '12.06.2025, 08:30', duration: '15 dk', distance: '7 km' },
  { id: 't10', platform: '724', plate: '06 JKL 012', driver: 'Hasan Öztürk', customer: 'Fatma Güneş', from: 'Ankara Kızılay', to: 'Çankaya', amount: 110, payment: 'cash', date: '12.06.2025, 17:20', duration: '12 dk', distance: '5 km' },
  { id: 't11', platform: '724', plate: '06 JKL 012', driver: 'Hasan Öztürk', customer: 'Kerem Polat', from: 'Ankara Esenboğa', to: 'Ulus', amount: 380, payment: 'card', date: '12.06.2025, 07:45', duration: '35 dk', distance: '24 km' },
  { id: 't12', platform: 'uber', plate: '34 ABC 123', driver: 'Ahmet Kaya', customer: 'Buse Erten', from: 'Bostancı', to: 'Kozyatağı', amount: 98, payment: 'card', date: '11.06.2025, 22:10', duration: '10 dk', distance: '4 km' },
  { id: 't13', platform: 'yandex', plate: '35 PQR 678', driver: 'Burak Şahin', customer: 'Tolga Şen', from: 'Florya', to: 'Yeşilköy', amount: 155, payment: 'card', date: '11.06.2025, 19:33', duration: '17 dk', distance: '9 km' },
  { id: 't14', platform: 'bitaksi', plate: '34 GHI 789', driver: 'Ali Demir', customer: 'Gizem Koç', from: 'Beyoğlu', to: 'Karaköy', amount: 72, payment: 'wallet', date: '11.06.2025, 18:05', duration: '7 dk', distance: '2 km' },
  { id: 't15', platform: 'uber', plate: '34 MNO 345', driver: 'Emre Yıldız', customer: 'Serkan Yavuz', from: 'Maslak', to: 'Sarıyer', amount: 195, payment: 'card', date: '11.06.2025, 16:48', duration: '22 dk', distance: '11 km' },
]

export function getTripsByPlatform(platformId: Platform | string) {
  return TRIPS.filter((t) => t.platform === platformId)
}

export function getTripsByPlate(plate: string) {
  return TRIPS.filter((t) => t.plate === plate)
}

export function getTripsByCustomer(customerName: string) {
  return TRIPS.filter((t) => t.customer === customerName)
}

export function getPlatesByPlatform(platformId: Platform) {
  return PLATES.filter((p) => p.platform === platformId)
}

export function getPlateAdminEarnings(earnings: number) {
  return Math.round(earnings * (ADMIN_COMMISSION_RATE / 100))
}

export const RECENT_TRIPS = [...TRIPS].slice(0, 6)

export const ADMIN_SUMMARY = PLATFORMS.map((p) => {
  const summary = PLATFORM_SUMMARY_PLACEHOLDER(p)
  return {
    id: p.id,
    name: p.name,
    color: p.color,
    totalVolume: summary.earnings,
    platformCommission: summary.commissionTotal,
    adminEarnings: Math.round(summary.earnings * (ADMIN_COMMISSION_RATE / 100)),
    tripCount: summary.tripCount,
    plateCount: summary.plateCount,
    customers: summary.customers,
  }
})

function PLATFORM_SUMMARY_PLACEHOLDER(p: (typeof PLATFORMS)[number]) {
  const plates = PLATES.filter((pl) => pl.platform === p.id)
  const earnings = plates.reduce((s, pl) => s + pl.earnings, 0)
  const commissionTotal = plates.reduce((s, pl) => s + pl.commission, 0)
  const customers = plates.reduce((s, pl) => s + pl.customers, 0)
  const tripCount = getTripsByPlatform(p.id).length
  return { earnings, commissionTotal, customers, tripCount, plateCount: plates.length }
}

export const TOTAL_ADMIN_EARNINGS = ADMIN_SUMMARY.reduce((s, p) => s + p.adminEarnings, 0)

export const PLATFORM_SUMMARY = PLATFORMS.map((p) => {
  const plates = PLATES.filter((pl) => pl.platform === p.id)
  const earnings = plates.reduce((s, pl) => s + pl.earnings, 0)
  const commissionTotal = plates.reduce((s, pl) => s + pl.commission, 0)
  const customers = plates.reduce((s, pl) => s + pl.customers, 0)
  const card = plates.reduce((s, pl) => s + pl.card, 0)
  const cash = plates.reduce((s, pl) => s + pl.cash, 0)
  const wallet = plates.reduce((s, pl) => s + pl.wallet, 0)
  const tripCount = getTripsByPlatform(p.id).length
  return { ...p, earnings, commissionTotal, customers, card, cash, wallet, plateCount: plates.length, tripCount }
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

export const WALLET_BY_PLATE: Record<string, string> = {
  '34 ABC 123': 'CZD-100001',
  '34 DEF 456': 'CZD-100002',
  '34 MNO 345': 'CZD-100003',
  '34 GHI 789': 'CZD-100004',
}

export interface DriverEarningRow {
  driver: string
  plate: string
  city: string
  platform: Platform
  earnings: number
  walletId: string | null
}

/** Plaka başına sürücü kırılımı — 34 MNO 345 örneğinde 3 sürücü */
export const DRIVER_EARNINGS: DriverEarningRow[] = [
  ...PLATES.filter((p) => p.plate !== '34 MNO 345').map((p) => ({
    driver: p.driver,
    plate: p.plate,
    city: p.city,
    platform: p.platform,
    earnings: p.earnings,
    walletId: WALLET_BY_PLATE[p.plate] ?? null,
  })),
  { driver: 'Emre Yıldız', plate: '34 MNO 345', city: 'İstanbul', platform: 'uber' as Platform, earnings: 9800, walletId: 'CZD-100003' },
  { driver: 'Kaan Bulut', plate: '34 MNO 345', city: 'İstanbul', platform: 'uber' as Platform, earnings: 7200, walletId: 'CZD-100005' },
  { driver: 'Murat Çelik', plate: '34 MNO 345', city: 'İstanbul', platform: 'uber' as Platform, earnings: 4500, walletId: 'CZD-100006' },
]

export const WALLET_PAYOUT_COMMISSION_RATE = 1.5

export interface WalletTransferStat {
  walletId: string
  driver: string
  plate: string
  transferCount: number
  totalTransferred: number
}

export function calcWalletTransferCommission(amount: number) {
  return Math.round(amount * WALLET_PAYOUT_COMMISSION_RATE / 100)
}

/** Plaka sahibi cüzdanlarına para gönderimlerinde alınan komisyon */
export const WALLET_TRANSFER_STATS: WalletTransferStat[] = [
  { walletId: 'CZD-100001', driver: 'Ahmet Kaya', plate: '34 ABC 123', transferCount: 18, totalTransferred: 14200 },
  { walletId: 'CZD-100002', driver: 'Mehmet Yılmaz', plate: '34 DEF 456', transferCount: 15, totalTransferred: 11800 },
  { walletId: 'CZD-100003', driver: 'Emre Yıldız', plate: '34 MNO 345', transferCount: 14, totalTransferred: 11200 },
  { walletId: 'CZD-100004', driver: 'Ali Demir', plate: '34 GHI 789', transferCount: 12, totalTransferred: 8900 },
  { walletId: 'CZD-100005', driver: 'Kaan Bulut', plate: '34 MNO 345', transferCount: 9, totalTransferred: 6800 },
  { walletId: 'CZD-100006', driver: 'Murat Çelik', plate: '34 MNO 345', transferCount: 7, totalTransferred: 4200 },
  { walletId: 'CZD-ADMIN-01', driver: '—', plate: '—', transferCount: 5, totalTransferred: 3200 },
]

export function formatMoney(n: number) {
  return `₺ ${n.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
}
