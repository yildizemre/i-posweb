import { PLATES } from './mockTaxiData'

export type UserRole = 'admin' | 'user' | 'owner'

export interface DemoUser {
  id: string
  loginKey: string
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  ownerId?: string
}

const OWNER_USERS: DemoUser[] = [...new Set(PLATES.map((p) => p.owner))].map((ownerId, i) => ({
  id: `o-${ownerId}`,
  loginKey: ownerId.toLowerCase(),
  name: `Taksi Sahibi ${ownerId}`,
  email: `sahip${ownerId.toLowerCase()}@abcanonim.com`,
  phone: `+90 531 ${String(100 + i).padStart(3, '0')} ${String(10 + i).padStart(2, '0')} ${String(20 + i).padStart(2, '0')}`,
  password: ownerId.toLowerCase(),
  role: 'owner' as const,
  ownerId,
}))

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'a1',
    loginKey: 'admin',
    name: 'Hüseyin İncekara',
    email: 'huseyin@fineros.com.tr',
    phone: '+90 552 895 67 07',
    password: 'admin',
    role: 'admin',
  },
  {
    id: 'u1',
    loginKey: 'user',
    name: 'Emre Yıldız',
    email: 'emre@fineros.com.tr',
    phone: '+90 532 000 11 22',
    password: 'user',
    role: 'user',
  },
  ...OWNER_USERS,
]

export function findUser(login: string, password: string): DemoUser | undefined {
  const key = login.trim().toLowerCase()
  return DEMO_USERS.find((u) =>
    u.password === password &&
    (u.loginKey === key ||
      u.phone.replace(/\s/g, '') === key.replace(/\s/g, '') ||
      u.email.toLowerCase() === key)
  )
}
