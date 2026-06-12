import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import PanelHome from './panel/PanelHome'
import SitesPage from './panel/SitesPage'
import LinksPage from './panel/LinksPage'
import LinkDetailPage from './panel/LinkDetailPage'
import UsersPage from './panel/UsersPage'
import PhysicalPosPage from './panel/PhysicalPosPage'
import SettingsPage from './panel/SettingsPage'
import SupportPage from './panel/SupportPage'
import SupportDetailPage from './panel/SupportDetailPage'
import ReportsPage from './panel/ReportsPage'
import SettlementsPage from './panel/SettlementsPage'
import InvoicesPage from './panel/InvoicesPage'
import NotificationsPage from './panel/NotificationsPage'
import PlatformAnalyticsPage from './panel/PlatformAnalyticsPage'
import CashSettlementPage from './panel/CashSettlementPage'
import PosAssignmentPage from './panel/PosAssignmentPage'

export default function DashboardPage() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<PanelHome />} />
        <Route path="platformlar" element={<PlatformAnalyticsPage />} />
        <Route path="nakit-hakedis" element={<CashSettlementPage />} />
        <Route path="pos-atama" element={<PosAssignmentPage />} />
        <Route path="siteler" element={<SitesPage />} />
        <Route path="linkler" element={<LinksPage />} />
        <Route path="linkler/:id" element={<LinkDetailPage />} />
        <Route path="kullanicilar" element={<UsersPage />} />
        <Route path="fiziki-pos" element={<PhysicalPosPage />} />
        <Route path="ayarlar" element={<SettingsPage />} />
        <Route path="destek" element={<SupportPage />} />
        <Route path="destek/:id" element={<SupportDetailPage />} />
        <Route path="raporlar/islem" element={<ReportsPage />} />
        <Route path="raporlar/hakedis" element={<SettlementsPage />} />
        <Route path="raporlar/faturalar" element={<InvoicesPage />} />
        <Route path="bildirimler" element={<NotificationsPage />} />
      </Route>
    </Routes>
  )
}
