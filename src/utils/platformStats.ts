import { PLATES, TRIPS, getTripsByPlatform, getTripsByPlate } from '../data/mockTaxiData'
import { PlatformSetting } from '../context/PanelDataContext'

export interface AdminPlatformStats {
  id: string
  name: string
  color: string
  platformCommissionRate: number
  adminCommissionRate: number
  totalVolume: number
  platformCommission: number
  adminEarnings: number
  tripCount: number
  plateCount: number
  customers: number
}

export function computeAdminSummary(platforms: PlatformSetting[]): AdminPlatformStats[] {
  return platforms.filter((p) => p.active).map((p) => {
    const platformPlates = PLATES.filter((pl) => pl.platform === p.id)
    const totalVolume = platformPlates.reduce((s, pl) => s + pl.earnings, 0)
    const platformCommission = Math.round(totalVolume * p.platformCommissionRate / 100)
    const adminEarnings = Math.round(totalVolume * p.adminCommissionRate / 100)
    const customers = platformPlates.reduce((s, pl) => s + pl.customers, 0)
    const tripCount = getTripsByPlatform(p.id).length
    return {
      id: p.id,
      name: p.name,
      color: p.color,
      platformCommissionRate: p.platformCommissionRate,
      adminCommissionRate: p.adminCommissionRate,
      totalVolume,
      platformCommission,
      adminEarnings,
      tripCount,
      plateCount: platformPlates.length,
      customers,
    }
  })
}

export function getPlateAdminPay(earnings: number, adminRate: number) {
  return Math.round(earnings * adminRate / 100)
}

export function getPlatesForPlatform(platformId: string) {
  return PLATES.filter((p) => p.platform === platformId)
}

export { getTripsByPlate, TRIPS }
