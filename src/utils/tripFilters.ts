import { Trip } from '../data/mockTaxiData'

/** "12.06.2025, 14:32" → Date (gün başı) */
export function parseTripDate(dateStr: string): Date | null {
  const match = dateStr.match(/(\d{2})\.(\d{2})\.(\d{4})/)
  if (!match) return null
  const [, day, month, year] = match
  return new Date(+year, +month - 1, +day)
}

/** YYYY-MM-DD → Date */
function parseInputDate(iso: string): Date | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function formatTripDateLabel(date: Date) {
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function filterTripsByDateRange(trips: Trip[], dateFrom: string, dateTo: string): Trip[] {
  const from = parseInputDate(dateFrom)
  const to = parseInputDate(dateTo)
  if (!from && !to) return trips

  return trips.filter((t) => {
    const tripDate = parseTripDate(t.date)
    if (!tripDate) return false
    if (from && tripDate < from) return false
    if (to) {
      const end = new Date(to)
      end.setHours(23, 59, 59, 999)
      if (tripDate > end) return false
    }
    return true
  })
}

export function getUniqueTripDates(trips: Trip[]): string[] {
  const set = new Set<string>()
  trips.forEach((t) => {
    const d = parseTripDate(t.date)
    if (d) set.add(formatTripDateLabel(d))
  })
  return [...set].sort((a, b) => {
    const [daDay, daMonth, daYear] = a.split('.').map(Number)
    const [dbDay, dbMonth, dbYear] = b.split('.').map(Number)
    return new Date(dbYear, dbMonth - 1, dbDay).getTime() - new Date(daYear, daMonth - 1, daDay).getTime()
  })
}

/** DD.MM.YYYY etiketini YYYY-MM-DD input değerine çevirir */
export function tripLabelToInputDate(label: string): string {
  const [day, month, year] = label.split('.')
  if (!day || !month || !year) return ''
  return `${year}-${month}-${day}`
}

export function getTripDateBounds(trips: Trip[]) {
  const dates = trips.map((t) => parseTripDate(t.date)).filter((d): d is Date => d != null)
  if (dates.length === 0) return { min: '', max: '' }
  const min = new Date(Math.min(...dates.map((d) => d.getTime())))
  const max = new Date(Math.max(...dates.map((d) => d.getTime())))
  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return { min: toIso(min), max: toIso(max) }
}
