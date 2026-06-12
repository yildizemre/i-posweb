import { Tag, Calendar, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Campaign } from '../../context/PanelDataContext'
import s from './CampaignCards.module.css'

const typeLabels = { kampanya: 'Kampanya', indirim: 'İndirim', firsat: 'Fırsat' }
const typeCls = { kampanya: s.badgeKampanya, indirim: s.badgeIndirim, firsat: s.badgeFirsat }

interface Props {
  campaigns: Campaign[]
  emptyText?: string
}

export default function CampaignCards({ campaigns, emptyText = 'Şu an aktif kampanya bulunmuyor.' }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  if (campaigns.length === 0) {
    return <p className={s.empty}>{emptyText}</p>
  }

  return (
    <div className={s.grid}>
      {campaigns.map((c) => (
        <div key={c.id} className={s.card}>
          <div className={s.cardTop}>
            <span className={`${s.badge} ${typeCls[c.type]}`}>{typeLabels[c.type]}</span>
            <span className={s.discount}>
              {c.discountType === 'percent' ? `%${c.discountValue}` : `₺${c.discountValue}`}
            </span>
          </div>
          <h4>{c.title}</h4>
          <p className={s.desc}>{c.description}</p>
          <p className={s.site}>{c.siteName}</p>
          {c.promoCode && (
            <button type="button" className={s.codeBtn} onClick={() => copyCode(c.promoCode)}>
              <Tag size={14} />
              {c.promoCode}
              {copied === c.promoCode ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
          <div className={s.dates}>
            <Calendar size={12} />
            {c.startDate} — {c.endDate}
          </div>
        </div>
      ))}
    </div>
  )
}
