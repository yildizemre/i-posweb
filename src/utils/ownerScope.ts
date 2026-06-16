import { getPlatesByOwner } from '../data/mockTaxiData'

export { getPlatesByOwner }

export function getOwnerPlateLabels(ownerId: string) {
  return getPlatesByOwner(ownerId).map((p) => p.plate).join(', ')
}
