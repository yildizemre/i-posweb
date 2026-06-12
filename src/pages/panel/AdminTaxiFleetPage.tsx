import { useMemo, useState } from 'react'
import { MapPin, Car, Search, Building2, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import { usePanelData } from '../../context/PanelDataContext'
import { getTripsByPlate, formatMoney } from '../../data/mockTaxiData'
import {
  buildFleetRows, computeCityStats, filterFleetRows, getFleetCities,
} from '../../utils/fleetStats'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import fs from './AdminTaxiFleetPage.module.css'

type ViewMode = 'city' | 'plate'

export default function AdminTaxiFleetPage() {
  const { platformSettings } = usePanelData()
  const allRows = useMemo(() => buildFleetRows(platformSettings), [platformSettings])

  const [view, setView] = useState<ViewMode>('city')
  const [cityFilter, setCityFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedCity, setExpandedCity] = useState<string | null>(null)
  const [selectedPlate, setSelectedPlate] = useState<string | null>(null)

  const filtered = useMemo(
    () => filterFleetRows(allRows, { city: cityFilter, platform: platformFilter, search }),
    [allRows, cityFilter, platformFilter, search],
  )

  const cityStats = useMemo(() => computeCityStats(filtered), [filtered])
  const cities = useMemo(() => getFleetCities(allRows), [allRows])
  const totalCiro = filtered.reduce((sum, r) => sum + r.earnings, 0)
  const totalAdminPay = filtered.reduce((sum, r) => sum + r.adminPay, 0)
  const plateTrips = selectedPlate ? getTripsByPlate(selectedPlate) : []
  const selectedRow = selectedPlate ? filtered.find((r) => r.plate === selectedPlate) : null

  const resetFilters = () => {
    setCityFilter('all')
    setPlatformFilter('all')
    setSearch('')
    setSelectedPlate(null)
    setExpandedCity(null)
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Taksi Filosu & Ciro</div>

      <div className={fs.hero}>
        <div className={fs.heroMain}>
          <p className={fs.heroLabel}>Admin Altındaki Taksi Filosu</p>
          <div className={fs.heroStatsRow}>
            <div><strong>{filtered.length}</strong><span>Aktif Taksi</span></div>
            <div><strong>{formatMoney(totalCiro)}</strong><span>Toplam Ciro</span></div>
            <div><strong>{formatMoney(totalAdminPay)}</strong><span>Admin Hakedişi</span></div>
            <div><strong>{cityStats.length}</strong><span>Şehir</span></div>
          </div>
        </div>
      </div>

      <div className={fs.toolbar}>
        <div className={fs.viewToggle}>
          <button type="button" className={view === 'city' ? fs.viewActive : ''} onClick={() => setView('city')}>
            <Building2 size={16} /> Şehir Şehir
          </button>
          <button type="button" className={view === 'plate' ? fs.viewActive : ''} onClick={() => setView('plate')}>
            <Car size={16} /> Plaka Plaka
          </button>
        </div>

        <div className={fs.filters}>
          <Filter size={16} className={fs.filterIcon} />
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className={fs.select}>
            <option value="all">Tüm Şehirler</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)} className={fs.select}>
            <option value="all">Tüm Platformlar</option>
            {platformSettings.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className={fs.search}>
            <Search size={16} />
            <input
              placeholder="Plaka veya sürücü ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {(cityFilter !== 'all' || platformFilter !== 'all' || search) && (
            <button type="button" className={fs.clearBtn} onClick={resetFilters}>Temizle</button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={s.empty}>
          <Car size={48} color="#8b95a5" style={{ marginBottom: 16 }} />
          <p className={s.emptyTitle}>Filtreye uygun taksi bulunamadı.</p>
          <p className={s.emptySub}>Filtreleri değiştirin veya temizleyin.</p>
        </div>
      ) : view === 'city' ? (
        <div className={fs.cityGrid}>
          {cityStats.map((c) => {
            const open = expandedCity === c.city
            return (
              <div key={c.city} className={fs.cityCard}>
                <button
                  type="button"
                  className={fs.cityHead}
                  onClick={() => setExpandedCity(open ? null : c.city)}
                >
                  <div>
                    <h3><MapPin size={18} /> {c.city}</h3>
                    <span>{c.taxiCount} taksi · {c.tripCount} yolculuk · {c.customers} müşteri</span>
                  </div>
                  <div className={fs.cityRight}>
                    <div>
                      <strong>{formatMoney(c.totalCiro)}</strong>
                      <span>Ciro</span>
                    </div>
                    <div>
                      <strong className={fs.teal}>{formatMoney(c.totalAdminPay)}</strong>
                      <span>Admin payı</span>
                    </div>
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>
                {open && (
                  <div className={fs.plateList}>
                    {c.plates.map((p) => (
                      <button
                        key={p.plate}
                        type="button"
                        className={`${fs.plateRow} ${selectedPlate === p.plate ? fs.plateActive : ''}`}
                        onClick={() => setSelectedPlate(selectedPlate === p.plate ? null : p.plate)}
                      >
                        <div>
                          <strong>{p.plate}</strong>
                          <span>{p.driver} · {p.platformName} · {p.tripCount} yolculuk</span>
                        </div>
                        <div className={fs.plateRight}>
                          <strong>{formatMoney(p.earnings)}</strong>
                          <span>Admin: {formatMoney(p.adminPay)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Şehir</th>
                <th>Plaka</th>
                <th>Sürücü</th>
                <th>Platform</th>
                <th>Yolculuk</th>
                <th>Ciro</th>
                <th>Admin Payı</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.plate}
                  className={selectedPlate === p.plate ? fs.rowActive : ''}
                  onClick={() => setSelectedPlate(selectedPlate === p.plate ? null : p.plate)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{p.city}</td>
                  <td><strong>{p.plate}</strong></td>
                  <td>{p.driver}</td>
                  <td><span className={fs.platformTag}>{p.platformName}</span></td>
                  <td>{p.tripCount}</td>
                  <td><strong>{formatMoney(p.earnings)}</strong></td>
                  <td className={fs.teal}><strong>{formatMoney(p.adminPay)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRow && (
        <div className={fs.detailPanel}>
          <h3>{selectedRow.plate} — {selectedRow.driver}</h3>
          <p className={fs.detailMeta}>
            {selectedRow.city} · {selectedRow.platformName} · {plateTrips.length} yolculuk ·
            Ciro: {formatMoney(selectedRow.earnings)} · Admin: {formatMoney(selectedRow.adminPay)}
          </p>
          <TripList trips={plateTrips} showPlate={false} variant="dark" />
        </div>
      )}
    </>
  )
}
