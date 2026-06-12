import { MapPin, Clock, Navigation } from 'lucide-react'
import { Trip, PAYMENT_LABELS, PLATFORMS, formatMoney } from '../../data/mockTaxiData'
import s from './TripList.module.css'

interface Props {
  trips: Trip[]
  showPlatform?: boolean
  showPlate?: boolean
  emptyText?: string
  variant?: 'light' | 'dark'
  hideAmounts?: boolean
}

export default function TripList({ trips, showPlatform = false, showPlate = true, emptyText = 'Yolculuk bulunamadı.', variant = 'light', hideAmounts = false }: Props) {
  if (trips.length === 0) {
    return <p className={s.empty}>{emptyText}</p>
  }

  return (
    <div className={s.list}>
      {trips.map((trip) => (
        <div key={trip.id} className={`${s.trip} ${variant === 'dark' ? s.tripDark : ''}`}>
          <div className={s.tripTop}>
            <div>
              <strong className={s.customer}>{trip.customer}</strong>
              <span className={s.meta}>{trip.driver}{showPlate && ` · ${trip.plate}`}</span>
            </div>
            <div className={s.tripRight}>
              {!hideAmounts && <strong>{formatMoney(trip.amount)}</strong>}
              <span className={`${s.payBadge} ${s[trip.payment]}`}>{PAYMENT_LABELS[trip.payment]}</span>
            </div>
          </div>
          <div className={s.route}>
            <div className={s.routePoint}>
              <MapPin size={14} className={s.fromIcon} />
              <span>{trip.from}</span>
            </div>
            <div className={s.routeArrow}>↓</div>
            <div className={s.routePoint}>
              <MapPin size={14} className={s.toIcon} />
              <span>{trip.to}</span>
            </div>
          </div>
          <div className={s.tripFooter}>
            <span><Clock size={12} /> {trip.date}</span>
            <span><Navigation size={12} /> {trip.distance} · {trip.duration}</span>
            {showPlatform && (
              <span className={s.platformTag}>{PLATFORMS.find((p) => p.id === trip.platform)?.name}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
