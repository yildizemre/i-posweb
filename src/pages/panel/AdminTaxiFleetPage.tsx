import { useMemo, useState } from 'react'
import { MapPin, Car, Search, Building2, Filter, ChevronDown, ChevronUp, CreditCard, Landmark, Calendar } from 'lucide-react'
import TripList from '../../components/dashboard/TripList'
import { usePanelData } from '../../context/PanelDataContext'
import { getTripsByPlate, formatMoney, BANK_AGREEMENTS } from '../../data/mockTaxiData'
import {
  buildFleetRows, computeCityStats, filterFleetRows, getFleetCities,
} from '../../utils/fleetStats'
import {
  filterTripsByDateRange, getTripDateBounds, getUniqueTripDates, tripLabelToInputDate,
} from '../../utils/tripFilters'
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
  const [tripDateFrom, setTripDateFrom] = useState('')
  const [tripDateTo, setTripDateTo] = useState('')

  const selectPlate = (plate: string) => {
    setSelectedPlate((prev) => {
      const next = prev === plate ? null : plate
      if (next !== prev) {
        setTripDateFrom('')
        setTripDateTo('')
      }
      return next
    })
  }

  const clearTripDateFilter = () => {
    setTripDateFrom('')
    setTripDateTo('')
  }

  const setQuickDate = (label: string) => {
    const iso = tripLabelToInputDate(label)
    setTripDateFrom(iso)
    setTripDateTo(iso)
  }

  const filtered = useMemo(
    () => filterFleetRows(allRows, { city: cityFilter, platform: platformFilter, search }),
    [allRows, cityFilter, platformFilter, search],
  )

  const cityStats = useMemo(() => computeCityStats(filtered), [filtered])
  const cities = useMemo(() => getFleetCities(allRows), [allRows])
  const totalCiro = filtered.reduce((sum, r) => sum + r.earnings, 0)
  const totalAdminPay = filtered.reduce((sum, r) => sum + r.adminPay, 0)
  const totalPosSpread = filtered.reduce((sum, r) => sum + r.posSpreadEarned, 0)
  const assignedPosCount = filtered.filter((r) => r.posId).length
  const plateTrips = useMemo(
    () => (selectedPlate ? getTripsByPlate(selectedPlate) : []),
    [selectedPlate],
  )
  const filteredPlateTrips = useMemo(
    () => filterTripsByDateRange(plateTrips, tripDateFrom, tripDateTo),
    [plateTrips, tripDateFrom, tripDateTo],
  )
  const tripDateBounds = useMemo(() => getTripDateBounds(plateTrips), [plateTrips])
  const availableTripDates = useMemo(() => getUniqueTripDates(plateTrips), [plateTrips])
  const hasTripDateFilter = !!(tripDateFrom || tripDateTo)
  const filteredTripTotal = filteredPlateTrips.reduce((sum, t) => sum + t.amount, 0)
  const selectedRow = selectedPlate ? filtered.find((r) => r.plate === selectedPlate) : null

  const resetFilters = () => {
    setCityFilter('all')
    setPlatformFilter('all')
    setSearch('')
    setSelectedPlate(null)
    setTripDateFrom('')
    setTripDateTo('')
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
            <div><strong>{assignedPosCount}/{filtered.length}</strong><span>Banka POS Atanmış</span></div>
          </div>
        </div>
      </div>

      <div className={fs.bankSection}>
        <div className={fs.bankSectionHead}>
          <h3><Landmark size={18} /> Banka POS Anlaşmaları</h3>
          <p>Bankadan aldığımız oran ile sürücüye verdiğimiz oran — aradaki fark {APP_NAME} marjı</p>
        </div>
        <div className={fs.bankGrid}>
          {BANK_AGREEMENTS.map((b) => (
            <div key={b.id} className={fs.bankCard}>
              <div className={fs.bankCardTop}>
                <strong>{b.bankName}</strong>
                <span className={fs.bankModel}>{b.posModel}</span>
              </div>
              <div className={fs.bankRates}>
                <div>
                  <span>Bankadan aldık</span>
                  <strong className={fs.bankIn}>%{b.bankRate.toFixed(1)}</strong>
                </div>
                <div className={fs.rateArrow}>→</div>
                <div>
                  <span>Sürücüye verdik</span>
                  <strong className={fs.bankOut}>%{b.defaultDriverRate.toFixed(1)}</strong>
                </div>
                <div>
                  <span>Marjımız</span>
                  <strong className={fs.teal}>+%{(b.defaultDriverRate - b.bankRate).toFixed(1)}</strong>
                </div>
              </div>
              <p className={fs.bankNote}>{b.note}</p>
              <div className={fs.bankMeta}>
                <span>{b.activePosCount} aktif POS</span>
                <span>Sözleşme: {b.contractDate}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={fs.posSummary}>
          <CreditCard size={16} />
          <span>
            Filtrelenen filoda <strong>{assignedPosCount}</strong> taksiciye banka POS verildi.
            Kart cirosu üzerinden toplam POS marjı: <strong className={fs.teal}>{formatMoney(totalPosSpread)}</strong>
          </span>
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
              placeholder="Plaka, sahip veya sürücü ara..."
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
                        onClick={() => selectPlate(p.plate)}
                      >
                        <div>
                          <strong>{p.plate}</strong>
                          <span>
                            Sahip: <strong className={fs.ownerTag}>{p.owner}</strong> · Sürücü: {p.driver} · {p.platformName} · {p.tripCount} yolculuk
                            {p.bankName && <> · <span className={fs.bankTag}>{p.bankName} POS</span></>}
                          </span>
                        </div>
                        <div className={fs.plateRight}>
                          <strong>{formatMoney(p.earnings)}</strong>
                          <span>
                            Admin: {formatMoney(p.adminPay)}
                            {p.spreadRate != null && <> · POS marj: %{p.spreadRate}</>}
                          </span>
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
                <th>Taksi Sahibi</th>
                <th>Sürücü</th>
                <th>Platform</th>
                <th>Banka POS</th>
                <th>Banka Oranı</th>
                <th>Sürücü Oranı</th>
                <th>Marj</th>
                <th>Yolculuk</th>
                <th>Ciro</th>
                <th>POS Marjı</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.plate}
                  className={selectedPlate === p.plate ? fs.rowActive : ''}
                  onClick={() => selectPlate(p.plate)}
                  style={{ cursor: 'pointer' }}
                >
                  <td><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{p.city}</td>
                  <td><strong>{p.plate}</strong></td>
                  <td><span className={fs.ownerTag}>{p.owner}</span></td>
                  <td>{p.driver}</td>
                  <td><span className={fs.platformTag}>{p.platformName}</span></td>
                  <td>
                    {p.bankName
                      ? <span className={fs.bankTag}>{p.bankName}<br /><small>{p.posId}</small></span>
                      : <span className={fs.noPos}>Atanmadı</span>}
                  </td>
                  <td>{p.bankRate != null ? `%${p.bankRate.toFixed(1)}` : '—'}</td>
                  <td>{p.driverRate != null ? `%${p.driverRate.toFixed(1)}` : '—'}</td>
                  <td className={fs.teal}>{p.spreadRate != null ? `+%${p.spreadRate.toFixed(1)}` : '—'}</td>
                  <td>{p.tripCount}</td>
                  <td><strong>{formatMoney(p.earnings)}</strong></td>
                  <td className={fs.teal}><strong>{p.posSpreadEarned > 0 ? formatMoney(p.posSpreadEarned) : '—'}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRow && (
        <div className={fs.detailPanel}>
          <h3>{selectedRow.plate} — Sahip {selectedRow.owner} · Sürücü {selectedRow.driver}</h3>
          <p className={fs.detailMeta}>
            {selectedRow.city} · {selectedRow.platformName} ·{' '}
            {hasTripDateFilter
              ? <>{filteredPlateTrips.length} / {plateTrips.length} yolculuk (filtrelenmiş)</>
              : <>{plateTrips.length} yolculuk</>}
            {' · '}
            Ciro: {formatMoney(selectedRow.earnings)}
            {hasTripDateFilter && <> · Filtre ciro: <strong>{formatMoney(filteredTripTotal)}</strong></>}
            {' · '}Admin: {formatMoney(selectedRow.adminPay)}
          </p>

          {selectedRow.posId ? (
            <div className={fs.posDetail}>
              <h4><CreditCard size={16} /> Banka POS Bilgisi</h4>
              <div className={fs.posDetailGrid}>
                <div><span>POS Cihazı</span><strong>{selectedRow.posId}</strong><small>{selectedRow.posSerial}</small></div>
                <div><span>Banka</span><strong>{selectedRow.bankName}</strong><small>Atama: {selectedRow.posAssignedAt}</small></div>
                <div><span>Bankadan Aldık</span><strong className={fs.bankIn}>%{selectedRow.bankRate?.toFixed(1)}</strong></div>
                <div><span>Sürücüye Verdik</span><strong className={fs.bankOut}>%{selectedRow.driverRate?.toFixed(1)}</strong></div>
                <div><span>Marjımız</span><strong className={fs.teal}>+%{selectedRow.spreadRate?.toFixed(1)}</strong></div>
                <div><span>Kart Cirosu</span><strong>{formatMoney(selectedRow.cardVolume)}</strong></div>
                <div><span>POS Marj Kazancı</span><strong className={fs.teal}>{formatMoney(selectedRow.posSpreadEarned)}</strong></div>
              </div>
              <p className={fs.posExplain}>
                {selectedRow.bankName} ile anlaşmamız: bankadan <strong>%{selectedRow.bankRate?.toFixed(1)}</strong> alıyoruz,
                bu sürücüye <strong>%{selectedRow.driverRate?.toFixed(1)}</strong> uyguladık.
                Kart işlemlerinden <strong>{formatMoney(selectedRow.posSpreadEarned)}</strong> marj elde ettik.
              </p>
            </div>
          ) : (
            <div className={fs.noPosBox}>
              <CreditCard size={20} />
              <p>Bu taksiciye henüz banka POS atanmamış.</p>
            </div>
          )}

          <div className={fs.tripFilterSection}>
            <div className={fs.tripFilterHead}>
              <h4><Calendar size={16} /> Yolculuk Tarih Filtresi</h4>
              {hasTripDateFilter && (
                <button type="button" className={fs.clearBtn} onClick={clearTripDateFilter}>
                  Tarihi Temizle
                </button>
              )}
            </div>
            <div className={fs.tripFilterRow}>
              <label className={fs.dateField}>
                <span>Başlangıç</span>
                <input
                  type="date"
                  value={tripDateFrom}
                  min={tripDateBounds.min}
                  max={tripDateBounds.max}
                  onChange={(e) => setTripDateFrom(e.target.value)}
                />
              </label>
              <label className={fs.dateField}>
                <span>Bitiş</span>
                <input
                  type="date"
                  value={tripDateTo}
                  min={tripDateFrom || tripDateBounds.min}
                  max={tripDateBounds.max}
                  onChange={(e) => setTripDateTo(e.target.value)}
                />
              </label>
              <div className={fs.tripFilterResult}>
                <strong>{filteredPlateTrips.length}</strong>
                <span>yolculuk listeleniyor</span>
              </div>
            </div>
            {availableTripDates.length > 0 && (
              <div className={fs.quickDates}>
                <span>Hızlı seçim:</span>
                {availableTripDates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={fs.quickDateBtn}
                    onClick={() => setQuickDate(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <TripList
            trips={filteredPlateTrips}
            showPlate={false}
            emptyText={hasTripDateFilter ? 'Seçilen tarih aralığında yolculuk bulunamadı.' : 'Yolculuk bulunamadı.'}
          />
        </div>
      )}
    </>
  )
}
