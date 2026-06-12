import { useMemo } from 'react'
import {
  TrendingUp, Car, User, Wallet, Tag, ArrowRightLeft, Layers,
} from 'lucide-react'
import { usePanelData } from '../../context/PanelDataContext'
import { formatMoney, WALLET_PAYOUT_COMMISSION_RATE } from '../../data/mockTaxiData'
import { buildAdminEarningsReport } from '../../utils/adminEarningsReport'
import { APP_NAME } from '../../constants/brand'
import s from '../../components/dashboard/panel.module.css'
import es from './AdminEarningsPage.module.css'

export default function AdminEarningsPage() {
  const { platformSettings, campaigns, wallets } = usePanelData()

  const report = useMemo(
    () => buildAdminEarningsReport(platformSettings, campaigns, wallets),
    [platformSettings, campaigns, wallets],
  )

  return (
    <>
      <div className={s.breadcrumb}>{APP_NAME} &gt; Kazanç Özeti</div>

      <div className={es.hero}>
        <p className={es.heroLabel}>Admin Toplam Kazanç Özeti</p>
        <p className={es.heroTotal}>{formatMoney(report.grandTotal)}</p>
        <div className={es.heroGrid}>
          <div>
            <strong>{formatMoney(report.platformTotal)}</strong>
            <span>Platform Hakedişi (%1)</span>
          </div>
          <div>
            <strong>{formatMoney(report.campaignTotal)}</strong>
            <span>Kampanya Karı</span>
          </div>
          <div>
            <strong>{formatMoney(report.transferCommissionTotal)}</strong>
            <span>Cüzdan Transfer Komisyonu</span>
          </div>
          <div>
            <strong>{report.drivers.length}</strong>
            <span>Aktif Sürücü</span>
          </div>
        </div>
      </div>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <Layers size={18} />
          <div>
            <h2>Platformlardan Kazanç</h2>
            <p>Uber, Yandex, 7/24, BiTaksi — ciro üzerinden admin hakedişi</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Taksi</th>
                <th>Yolculuk</th>
                <th>Ciro</th>
                <th>Platform Kom. (%)</th>
                <th>Admin Hakediş (%)</th>
                <th>Admin Kazancı</th>
              </tr>
            </thead>
            <tbody>
              {report.platforms.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className={es.platformDot} style={{ background: p.color }} />
                    {p.name}
                  </td>
                  <td>{p.plateCount}</td>
                  <td>{p.tripCount}</td>
                  <td>{formatMoney(p.totalVolume)}</td>
                  <td>%{p.platformCommissionRate}</td>
                  <td>%{p.adminCommissionRate}</td>
                  <td className={es.teal}>{formatMoney(p.adminEarnings)}</td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={6}>Toplam Platform Kazancı</td>
                <td className={es.teal}>{formatMoney(report.platformTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <Car size={18} />
          <div>
            <h2>Plakadan Kazanç</h2>
            <p>Her araç plakası için ciro ve admin hakedişi</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Plaka</th>
                <th>Sürücü</th>
                <th>Şehir</th>
                <th>Platform</th>
                <th>Ciro</th>
                <th>Admin Kazancı</th>
              </tr>
            </thead>
            <tbody>
              {report.plates.map((p) => (
                <tr key={p.plate}>
                  <td><strong>{p.plate}</strong></td>
                  <td>{p.driver}</td>
                  <td>{p.city}</td>
                  <td>{p.platformName}</td>
                  <td>{formatMoney(p.earnings)}</td>
                  <td className={es.teal}>{formatMoney(p.adminPay)}</td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={5}>Toplam Plaka Kazancı</td>
                <td className={es.teal}>{formatMoney(report.platformTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <User size={18} />
          <div>
            <h2>Sürücüden Kazanç</h2>
            <p>Örn. 34 MNO 345 plakasında 3 sürücü — her birinden ayrı kazanç</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Sürücü</th>
                <th>Plaka</th>
                <th>Şehir</th>
                <th>Platform</th>
                <th>Cüzdan</th>
                <th>Ciro</th>
                <th>Admin Kazancı</th>
              </tr>
            </thead>
            <tbody>
              {report.drivers.map((d) => (
                <tr key={`${d.plate}-${d.driver}`}>
                  <td><strong>{d.driver}</strong></td>
                  <td>{d.plate}</td>
                  <td>{d.city}</td>
                  <td>{d.platformName}</td>
                  <td><span className={es.badge}>{d.walletId ?? '—'}</span></td>
                  <td>{formatMoney(d.ciro)}</td>
                  <td className={es.teal}>{formatMoney(d.adminPay)}</td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={6}>Toplam Sürücü Kazancı</td>
                <td className={es.teal}>{formatMoney(report.drivers.reduce((s, d) => s + d.adminPay, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <Wallet size={18} />
          <div>
            <h2>Cüzdandan Kazanç</h2>
            <p>Platform hakedişi + transfer komisyonu + kampanya geliri — cüzdan bazında</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Cüzdan ID</th>
                <th>Sahip</th>
                <th>Plaka</th>
                <th>Platform Payı</th>
                <th>Transfer Kom.</th>
                <th>Kampanya Payı</th>
                <th>Toplam Kazanç</th>
              </tr>
            </thead>
            <tbody>
              {report.wallets.filter((w) => w.total > 0).map((w) => (
                <tr key={w.walletId}>
                  <td><span className={es.badge}>{w.walletId}</span></td>
                  <td>{w.driver !== '—' ? w.driver : w.label}</td>
                  <td>{w.plate}</td>
                  <td>{formatMoney(w.platformPay)}</td>
                  <td className={es.yellow}>{formatMoney(w.transferCommission)}</td>
                  <td className={es.purple}>{formatMoney(w.campaignPay)}</td>
                  <td className={es.teal}><strong>{formatMoney(w.total)}</strong></td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={6}>Toplam Cüzdan Kazancı</td>
                <td className={es.teal}>
                  <strong>{formatMoney(report.wallets.reduce((s, w) => s + w.total, 0))}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <ArrowRightLeft size={18} />
          <div>
            <h2>Cüzdan Transfer Komisyonu</h2>
            <p>Plaka sahiplerine para gönderirken alınan %{WALLET_PAYOUT_COMMISSION_RATE} komisyon</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Cüzdan</th>
                <th>Sürücü</th>
                <th>Plaka</th>
                <th>Transfer Sayısı</th>
                <th>Toplam Gönderilen</th>
                <th>Komisyon Oranı</th>
                <th>Admin Kazancı</th>
              </tr>
            </thead>
            <tbody>
              {report.transfers.map((t) => (
                <tr key={t.walletId}>
                  <td><span className={es.badge}>{t.walletId}</span></td>
                  <td>{t.driver}</td>
                  <td>{t.plate}</td>
                  <td>{t.transferCount}</td>
                  <td>{formatMoney(t.totalTransferred)}</td>
                  <td>%{WALLET_PAYOUT_COMMISSION_RATE}</td>
                  <td className={es.yellow}>{formatMoney(t.adminCommission)}</td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={6}>Toplam Transfer Komisyonu</td>
                <td className={es.yellow}>{formatMoney(report.transferCommissionTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <Tag size={18} />
          <div>
            <h2>Kampanyalardan Kar</h2>
            <p>Sigorta, lastik, yağ, oto yıkama — satış marjı × kullanım adedi</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Kampanya</th>
                <th>Kategori</th>
                <th>Ödeme Cüzdanı</th>
                <th>Kullanım</th>
                <th>Birim Kar</th>
                <th>Toplam Kar</th>
              </tr>
            </thead>
            <tbody>
              {report.campaigns.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.title}</strong></td>
                  <td>{c.category}</td>
                  <td><span className={es.badge}>{c.payoutWalletId}</span></td>
                  <td>{c.redemptionCount}</td>
                  <td>{formatMoney(c.marginPerSale)}</td>
                  <td className={es.purple}>{formatMoney(c.totalEarned)}</td>
                </tr>
              ))}
              <tr className={es.footerTotal}>
                <td colSpan={5}>Toplam Kampanya Karı</td>
                <td className={es.purple}>{formatMoney(report.campaignTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className={es.section}>
        <div className={es.sectionHead}>
          <TrendingUp size={18} />
          <div>
            <h2>Genel Özet</h2>
            <p>Tüm gelir kaynaklarının toplamı</p>
          </div>
        </div>
        <div className={es.tableWrap}>
          <table className={es.table}>
            <thead>
              <tr>
                <th>Gelir Kaynağı</th>
                <th>Açıklama</th>
                <th>Toplam Kazanç</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Platform Hakedişi</strong></td>
                <td>Uber, Yandex, 7/24, BiTaksi ciro üzerinden %1 admin payı</td>
                <td className={es.teal}>{formatMoney(report.platformTotal)}</td>
              </tr>
              <tr>
                <td><strong>Kampanya Karı</strong></td>
                <td>Fırsat ve kampanya satışlarından elde edilen marj</td>
                <td className={es.purple}>{formatMoney(report.campaignTotal)}</td>
              </tr>
              <tr>
                <td><strong>Cüzdan Transfer Komisyonu</strong></td>
                <td>Sürücü cüzdanlarına para gönderimlerinde %{WALLET_PAYOUT_COMMISSION_RATE} kesinti</td>
                <td className={es.yellow}>{formatMoney(report.transferCommissionTotal)}</td>
              </tr>
              <tr className={es.footerTotal}>
                <td colSpan={2}><strong>GENEL TOPLAM</strong></td>
                <td className={es.teal}><strong>{formatMoney(report.grandTotal)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}
