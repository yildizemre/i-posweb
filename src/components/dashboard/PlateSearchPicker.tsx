import { useMemo, useState } from 'react'
import { Search, Car, X } from 'lucide-react'
import { PlatePickerItem, filterPlatesByQuery } from '../../utils/platePicker'
import ps from './PlateSearchPicker.module.css'

type Props = {
  plates: PlatePickerItem[]
  selectedPlate: string | null
  onSelect: (plate: string) => void
  label?: string
  hint?: string
}

export default function PlateSearchPicker({
  plates,
  selectedPlate,
  onSelect,
  label = 'Plaka Seç',
  hint,
}: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterPlatesByQuery(plates, query),
    [plates, query],
  )

  const selected = plates.find((p) => p.plate === selectedPlate)

  return (
    <div className={ps.wrap}>
      <div className={ps.head}>
        <label>{label}</label>
        <span className={ps.count}>
          {query ? `${filtered.length} / ${plates.length}` : `${plates.length} plaka`}
        </span>
      </div>

      {hint && <p className={ps.count} style={{ margin: '-4px 0 8px' }}>{hint}</p>}

      <div className={ps.searchRow}>
        <Search size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Plaka ara... (ör. 34 ABC, Ahmet, İstanbul)"
          aria-label="Plaka ara"
        />
        {query && (
          <button
            type="button"
            className={ps.clearSearch}
            onClick={() => setQuery('')}
            aria-label="Aramayı temizle"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {selected && (
        <div className={ps.selectedChip}>
          <Car size={14} />
          {selected.plate}
        </div>
      )}

      <div className={ps.list} role="listbox" aria-label="Plaka listesi">
        {filtered.length === 0 ? (
          <div className={ps.empty}>Aramanızla eşleşen plaka bulunamadı.</div>
        ) : (
          filtered.map((item) => (
            <button
              key={item.plate}
              type="button"
              role="option"
              aria-selected={selectedPlate === item.plate}
              className={`${ps.item} ${selectedPlate === item.plate ? ps.itemActive : ''}`}
              onClick={() => onSelect(item.plate)}
            >
              <div>
                <span className={ps.itemPlate}>{item.plate}</span>
                {(item.driver || item.city || item.platformName) && (
                  <span className={ps.itemMeta}>
                    {[item.driver, item.city, item.platformName].filter(Boolean).join(' · ')}
                  </span>
                )}
              </div>
              <Car size={16} className={ps.itemIcon} />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
