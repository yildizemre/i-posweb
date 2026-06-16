import { PLATES, getPlatesByOwner } from '../data/mockTaxiData'
import { OwnerWalletGroup } from './ownerWallets'

/** Kullanıcı (Emre Yıldız) tüm filoyu görür; admin verisindeki sahip harfleri sadece iç eşleme için kalır. */
export function getFleetPlates(isUser: boolean, ownerId: string | null) {
  if (isUser) return PLATES
  if (!ownerId) return []
  return getPlatesByOwner(ownerId)
}

export function getWalletKeyForPlate(plate: string): string | null {
  return PLATES.find((p) => p.plate === plate)?.owner ?? null
}

export function sumFleetMainWallets(
  plates: typeof PLATES,
  getOwnerWallets: (ownerKey: string) => OwnerWalletGroup | undefined,
) {
  const keys = [...new Set(plates.map((p) => p.owner))]
  return keys.reduce((sum, key) => sum + (getOwnerWallets(key)?.main.balance ?? 0), 0)
}
