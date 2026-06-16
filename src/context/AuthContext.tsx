import { createContext, useContext, useState, ReactNode } from 'react'
import { DemoUser, UserRole, findUser } from '../data/demoUsers'

const AuthContext = createContext<{
  user: DemoUser | null
  isAuthenticated: boolean
  role: UserRole | null
  ownerId: string | null
  isAdmin: boolean
  isUser: boolean
  isOwner: boolean
  hideFinancials: boolean
  login: (login: string, password: string) => { ok: boolean; error?: string; user?: DemoUser }
  logout: () => void
} | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null)

  const login = (loginId: string, password: string) => {
    const found = findUser(loginId, password)
    if (!found) {
      return { ok: false, error: 'Telefon/e-posta veya şifre hatalı.' }
    }
    setUser(found)
    return { ok: true, user: found }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      ownerId: user?.ownerId ?? null,
      isAdmin: user?.role === 'admin',
      isUser: user?.role === 'user',
      isOwner: user?.role === 'owner',
      hideFinancials: false,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
