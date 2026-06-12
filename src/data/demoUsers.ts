export type UserRole = 'admin' | 'user'

export interface DemoUser {
  id: string
  loginKey: string
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'a1',
    loginKey: 'admin',
    name: 'Deniz Tol',
    email: 'deniz@fineros.com.tr',
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
