import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AccountProvider } from './context/AccountContext'
import { ProfileProvider } from './context/ProfileContext'
import { PanelDataProvider } from './context/PanelDataContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <ProfileProvider>
          <PanelDataProvider>
            <App />
          </PanelDataProvider>
        </ProfileProvider>
      </AccountProvider>
    </BrowserRouter>
  </StrictMode>,
)
