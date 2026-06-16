import { createContext, useContext, useState, ReactNode } from 'react'

type AccountType = 'bireysel' | 'kurumsal'

const AccountContext = createContext<{
  type: AccountType
  setType: (t: AccountType) => void
}>({ type: 'kurumsal', setType: () => {} })

export function AccountProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState<AccountType>('kurumsal')
  return <AccountContext.Provider value={{ type, setType }}>{children}</AccountContext.Provider>
}

export function useAccount() {
  return useContext(AccountContext)
}
