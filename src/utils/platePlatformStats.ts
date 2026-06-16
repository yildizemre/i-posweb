import { Trip, PLATFORMS, Platform, PaymentMethod, formatMoney } from '../data/mockTaxiData'

export interface PlatformPlateStats {
  platformId: Platform
  name: string
  color: string
  tripCount: number
  totalCiro: number
  card: number
  cash: number
  wallet: number
  trips: Trip[]
}

export function aggregatePlateByPlatform(trips: Trip[]): PlatformPlateStats[] {
  return PLATFORMS.map((p) => {
    const pt = trips.filter((t) => t.platform === p.id)
    const sum = (pay: PaymentMethod) =>
      pt.filter((t) => t.payment === pay).reduce((s, t) => s + t.amount, 0)
    return {
      platformId: p.id,
      name: p.name,
      color: p.color,
      tripCount: pt.length,
      totalCiro: pt.reduce((s, t) => s + t.amount, 0),
      card: sum('card'),
      cash: sum('cash'),
      wallet: sum('wallet'),
      trips: pt,
    }
  })
}

export function sumTripPayments(trips: Trip[]) {
  const sum = (pay: PaymentMethod) =>
    trips.filter((t) => t.payment === pay).reduce((s, t) => s + t.amount, 0)
  return {
    total: trips.reduce((s, t) => s + t.amount, 0),
    card: sum('card'),
    cash: sum('cash'),
    wallet: sum('wallet'),
    tripCount: trips.length,
  }
}

export { formatMoney }
