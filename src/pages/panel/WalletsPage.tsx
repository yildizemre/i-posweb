import { useState } from 'react'
import { Plus, Wallet, User, Car, Search, Trash2, Snowflake, CheckCircle } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormSelect } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { useAuth } from '../../context/AuthContext'
import { usePanelData, DriverWallet } from '../../context/PanelDataContext'
import { formatMoney } from '../../data/mockTaxiData'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import ws from './WalletsPage.module.css'

const statusMap = {
  active: { label: 'Aktif', cls: s.badgeGreen },
  frozen: { label: 'Dondurulmuş', cls: s.badgeBlue },
  closed: { label: 'Kapalı', cls: s.badgeRed },
}

export default function WalletsPage() {
  const { hideFinancials } = useAuth()
  const { wallets, addWallet, deleteWallet, updateWallet, driversWithoutWallet } = usePanelData()
  const money = (n: number) => hideFinancials ? '—' : formatMoney(n)
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selected, setSelected] = useState<DriverWallet | null>(null)
  const [driverIdx, setDriverIdx] = useState('0')

  const filtered = wallets.filter((w) =>
    w.driver.toLowerCase().includes(search.toLowerCase()) ||
    w.plate.toLowerCase().includes(search.toLowerCase()) ||
    w.walletId.toLowerCase().includes(search.toLowerCase())
  )

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)
  const activeCount = wallets.filter((w) => w.status === 'active').length

  const handleCreate = () => {
    const d = driversWithoutWallet[Number(driverIdx)]
    if (!d) return
    addWallet(d.name, d.plate, d.platform)
    setShowAdd(false)
    setShowSuccess(true)
  }

  const toggleFreeze = (w: DriverWallet) => {
    updateWallet(w.id, { status: w.status === 'frozen' ? 'active' : 'frozen' })
  }

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Cüzdanlar</div>

      <div className={ws.stats}>
        <div className={ws.stat}><Wallet size={24} /><div><strong>{wallets.length}</strong><span>Toplam Cüzdan</span></div></div>
        <div className={ws.stat}><CheckCircle size={24} /><div><strong>{activeCount}</strong><span>Aktif</span></div></div>
        <div className={ws.stat}><User size={24} /><div><strong>{driversWithoutWallet.length}</strong><span>Cüzdansız Sürücü</span></div></div>
        {!hideFinancials && (
          <div className={ws.stat}><Wallet size={24} /><div><strong>{formatMoney(totalBalance)}</strong><span>Toplam Bakiye</span></div></div>
        )}
      </div>

      <div className={s.content}>
        <div className={s.contentHeader}>
          <div>
            <h1>Sürücü Cüzdanları</h1>
            <p className={s.contentSub}>Her taksici için ayrı cüzdan — ID, sürücü ve plaka bağlantısı</p>
          </div>
          <button
            className={s.primaryBtn}
            onClick={() => setShowAdd(true)}
            disabled={driversWithoutWallet.length === 0}
            type="button"
          >
            <Plus size={18} />Cüzdan Aç
          </button>
        </div>

        {driversWithoutWallet.length > 0 && (
          <div className={ws.alert}>
            <strong>{driversWithoutWallet.length} sürücünün cüzdanı yok:</strong>{' '}
            {driversWithoutWallet.map((d) => `${d.name} (${d.plate})`).join(', ')}
          </div>
        )}

        <div className={s.toolbar}>
          <div className={s.search}>
            <Search size={18} color="#8b95a5" />
            <input placeholder="Cüzdan ID, sürücü veya plaka ara..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {wallets.length === 0 ? (
          <div className={s.empty}>
            <Wallet size={48} color="#8b95a5" style={{ marginBottom: 16 }} />
            <p className={s.emptyTitle}>Henüz cüzdan açılmadı.</p>
            <p className={s.emptySub}>Cüzdan Aç butonuyla sürücülere cüzdan tanımlayın.</p>
          </div>
        ) : (
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cüzdan ID</th>
                  <th>Sürücü</th>
                  <th>Plaka</th>
                  <th>Platform</th>
                  {!hideFinancials && <th>Bakiye</th>}
                  <th>Açılış</th>
                  <th>Durum</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w, i) => (
                  <tr key={w.id}>
                    <td>{i + 1}</td>
                    <td><code className={ws.walletId}>{w.walletId}</code></td>
                    <td><User size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{w.driver}</td>
                    <td><Car size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{w.plate}</td>
                    <td><span className={ws.platformTag}>{w.platform}</span></td>
                    {!hideFinancials && <td><strong>{money(w.balance)}</strong></td>}
                    <td>{w.createdAt}</td>
                    <td><span className={`${s.badge} ${statusMap[w.status].cls}`}>{statusMap[w.status].label}</span></td>
                    <td>
                      <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => toggleFreeze(w)} type="button">
                        <Snowflake size={14} />{w.status === 'frozen' ? 'Aktifleştir' : 'Dondur'}
                      </button>
                      <button className={`${s.actionLink} ${s.actionDelete}`} onClick={() => { setSelected(w); setShowDelete(true) }} type="button">
                        <Trash2 size={14} />Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className={ws.cardGrid}>
          {filtered.map((w) => (
            <div key={w.id} className={ws.walletCard}>
              <div className={ws.cardTop}>
                <Wallet size={28} />
                <span className={`${s.badge} ${statusMap[w.status].cls}`}>{statusMap[w.status].label}</span>
              </div>
              <p className={ws.cardId}>{w.walletId}</p>
              <p className={ws.cardDriver}>{w.driver}</p>
              <p className={ws.cardPlate}>{w.plate} · {w.platform}</p>
              {!hideFinancials && <p className={ws.cardBalance}>{money(w.balance)}</p>}
            </div>
          ))}
        </div>
      </div>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Yeni Cüzdan Aç"
        subtitle="Cüzdansız bir sürücü seçin — her sürücüye tek cüzdan"
        footer={<button className={s.submitFull} onClick={handleCreate} type="button">Cüzdanı Aç</button>}
      >
        {driversWithoutWallet.length === 0 ? (
          <p>Tüm sürücülerin cüzdanı mevcut.</p>
        ) : (
          <FormSelect label="Sürücü" value={driverIdx} onChange={(e) => setDriverIdx(e.target.value)}>
            {driversWithoutWallet.map((d, i) => (
              <option key={d.plate} value={i}>{d.name} — {d.plate} ({d.platform})</option>
            ))}
          </FormSelect>
        )}
      </Modal>

      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title={`${selected?.walletId} cüzdanını silmek istiyor musunuz?`}
        confirmLabel="Cüzdanı Sil"
        onConfirm={() => { if (selected) deleteWallet(selected.id); setShowDelete(false) }}
      />

      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Cüzdan açıldı"
        body="Sürücü cüzdanı başarıyla oluşturuldu ve listeye eklendi."
      />
    </>
  )
}
