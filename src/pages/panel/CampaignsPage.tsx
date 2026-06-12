import CampaignCards from '../../components/dashboard/CampaignCards'
import { usePanelData } from '../../context/PanelDataContext'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

export default function CampaignsPage() {
  const { activeCampaigns, campaigns } = usePanelData()

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Fırsatlar & Kampanyalar</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Fırsatlar & Kampanyalar</h1>
            <p className={s.contentSub}>Size özel {activeCampaigns.length} aktif fırsat</p>
          </div>
        </div>
        <CampaignCards campaigns={activeCampaigns} emptyText="Şu an aktif kampanya yok. Yakında yeni fırsatlar eklenecek!" />
        {campaigns.filter((c) => c.status !== 'active').length > 0 && (
          <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            * Süresi dolmuş veya taslak kampanyalar burada gösterilmez.
          </p>
        )}
      </div>
    </>
  )
}
