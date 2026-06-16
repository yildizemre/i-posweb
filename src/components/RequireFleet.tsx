import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** Taksi sahibi veya filo kullanıcısı (Emre Yıldız) */
export default function RequireFleet({ children }: { children: ReactNode }) {
  const { isUser, isOwner } = useAuth()
  if (!isUser && !isOwner) return <Navigate to="/panel" replace />
  return <>{children}</>
}
