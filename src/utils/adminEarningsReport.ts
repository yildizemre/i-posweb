import {
  DRIVER_EARNINGS, WALLET_TRANSFER_STATS, calcWalletTransferCommission,
} from '../data/mockTaxiData'
import { Campaign, DriverWallet, PlatformSetting, ADMIN_PAYOUT_WALLETS } from '../context/PanelDataContext'
import { buildFleetRows } from './fleetStats'
import { computeAdminSummary, getPlateAdminPay } from './platformStats'
import { getTotalCampaignEarnings, CATEGORY_LABELS } from './campaignEconomics'

export interface DriverEarningsRow {
  driver: string
  owner: string
  plate: string
  city: string
  platform: string
  platformName: string
  ciro: number
  adminPay: number
  walletId: string | null
}

export interface WalletEarningsRow {
  walletId: string
  label: string
  driver: string
  plate: string
  platformPay: number
  transferCommission: number
  campaignPay: number
  total: number
  transferCount: number
  totalTransferred: number
}

export interface CampaignEarningsRow {
  id: string
  title: string
  category: string
  payoutWalletId: string
  redemptionCount: number
  marginPerSale: number
  totalEarned: number
}

export interface AdminEarningsReport {
  platformTotal: number
  campaignTotal: number
  transferCommissionTotal: number
  grandTotal: number
  platforms: ReturnType<typeof computeAdminSummary>
  plates: ReturnType<typeof buildFleetRows>
  drivers: DriverEarningsRow[]
  wallets: WalletEarningsRow[]
  campaigns: CampaignEarningsRow[]
  transfers: {
    walletId: string
    driver: string
    plate: string
    transferCount: number
    totalTransferred: number
    adminCommission: number
  }[]
}

function getPlatformName(id: string, settings: PlatformSetting[]) {
  return settings.find((s) => s.id === id)?.name ?? id
}

function getAdminRate(id: string, settings: PlatformSetting[]) {
  return settings.find((s) => s.id === id)?.adminCommissionRate ?? 1
}

export function buildAdminEarningsReport(
  platformSettings: PlatformSetting[],
  campaigns: Campaign[],
  driverWallets: DriverWallet[],
): AdminEarningsReport {
  const platforms = computeAdminSummary(platformSettings)
  const plates = buildFleetRows(platformSettings)
  const platformTotal = platforms.reduce((s, p) => s + p.adminEarnings, 0)

  const drivers: DriverEarningsRow[] = DRIVER_EARNINGS.map((d) => {
    const rate = getAdminRate(d.platform, platformSettings)
    return {
      driver: d.driver,
      owner: d.owner,
      plate: d.plate,
      city: d.city,
      platform: d.platform,
      platformName: getPlatformName(d.platform, platformSettings),
      ciro: d.earnings,
      adminPay: getPlateAdminPay(d.earnings, rate),
      walletId: d.walletId,
    }
  }).sort((a, b) => b.adminPay - a.adminPay)

  const campaignRows: CampaignEarningsRow[] = campaigns
    .filter((c) => c.status === 'active')
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: CATEGORY_LABELS[c.category] ?? c.category,
      payoutWalletId: c.payoutWalletId,
      redemptionCount: c.redemptionCount,
      marginPerSale: getTotalCampaignEarnings({ ...c, redemptionCount: 1 }),
      totalEarned: getTotalCampaignEarnings(c),
    }))
    .sort((a, b) => b.totalEarned - a.totalEarned)

  const campaignTotal = campaignRows.reduce((s, c) => s + c.totalEarned, 0)

  const campaignByWallet = new Map<string, number>()
  campaignRows.forEach((c) => {
    campaignByWallet.set(c.payoutWalletId, (campaignByWallet.get(c.payoutWalletId) ?? 0) + c.totalEarned)
  })

  const platformPayByWallet = new Map<string, number>()
  drivers.forEach((d) => {
    if (!d.walletId) return
    platformPayByWallet.set(d.walletId, (platformPayByWallet.get(d.walletId) ?? 0) + d.adminPay)
  })

  const transferMap = new Map(WALLET_TRANSFER_STATS.map((t) => [t.walletId, t]))
  const transferCommissionTotal = WALLET_TRANSFER_STATS.reduce(
    (s, t) => s + calcWalletTransferCommission(t.totalTransferred),
    0,
  )

  const allWalletIds = new Set<string>([
    ...driverWallets.map((w) => w.walletId),
    ...ADMIN_PAYOUT_WALLETS.map((w) => w.walletId),
    ...WALLET_TRANSFER_STATS.map((t) => t.walletId),
    ...campaignByWallet.keys(),
  ])

  const wallets: WalletEarningsRow[] = [...allWalletIds].map((walletId) => {
    const driverW = driverWallets.find((w) => w.walletId === walletId)
    const adminW = ADMIN_PAYOUT_WALLETS.find((w) => w.walletId === walletId)
    const transfer = transferMap.get(walletId)
    const platformPay = platformPayByWallet.get(walletId) ?? 0
    const transferCommission = transfer ? calcWalletTransferCommission(transfer.totalTransferred) : 0
    const campaignPay = campaignByWallet.get(walletId) ?? 0
    return {
      walletId,
      label: adminW?.label ?? driverW?.driver ?? '—',
      driver: driverW?.driver ?? '—',
      plate: driverW?.plate ?? '—',
      platformPay,
      transferCommission,
      campaignPay,
      total: platformPay + transferCommission + campaignPay,
      transferCount: transfer?.transferCount ?? 0,
      totalTransferred: transfer?.totalTransferred ?? 0,
    }
  }).sort((a, b) => b.total - a.total)

  const transfers = WALLET_TRANSFER_STATS.map((t) => ({
    ...t,
    adminCommission: calcWalletTransferCommission(t.totalTransferred),
  })).sort((a, b) => b.adminCommission - a.adminCommission)

  return {
    platformTotal,
    campaignTotal,
    transferCommissionTotal,
    grandTotal: platformTotal + campaignTotal + transferCommissionTotal,
    platforms,
    plates,
    drivers,
    wallets,
    campaigns: campaignRows,
    transfers,
  }
}
