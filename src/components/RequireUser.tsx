import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireUser({ children }: { children: ReactNode }) {
  const { isUser } = useAuth()
  if (!isUser) return <Navigate to="/panel" replace />
  return <>{children}</>
}
