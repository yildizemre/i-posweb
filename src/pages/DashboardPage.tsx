import { Routes, Route, Navigate } from 'react-router-dom'
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
import CampaignsPage from './panel/CampaignsPage'
import WalletsPage from './panel/WalletsPage'
import CommissionSettingsPage from './panel/CommissionSettingsPage'
import AdminTaxiFleetPage from './panel/AdminTaxiFleetPage'
import RequireAdmin from '../components/RequireAdmin'
import RequireUser from '../components/RequireUser'

export default function DashboardPage() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<PanelHome />} />
        <Route path="platformlar" element={<RequireUser><PlatformAnalyticsPage /></RequireUser>} />
        <Route path="nakit-hakedis" element={<RequireUser><CashSettlementPage /></RequireUser>} />
        <Route path="pos-atama" element={<RequireUser><PosAssignmentPage /></RequireUser>} />
        <Route path="cuzdanlar" element={<RequireUser><WalletsPage /></RequireUser>} />
        <Route path="taksi-filo" element={<RequireAdmin><AdminTaxiFleetPage /></RequireAdmin>} />
        <Route path="komisyon-ayarlari" element={<RequireAdmin><CommissionSettingsPage /></RequireAdmin>} />
        <Route path="kampanya-yonetimi" element={<RequireAdmin><SitesPage /></RequireAdmin>} />
        <Route path="siteler" element={<RequireAdmin><Navigate to="/panel/kampanya-yonetimi" replace /></RequireAdmin>} />
        <Route path="firsatlar" element={<CampaignsPage />} />
        <Route path="linkler" element={<LinksPage />} />
        <Route path="linkler/:id" element={<LinkDetailPage />} />
        <Route path="kullanicilar" element={<RequireAdmin><UsersPage /></RequireAdmin>} />
        <Route path="fiziki-pos" element={<RequireUser><PhysicalPosPage /></RequireUser>} />
        <Route path="ayarlar" element={<SettingsPage />} />
        <Route path="destek" element={<SupportPage />} />
        <Route path="destek/:id" element={<SupportDetailPage />} />
        <Route path="raporlar/islem" element={<RequireAdmin><ReportsPage /></RequireAdmin>} />
        <Route path="raporlar/hakedis" element={<RequireAdmin><SettlementsPage /></RequireAdmin>} />
        <Route path="raporlar/faturalar" element={<RequireAdmin><InvoicesPage /></RequireAdmin>} />
        <Route path="bildirimler" element={<NotificationsPage />} />
      </Route>
    </Routes>
  )
}
