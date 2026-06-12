import { Tag, Calendar, Copy, Check, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Campaign } from '../../context/PanelDataContext'
import { usePanelData } from '../../context/PanelDataContext'
import {
  CATEGORY_LABELS, getDiscountedPrice, getMarginPerSale, getTotalCampaignEarnings, formatTry,
  getPayoutWalletLabel,
} from '../../utils/campaignEconomics'
import s from './CampaignCards.module.css'

const typeLabels = { kampanya: 'Kampanya', indirim: 'İndirim', firsat: 'Fırsat' }
const typeCls = { kampanya: s.badgeKampanya, indirim: s.badgeIndirim, firsat: s.badgeFirsat }
const categoryCls: Record<string, string> = {
  sigorta: s.badgeSigorta,
  lastik: s.badgeLastik,
  yag: s.badgeYag,
  'oto-yikama': s.badgeYikama,
  genel: s.badgeGenel,
}

interface Props {
  campaigns: Campaign[]
  emptyText?: string
  showEarnings?: boolean
  onSelect?: (campaign: Campaign) => void
}

export default function CampaignCards({ campaigns, emptyText = 'Şu an aktif kampanya bulunmuyor.', showEarnings = false, onSelect }: Props) {
  const { wallets } = usePanelData()
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  if (campaigns.length === 0) {
    return <p className={s.empty}>{emptyText}</p>
  }

  return (
    <div className={s.grid}>
      {campaigns.map((c) => {
        const discounted = getDiscountedPrice(c)
        const margin = getMarginPerSale(c)
        const earned = getTotalCampaignEarnings(c)
        const clickable = !!onSelect

        return (
          <div
            key={c.id}
            className={`${s.card} ${clickable ? s.clickable : ''}`}
            onClick={clickable ? () => onSelect!(c) : undefined}
            onKeyDown={clickable ? (e) => e.key === 'Enter' && onSelect!(c) : undefined}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
          >
            <div className={s.cardTop}>
              <div className={s.badges}>
                <span className={`${s.badge} ${categoryCls[c.category] ?? s.badgeGenel}`}>
                  {CATEGORY_LABELS[c.category]}
                </span>
                <span className={`${s.badge} ${typeCls[c.type]}`}>{typeLabels[c.type]}</span>
              </div>
              <span className={s.discount}>
                {c.discountType === 'percent' ? `%${c.discountValue}` : `₺${c.discountValue}`}
              </span>
            </div>
            <h4>{c.title}</h4>
            <p className={s.desc}>{c.description}</p>
            {c.originalPrice > 0 && (
              <p className={s.priceFlow}>
                Liste: {formatTry(c.originalPrice)} → İndirimli: {formatTry(discounted)} → Satış: <strong>{formatTry(c.salePrice)}</strong>
              </p>
            )}
            {showEarnings && margin > 0 && (
              <p className={s.earnLine}>
                <TrendingUp size={14} />
                Satış başına {formatTry(margin)} · Toplam {formatTry(earned)} ({c.redemptionCount} kullanım)
              </p>
            )}
            {showEarnings && c.payoutWalletId && (
              <p className={s.walletLine}>
                <Wallet size={14} />
                {formatTry(earned)} → <code>{c.payoutWalletId}</code>
                <span>{getPayoutWalletLabel(c.payoutWalletId, wallets).split(' — ')[1] ?? ''}</span>
              </p>
            )}
            <p className={s.site}>{c.siteName}</p>
            {c.promoCode && (
              <button type="button" className={s.codeBtn} onClick={(e) => copyCode(c.promoCode, e)}>
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
        )
      })}
    </div>
  )
}
