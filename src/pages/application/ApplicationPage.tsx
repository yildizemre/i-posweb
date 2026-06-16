import { useState } from 'react'
import { Briefcase, User, Check, X } from 'lucide-react'
import Stepper from '../../components/dashboard/Stepper'
import { FormField, FormSection, FormSelect } from '../../components/dashboard/FormField'
import SuccessModal from '../../components/dashboard/SuccessModal'
import { useProfile } from '../../context/ProfileContext'
import { useAccount } from '../../context/AccountContext'
import s from './ApplicationPage.module.css'

type AppType = 'bireysel' | 'kurumsal' | null

function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length <= 1) return { first: parts[0] ?? '', last: '' }
  return { first: parts[0], last: parts.slice(1).join(' ') }
}

export default function ApplicationPage() {
  const { profile } = useProfile()
  const { setType } = useAccount()
  const { first: firstName, last: lastName } = splitFullName(profile.name)
  const [appType, setAppType] = useState<AppType>(null)
  const [step, setStep] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const bireyselSteps = ['Bilgiler', 'Belgeler', 'Sonuç']
  const kurumsalSteps = ['Kimlik', 'Kurumsal Bilgiler', 'Yetkili Bilgiler', 'Evraklar', 'Sonuç']

  const closeModal = () => { setAppType(null); setStep(0); setConfirmed(false) }

  const renderBireyselForm = () => {
    if (step === 0) return (
      <>
        <FormSection title="Genel Bilgiler">
          <FormField label="Adı - Soyadı" defaultValue={profile.name} />
          <FormField label="TCKN" defaultValue="12345678901" />
          <FormField label="Doğum Tarihi" defaultValue="05.10.1990" />
          <FormField label="E-posta" defaultValue={profile.email} />
          <FormField label="Banka IBAN No" defaultValue="TR00 0000 0000 0000 0000 0000 00" />
        </FormSection>
        <FormSection title="Diğer Bilgiler">
          <FormSelect label="Satış Yapılacak Platform"><option>Instagram</option><option>Web Sitesi</option></FormSelect>
          <FormField label="Satış Yapılacak Hesabın URL'si" placeholder="https://" />
        </FormSection>
        <label className={s.checkbox}><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />Bilgilerin doğruluğunu onaylıyorum</label>
      </>
    )
    if (step === 1) return (
      <>
        <Stepper steps={bireyselSteps} current={1} />
        <h3 className={s.docTitle}>Gerekli Belgeler</h3>
        <p className={s.docSub}>Lütfen formu doldurunuz</p>
        {['Kimlik Kartı Ön Yüz', 'Hesap Dekontu - Mobil Bankacılık Ekran Görüntüsü'].map((doc) => (
          <div key={doc} className={s.uploadBox}>
            <span>👆</span>
            <strong>{doc}</strong>
            <span>Sürükle bırak ya da seç</span>
          </div>
        ))}
      </>
    )
    return null
  }

  const renderKurumsalForm = () => {
    if (step === 0) return <FormField label="TCKN - Vergi No." defaultValue="23452734233240" />
    if (step === 1) return (
      <div className={s.grid2}>
        <div className={s.full}><FormField label="Unvan" defaultValue="FİNEROS YAZILIM VE BİLİŞİM HİZMETLERİ A.Ş." /></div>
        <FormField label="İl" defaultValue="İstanbul" />
        <FormField label="İlçe" defaultValue="Kadıköy" />
        <div className={s.full}><FormField label="Adres" defaultValue="Caferağa Mah. Moda Cad. No: 42" /></div>
        <FormField label="Bina No" defaultValue="42" />
        <FormField label="İç Kapı No" defaultValue="3" />
      </div>
    )
    if (step === 2) return (
      <>
        <label className={s.checkbox}><input type="checkbox" />Başvuran kişi ile yetkili kişi aynı ise tıklayınız.</label>
        <div className={s.grid2}>
          <FormField label="Yetkili Adı" defaultValue={firstName} />
          <FormField label="Yetkili Soyadı" defaultValue={lastName} />
          <div className={s.full}><FormField label="Yetkili E-Posta" defaultValue={profile.email} /></div>
          <div className={s.full}><FormField label="Yetkili Cep Numarası" defaultValue={profile.phone} /></div>
          <div className={s.full}><FormField label="Yetkili Kimlik Numarası" defaultValue="12345678901" /></div>
          <FormField label="Yetkili Doğum Tarihi" defaultValue="01.01.2000" />
          <FormSelect label="Meslek"><option>Sanatçı</option><option>Yönetici</option></FormSelect>
        </div>
      </>
    )
    if (step === 3) return (
      <>
        {['Kimlik Kartı Ön Yüz', 'Vergi Levhası', 'İmza Sirküsü', 'Hesap Dekontu - Mobil Bankacılık Ekran Görüntüsü'].map((doc) => (
          <div key={doc} className={s.uploadBox}><span>👆</span><strong>{doc}</strong><span>Sürükle bırak ya da Seç</span></div>
        ))}
      </>
    )
    return null
  }

  const isLastStep = appType === 'bireysel' ? step === 1 : step === 3
  const steps = appType === 'bireysel' ? bireyselSteps : kurumsalSteps

  const handleNext = () => {
    if (isLastStep) { closeModal(); setShowSuccess(true) }
    else setStep(step + 1)
  }

  return (
    <>
      <div className={s.breadcrumb}>Başvuru Yap &gt; Tipi</div>
      <div className={s.cards}>
        <div className={s.card}>
          <Briefcase size={32} color="var(--teal)" />
          <h2>İşim İçin POS</h2>
          <p className={s.desc}>Kurumsal hesabınız için ödeme altyapısı.</p>
          <ul>{['Ödeme linki oluştur', 'Linklerinizi takip et', 'Raporlara ulaş', '7/24 Destek al', 'Ertesi gün ödeme'].map((f) => (
            <li key={f}><Check size={14} color="var(--teal)" />{f}</li>
          ))}</ul>
          <button type="button" className={s.btnTeal} onClick={() => { setType('kurumsal'); setAppType('kurumsal'); setStep(0) }}>Kurumsal Başvuru</button>
        </div>
        <div className={s.card}>
          <User size={32} color="#2e9e6a" />
          <h2>Bireysel POS</h2>
          <p className={s.desc}>Bireysel satışlarınız için ödeme çözümü.</p>
          <ul>{['Ödeme linki oluştur', 'Kolay takip', 'Hızlı ödeme'].map((f) => (
            <li key={f}><Check size={14} color="#2e9e6a" />{f}</li>
          ))}</ul>
          <button type="button" className={s.btnGreen} onClick={() => { setType('bireysel'); setAppType('bireysel'); setStep(0) }}>Bireysel Başvuru</button>
        </div>
      </div>

      {appType && (
        <div className={s.overlay} onClick={closeModal}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <div>
                <h2>{appType === 'bireysel' ? 'Bireysel Başvuru' : 'Kurumsal Başvuru'}</h2>
                <p>Lütfen formu doldurunuz</p>
              </div>
              <button onClick={closeModal}><X size={20} color="#e53935" /></button>
            </div>
            {appType === 'kurumsal' && step < 4 && <Stepper steps={steps} current={step} />}
            <div className={s.modalBody}>
              {appType === 'bireysel' ? renderBireyselForm() : renderKurumsalForm()}
            </div>
            <button className={s.submitBtn} onClick={handleNext} disabled={appType === 'bireysel' && step === 0 && !confirmed}>
              {isLastStep ? (appType === 'bireysel' ? 'Devam Et' : 'Devam Et') : 'Devam Et'}
            </button>
          </div>
        </div>
      )}

      <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)}
        title="Tebrikler Başvurunuz Alınmıştır! Şimdi Sıra Bizde."
        body="Verdiğiniz bilgileri kontrol edip, size en kısa sürede e-posta ile bilgi vereceğiz."
        buttonLabel="Tamam" />
    </>
  )
}
