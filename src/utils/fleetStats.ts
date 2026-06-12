import { PLATES, getTripsByPlate } from '../data/mockTaxiData'
import { PlatformSetting } from '../context/PanelDataContext'
import { getPlateAdminPay } from './platformStats'

export interface FleetPlateRow {
  plate: string
  driver: string
  city: string
  platform: string
  platformName: string
  earnings: number
  adminPay: number
  tripCount: number
  customers: number
  platformCommissionRate: number
  adminCommissionRate: number
}

export interface CityFleetStats {
  city: string
  taxiCount: number
  totalCiro: number
  totalAdminPay: number
  tripCount: number
  customers: number
  plates: FleetPlateRow[]
}

function getPlatformRates(platformId: string, settings: PlatformSetting[]) {
  const p = settings.find((s) => s.id === platformId)
  return {
    platformName: p?.name ?? platformId,
    platformCommissionRate: p?.platformCommissionRate ?? 10,
    adminCommissionRate: p?.adminCommissionRate ?? 1,
  }
}

export function buildFleetRows(platformSettings: PlatformSetting[]): FleetPlateRow[] {
  return PLATES.map((pl) => {
    const rates = getPlatformRates(pl.platform, platformSettings)
    return {
      plate: pl.plate,
      driver: pl.driver,
      city: pl.city,
      platform: pl.platform,
      platformName: rates.platformName,
      earnings: pl.earnings,
      adminPay: getPlateAdminPay(pl.earnings, rates.adminCommissionRate),
      tripCount: getTripsByPlate(pl.plate).length,
      customers: pl.customers,
      platformCommissionRate: rates.platformCommissionRate,
      adminCommissionRate: rates.adminCommissionRate,
    }
  })
}

export function computeCityStats(rows: FleetPlateRow[]): CityFleetStats[] {
  const map = new Map<string, FleetPlateRow[]>()
  rows.forEach((r) => {
    const list = map.get(r.city) ?? []
    list.push(r)
    map.set(r.city, list)
  })
  return [...map.entries()]
    .map(([city, plates]) => ({
      city,
      taxiCount: plates.length,
      totalCiro: plates.reduce((s, p) => s + p.earnings, 0),
      totalAdminPay: plates.reduce((s, p) => s + p.adminPay, 0),
      tripCount: plates.reduce((s, p) => s + p.tripCount, 0),
      customers: plates.reduce((s, p) => s + p.customers, 0),
      plates: [...plates].sort((a, b) => b.earnings - a.earnings),
    }))
    .sort((a, b) => b.totalCiro - a.totalCiro)
}

export function getFleetCities(rows: FleetPlateRow[]) {
  return [...new Set(rows.map((r) => r.city))].sort()
}

export function getFleetPlatforms(rows: FleetPlateRow[]) {
  return [...new Set(rows.map((r) => r.platform))]
}

export function filterFleetRows(
  rows: FleetPlateRow[],
  filters: { city: string; platform: string; search: string },
) {
  const q = filters.search.trim().toLowerCase()
  return rows.filter((r) => {
    if (filters.city && filters.city !== 'all' && r.city !== filters.city) return false
    if (filters.platform && filters.platform !== 'all' && r.platform !== filters.platform) return false
    if (q && !r.plate.toLowerCase().includes(q) && !r.driver.toLowerCase().includes(q)) return false
    return true
  })
}
