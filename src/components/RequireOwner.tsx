import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireOwner({ children }: { children: ReactNode }) {
  const { isOwner } = useAuth()
  if (!isOwner) return <Navigate to="/panel" replace />
  return <>{children}</>
}
