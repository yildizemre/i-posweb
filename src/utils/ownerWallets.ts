import { PLATES } from '../data/mockTaxiData'

export type OwnerWalletTier = 'main' | 'sub'

export interface SubWalletDriverAssign {
  fullName: string
  tc: string
  phone: string
  walletNo: string
}

export interface OwnerWalletRecord {
  id: string
  walletId: string
  ownerId: string
  plate: string
  tier: OwnerWalletTier
  slotIndex: number | null
  driver: string | null
  driverTc: string | null
  driverPhone: string | null
  /** Şoförün kişisel cüzdanı — gün sonu kazanç aktarım hedefi */
  driverWalletId: string | null
  balance: number
  parentWalletId: string | null
  status: 'active' | 'frozen' | 'closed'
  createdAt: string
}

export interface OwnerWalletGroup {
  ownerId: string
  plate: string
  platform: string
  main: OwnerWalletRecord
  subs: OwnerWalletRecord[]
}

/** Sahip başına 3 alt cüzdan — şoför profili (boş slot null) */
const OWNER_SUB_DRIVER_PROFILES: Record<string, (SubWalletDriverAssign | null)[]> = {
  A: [{ fullName: 'Ahmet Kaya', tc: '12345678901', phone: '0532 111 22 33', walletNo: 'CZD-100001' }, null, null],
  B: [{ fullName: 'Mehmet Yılmaz', tc: '23456789012', phone: '0533 222 33 44', walletNo: 'CZD-100002' }, null, null],
  C: [{ fullName: 'Ali Demir', tc: '34567890123', phone: '0534 333 44 55', walletNo: 'CZD-100003' }, null, null],
  D: [
    { fullName: 'Emre Yıldız', tc: '45678901234', phone: '0535 444 55 66', walletNo: 'CZD-100010' },
    { fullName: 'Kaan Bulut', tc: '56789012345', phone: '0536 555 66 77', walletNo: 'CZD-100011' },
    { fullName: 'Murat Çelik', tc: '67890123456', phone: '0537 666 77 88', walletNo: 'CZD-100012' },
  ],
  E: [{ fullName: 'Cem Aydın', tc: '78901234567', phone: '0538 777 88 99', walletNo: 'CZD-100004' }, null, null],
  F: [{ fullName: 'Hasan Öztürk', tc: '89012345678', phone: '0539 888 99 00', walletNo: 'CZD-100005' }, null, null],
  G: [{ fullName: 'Serkan Polat', tc: '90123456789', phone: '0541 999 00 11', walletNo: 'CZD-100006' }, null, null],
  H: [{ fullName: 'Burak Şahin', tc: '11223344556', phone: '0542 100 11 22', walletNo: 'CZD-100007' }, null, null],
  I: [{ fullName: 'Deniz Akın', tc: '22334455667', phone: '0543 200 22 33', walletNo: 'CZD-100008' }, null, null],
}

const SUB_BALANCES: Record<string, number[]> = {
  A: [1250, 0, 0],
  B: [890, 0, 0],
  C: [450, 0, 0],
  D: [2100, 680, 320],
  E: [1180, 0, 0],
  F: [760, 0, 0],
  G: [920, 0, 0],
  H: [640, 0, 0],
  I: [510, 0, 0],
}

const MAIN_BALANCES: Record<string, number> = {
  A: 4170, B: 3680, C: 2890, D: 5850, E: 3240,
  F: 2110, G: 2530, H: 1980, I: 1670,
}

function buildOwnerWalletGroups(): OwnerWalletGroup[] {
  return PLATES.map((plateRow) => {
    const ownerId = plateRow.owner
    const mainWalletId = `CZD-ANA-${ownerId}`
    const subs = [1, 2, 3].map((slot) => {
      const profile = OWNER_SUB_DRIVER_PROFILES[ownerId]?.[slot - 1] ?? null
      const balance = SUB_BALANCES[ownerId]?.[slot - 1] ?? 0
      return {
        id: `ow-sub-${ownerId}-${slot}`,
        walletId: `CZD-${ownerId}-${String(slot).padStart(2, '0')}`,
        ownerId,
        plate: plateRow.plate,
        tier: 'sub' as const,
        slotIndex: slot,
        driver: profile?.fullName ?? null,
        driverTc: profile?.tc ?? null,
        driverPhone: profile?.phone ?? null,
        driverWalletId: profile?.walletNo ?? null,
        balance,
        parentWalletId: mainWalletId,
        status: 'active' as const,
        createdAt: `${8 + slot}.06.2025`,
      }
    })

    const main: OwnerWalletRecord = {
      id: `ow-main-${ownerId}`,
      walletId: mainWalletId,
      ownerId,
      plate: plateRow.plate,
      tier: 'main',
      slotIndex: null,
      driver: null,
      driverTc: null,
      driverPhone: null,
      driverWalletId: null,
      balance: MAIN_BALANCES[ownerId] ?? subs.reduce((s, w) => s + w.balance, 0),
      parentWalletId: null,
      status: 'active',
      createdAt: '05.06.2025',
    }

    return {
      ownerId,
      plate: plateRow.plate,
      platform: plateRow.platform,
      main,
      subs,
    }
  })
}

export const OWNER_WALLET_GROUPS = buildOwnerWalletGroups()

export function getOwnerWalletGroup(ownerId: string): OwnerWalletGroup | undefined {
  return OWNER_WALLET_GROUPS.find((g) => g.ownerId === ownerId)
}

export function getSubWalletId(ownerId: string, slotIndex: number) {
  return `CZD-${ownerId}-${String(slotIndex).padStart(2, '0')}`
}

export function getMainWalletId(ownerId: string) {
  return `CZD-ANA-${ownerId}`
}

/** DRIVER_EARNINGS alt cüzdan ID eşlemesi için */
export function getDriverSubWalletId(ownerId: string, driver: string): string | null {
  const group = getOwnerWalletGroup(ownerId)
  if (!group) return null
  const sub = group.subs.find((s) => s.driver === driver)
  return sub?.walletId ?? null
}

/** Gün sonu aktarım hedefi — şoförün kişisel cüzdan ID */
export function getDriverPersonalWalletId(ownerId: string, driver: string): string | null {
  const group = getOwnerWalletGroup(ownerId)
  if (!group) return null
  const sub = group.subs.find((s) => s.driver === driver)
  return sub?.driverWalletId ?? null
}
