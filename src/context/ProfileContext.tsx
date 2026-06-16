import { createContext, useContext, useState, ReactNode } from 'react'
import { USER_EMAIL, USER_NAME } from '../constants/brand'

export interface Profile {
  name: string
  email: string
  phone: string
  role: string
}

const ProfileContext = createContext<{
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
} | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    name: USER_NAME,
    email: USER_EMAIL,
    phone: '+90 552 895 67 07',
    role: 'Üye',
  })

  const updateProfile = (data: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...data }))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
