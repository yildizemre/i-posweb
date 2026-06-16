import { useMemo, useState } from 'react'
import CampaignCards from '../../components/dashboard/CampaignCards'
import { usePanelData, CampaignCategory } from '../../context/PanelDataContext'
import { CATEGORY_LABELS, getTotalCampaignEarnings, formatTry } from '../../utils/campaignEconomics'
import { useAuth } from '../../context/AuthContext'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import cs from './CampaignsPage.module.css'

const CATEGORIES: { id: CampaignCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'lastik', label: 'Lastik' },
  { id: 'sigorta', label: 'Sigorta' },
  { id: 'yag', label: 'Yağ' },
  { id: 'oto-yikama', label: 'Oto Yıkama' },
]

export default function CampaignsPage() {
  const { activeCampaigns, campaigns } = usePanelData()
  const { isAdmin } = useAuth()
  const [category, setCategory] = useState<CampaignCategory | 'all'>('all')

  const filtered = useMemo(
    () => category === 'all' ? activeCampaigns : activeCampaigns.filter((c) => c.category === category),
    [activeCampaigns, category],
  )

  const totalEarned = useMemo(
    () => (isAdmin ? campaigns : activeCampaigns).reduce((sum, c) => sum + getTotalCampaignEarnings(c), 0),
    [campaigns, activeCampaigns, isAdmin],
  )

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Fırsatlar & Kampanyalar</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Fırsatlar & Kampanyalar</h1>
            <p className={s.contentSub}>
              {activeCampaigns.length} aktif fırsat — sigorta, lastik, yağ, oto yıkama
              {isAdmin && <> · Toplam kazanç: <strong>{formatTry(totalEarned)}</strong></>}
            </p>
          </div>
        </div>

        <div className={cs.filters}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${cs.filterBtn} ${category === cat.id ? cs.filterActive : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <CampaignCards
          campaigns={filtered}
          showEarnings={isAdmin}
          emptyText={`${category === 'all' ? 'Aktif' : CATEGORY_LABELS[category as CampaignCategory]} fırsatı bulunmuyor.`}
        />
      </div>
    </>
  )
}
