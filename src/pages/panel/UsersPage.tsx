import { useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import Modal from '../../components/dashboard/Modal'
import { FormField, FormSection, FormSelect } from '../../components/dashboard/FormField'
import ConfirmDeleteModal from '../../components/dashboard/ConfirmDeleteModal'
import { APP_NAME, USER_EMAIL, USER_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'

interface User { id: string; name: string; phone: string; email: string; role: string; roleType: 'admin' | 'ops' }

const INITIAL: User[] = [
  { id: '1', name: 'Hüseyin İncekara', phone: '+90 000 000 00 00', email: 'huseyin@fineros.com.tr', role: 'Admin', roleType: 'admin' },
  { id: '2', name: USER_NAME, phone: '+90 552 895 67 07', email: USER_EMAIL, role: 'Operasyon', roleType: 'ops' },
  { id: '3', name: 'Seda Gül Uçar', phone: '+90 555 555 55 55', email: 'sedagul.ucar@fineros.com.tr', role: 'Operasyon', roleType: 'ops' },
]

export default function UsersPage() {
  const [users, setUsers] = useState(INITIAL)
  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)
  const [form, setForm] = useState({ name: 'Ahmet Muhsin', phone: '+90 555 678 90 12', email: '', role: 'Admin' })

  const openEdit = (user: User) => {
    setSelected(user)
    setForm({ name: user.name, phone: user.phone, email: user.email, role: user.role })
    setShowEdit(true)
  }

  const openDelete = (user: User) => { setSelected(user); setShowDelete(true) }

  const handleAdd = () => {
    setUsers([...users, { id: String(Date.now()), name: form.name, phone: form.phone, email: form.email || 'mail@gmail.com', role: form.role, roleType: form.role === 'Admin' ? 'admin' : 'ops' }])
    setShowAdd(false)
  }

  const handleSave = () => {
    if (!selected) return
    setUsers(users.map((u) => u.id === selected.id ? { ...u, ...form, roleType: form.role === 'Admin' ? 'admin' as const : 'ops' as const } : u))
    setShowEdit(false)
  }

  const handleDelete = () => {
    if (!selected) return
    setUsers(users.filter((u) => u.id !== selected.id))
    setShowDelete(false)
  }

  const formFields = (
    <>
      <FormSection title="Genel Bilgiler">
        <FormField label="Adı - Soyadı" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormField label="Telefonu" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <FormField label="E-Posta Adresi" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="mail@gmail.com" />
        <FormSelect label="Görev" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option>Admin</option><option>Operasyon</option>
        </FormSelect>
      </FormSection>
    </>
  )

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Kullanıcı Yönetimi</div>
      <div className={s.content}>
        <div className={s.contentHeader}>
          <div><h1>Kullanıcılar</h1><p className={s.contentSub}>Lorem ipsum dolor sit amet consectetur.</p></div>
          <button className={s.primaryBtn} onClick={() => { setForm({ name: 'Ahmet Muhsin', phone: '+90 555 678 90 12', email: '', role: 'Admin' }); setShowAdd(true) }}><Plus size={18} />Yeni Kullanıcı Ekle</button>
        </div>
        <div className={s.tableWrap}><table className={s.table}>
          <thead><tr><th>Sıra</th><th>Personel Adı</th><th>Telefon Numarası</th><th>Mail Adresi</th><th>Görev</th><th></th></tr></thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.phone}</td>
                <td>{u.email}</td>
                <td><span className={`${s.badge} ${u.roleType === 'admin' ? s.badgeAdmin : s.badgeOps}`}>{u.role}</span></td>
                <td>
                  <button className={`${s.actionLink} ${s.actionEdit}`} onClick={() => openEdit(u)}><Pencil size={14} />Düzenle</button>
                  <button className={`${s.actionLink}`} style={{ color: '#e53935' }} onClick={() => openDelete(u)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Yeni Kullanıcı Ekle" subtitle="Lütfen formu doldurunuz"
        footer={<button className={s.submitFull} onClick={handleAdd}>Ekle</button>}>{formFields}</Modal>

      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Kullanıcıyı Düzenle" subtitle="Lütfen formu doldurunuz"
        footer={<button className={s.submitFull} onClick={handleSave}>Kaydet</button>}>{formFields}</Modal>

      <ConfirmDeleteModal open={showDelete} onClose={() => setShowDelete(false)} confirmLabel="Kullanıcıyı Sil" onConfirm={handleDelete} />
    </>
  )
}
