import { PLATFORMS, Platform } from '../data/mockTaxiData'

export interface PlatePickerItem {
  plate: string
  driver?: string
  city?: string
  platformName?: string
}

export function toPlatePickerItems(
  plates: Array<{ plate: string; driver?: string; city?: string; platform?: Platform | string }>,
): PlatePickerItem[] {
  return plates.map((p) => ({
    plate: p.plate,
    driver: p.driver,
    city: p.city,
    platformName: p.platform
      ? PLATFORMS.find((x) => x.id === p.platform)?.name ?? String(p.platform)
      : undefined,
  }))
}

function norm(value: string) {
  return value.toLowerCase().replace(/\s+/g, '')
}

export function filterPlatesByQuery(items: PlatePickerItem[], query: string): PlatePickerItem[] {
  const q = norm(query)
  if (!q) return items
  return items.filter((item) => {
    if (norm(item.plate).includes(q)) return true
    if (item.driver && norm(item.driver).includes(q)) return true
    if (item.city && norm(item.city).includes(q)) return true
    if (item.platformName && norm(item.platformName).includes(q)) return true
    return false
  })
}
