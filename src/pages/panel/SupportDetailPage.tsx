import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Paperclip, Send, X, Download } from 'lucide-react'
import { APP_NAME } from '../../constants/brand'
import s from './SupportDetailPage.module.css'

const MESSAGES = [
  { from: 'user', text: 'Merhaba', time: '16 Nisan 2024 - 14:45' },
  { from: 'user', file: 'dosya_adi.pdf', time: '16 Nisan 2024 - 14:46' },
  { from: 'support', name: 'Zeynep A.', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.', time: '16 Nisan 2024 - 15:30' },
]

export default function SupportDetailPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('')

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Yardım ve Destek &gt; Talep Detayları</div>
      <div className={s.content}>
        <div className={s.header}>
          <button className={s.back} onClick={() => navigate('/panel/destek')}><ArrowLeft size={18} /></button>
          <h1>Param 5 Gündür Hesabıma Geçmiyor... 😡</h1>
          <button className={s.endBtn}><X size={14} />Talebi Sonlandır</button>
        </div>

        <div className={s.chat}>
          {MESSAGES.map((m, i) => (
            m.from === 'user' ? (
              <div key={i} className={s.userMsg}>
                {m.file ? (
                  <div className={s.fileBubble}><Download size={16} />{m.file}</div>
                ) : (
                  <div className={s.bubble}>{m.text}</div>
                )}
                <span className={s.time}>Siz · {m.time}</span>
              </div>
            ) : (
              <div key={i} className={s.supportMsg}>
                <span className={s.sender}>{m.name}</span>
                <div className={s.supportBubble}>{m.text}</div>
                <span className={s.time}>{m.time}</span>
              </div>
            )
          ))}
        </div>

        <div className={s.inputArea}>
          <button className={s.attach}><Paperclip size={18} /></button>
          <input placeholder="Yaz..." value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className={s.send}><Send size={16} />Gönder</button>
        </div>
      </div>
    </>
  )
}
