import { useState } from 'react'
import { Plus, Smartphone, User, Car } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSelect } from '../../components/dashboard/FormField'
import { APP_NAME } from '../../constants/brand'
import { POS_DEVICES, DRIVERS, PLATFORMS } from '../../data/mockTaxiData'
import s from './PosAssignmentPage.module.css'

interface Device {
  id: string
  serial: string
  status: 'assigned' | 'available'
  driver: string | null
  plate: string | null
  platform: string | null
}

export default function PosAssignmentPage() {
  const [devices, setDevices] = useState<Device[]>(POS_DEVICES)
  const [showAssign, setShowAssign] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>('')
  const [form, setForm] = useState({ driver: '', plate: '', platform: 'Uber' })

  const available = devices.filter((d) => d.status === 'available')
  const assigned = devices.filter((d) => d.status === 'assigned')

  const openAssign = (deviceId?: string) => {
    setSelectedDevice(deviceId ?? available[0]?.id ?? '')
    setForm({ driver: DRIVERS[0]?.name ?? '', plate: DRIVERS[0]?.plate ?? '', platform: 'Uber' })
    setShowAssign(true)
  }

  const handleAssign = () => {
    if (!selectedDevice) return
    setDevices(devices.map((d) =>
      d.id === selectedDevice
        ? { ...d, status: 'assigned' as const, driver: form.driver, plate: form.plate, platform: form.platform }
        : d
    ))
    setShowAssign(false)
  }

  const unassign = (id: string) => {
    setDevices(devices.map((d) =>
      d.id === id ? { ...d, status: 'available' as const, driver: null, plate: null, platform: null } : d
    ))
  }

  const onDriverChange = (name: string) => {
    const driver = DRIVERS.find((d) => d.name === name)
    setForm({
      driver: name,
      plate: driver?.plate ?? '',
      platform: PLATFORMS.find((p) => p.id === driver?.platform)?.name ?? 'Uber',
    })
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; POS Cihaz Atama</div>

      <div className={s.stats}>
        <div className={s.stat}><Smartphone size={24} /><div><strong>{devices.length}</strong><span>Toplam Cihaz</span></div></div>
        <div className={s.stat}><User size={24} /><div><strong>{assigned.length}</strong><span>Atanmış</span></div></div>
        <div className={s.stat}><Car size={24} /><div><strong>{available.length}</strong><span>Müsait</span></div></div>
      </div>

      <div className={s.content}>
        <div className={s.header}>
          <h1>POS Cihazları — Sürücü Atama</h1>
          <button className={s.addBtn} onClick={() => openAssign()} disabled={available.length === 0}>
            <Plus size={18} /> Sürücüye Ata
          </button>
        </div>

        <h2 className={s.sectionTitle}>Atanmış Cihazlar</h2>
        <div className={s.deviceGrid}>
          {assigned.map((d) => (
            <div key={d.id} className={s.deviceCard}>
              <div className={s.deviceTop}>
                <Smartphone size={28} />
                <span className={s.assignedBadge}>Atanmış</span>
              </div>
              <p className={s.deviceId}>{d.id}</p>
              <p className={s.serial}>{d.serial}</p>
              <div className={s.deviceInfo}>
                <p><User size={14} /> {d.driver}</p>
                <p><Car size={14} /> {d.plate}</p>
                <p className={s.platformTag}>{d.platform}</p>
              </div>
              <button className={s.unassignBtn} onClick={() => unassign(d.id)}>Atamayı Kaldır</button>
            </div>
          ))}
        </div>

        <h2 className={s.sectionTitle}>Müsait Cihazlar</h2>
        <div className={s.deviceGrid}>
          {available.map((d) => (
            <div key={d.id} className={`${s.deviceCard} ${s.availableCard}`}>
              <div className={s.deviceTop}>
                <Smartphone size={28} color="#888" />
                <span className={s.availableBadge}>Müsait</span>
              </div>
              <p className={s.deviceId}>{d.id}</p>
              <p className={s.serial}>{d.serial}</p>
              <button className={s.assignBtn} onClick={() => openAssign(d.id)}>Sürücüye Ata</button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showAssign} onClose={() => setShowAssign(false)} title="POS Cihazı Ata" subtitle="Cihazı bir sürücüye ve plakaya atayın"
        footer={<button className={s.saveBtn} onClick={handleAssign}>Atamayı Kaydet</button>}>
        <FormSelect label="POS Cihazı" value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
          {available.map((d) => <option key={d.id} value={d.id}>{d.id} — {d.serial}</option>)}
        </FormSelect>
        <FormSelect label="Sürücü" value={form.driver} onChange={(e) => onDriverChange(e.target.value)}>
          {DRIVERS.map((d) => <option key={d.plate} value={d.name}>{d.name}</option>)}
        </FormSelect>
        <FormField label="Plaka" value={form.plate} readOnly />
        <FormSelect label="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
          {PLATFORMS.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </FormSelect>
      </Modal>
    </>
  )
}
