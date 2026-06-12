import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import CompanySelectPage from './pages/CompanySelectPage'
import ApplicationLayout from './layouts/ApplicationLayout'
import ApplicationPage from './pages/application/ApplicationPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/giris" replace />} />
      <Route path="/giris" element={<LoginPage />} />
      <Route path="/kayit" element={<RegisterPage />} />
      <Route path="/sifremi-unuttum" element={<ForgotPasswordPage />} />
      <Route path="/sirket-sec" element={<CompanySelectPage />} />
      <Route path="/basvuru" element={<ApplicationLayout />}>
        <Route index element={<ApplicationPage />} />
      </Route>
      <Route path="/panel/*" element={<DashboardPage />} />
    </Routes>
  )
}
