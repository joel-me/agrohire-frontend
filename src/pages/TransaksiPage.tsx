import { useEffect, useState } from 'react'
import { CheckCircle, Clock, CreditCard, Banknote, Smartphone } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'
import { getUser } from '../lib/auth'
import { formatRupiah, formatDateShort } from '../lib/format'

const statusInfo: Record<string, { label: string; color: string; desc: string }> = {
  pending:         { label: 'Menunggu',           color: 'badge-pending',   desc: 'Transaksi dibuat' },
  work_started:    { label: 'Pekerjaan Berjalan',  color: 'badge-accepted',  desc: 'Buruh sedang bekerja' },
  work_completed:  { label: 'Menunggu Verifikasi', color: 'badge-pending',   desc: 'Buruh sudah konfirmasi selesai' },
  payment_pending: { label: 'Menunggu Pembayaran', color: 'badge-pending',   desc: 'Petani perlu membayar upah' },
  paid:            { label: 'Sudah Dibayar',       color: 'badge-accepted',  desc: 'Menunggu konfirmasi buruh' },
  done:            { label: 'Selesai',             color: 'badge-released',  desc: 'Transaksi selesai' },
  cancelled:       { label: 'Dibatalkan',          color: 'badge-rejected',  desc: 'Transaksi dibatalkan' },
}

const paymentMethods = [
  { value: 'transfer_bank', label: 'Transfer Bank', icon: CreditCard },
  { value: 'tunai',         label: 'Tunai / Cash',  icon: Banknote },
  { value: 'dompet_digital',label: 'Dompet Digital (OVO/GoPay/Dana)', icon: Smartphone },
]

export default function TransaksiPage() {
  const user = getUser()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [payModal, setPayModal] = useState<any>(null)
  const [payForm, setPayForm] = useState({ paymentMethod: 'transfer_bank', paymentProof: '' })
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    api.get('/transactions/my').then(r => setTransactions(r.data)).finally(() => setLoading(false))
  }, [])

  const updateTx = (id: number, data: any) =>
    setTransactions(transactions.map((t: any) => t.id === id ? { ...t, ...data } : t))

  // STEP 2: Buruh konfirmasi pekerjaan selesai
  const workerConfirm = async (id: number) => {
    if (!confirm('Konfirmasi pekerjaan sudah selesai?')) return
    await api.patch(`/transactions/${id}/worker-confirm`)
    updateTx(id, { status: 'work_completed' })
  }

  // STEP 3: Petani verifikasi pekerjaan
  const farmerVerify = async (id: number) => {
    if (!confirm('Verifikasi pekerjaan selesai? Selanjutnya Anda perlu membayar upah buruh.')) return
    await api.patch(`/transactions/${id}/farmer-verify`)
    updateTx(id, { status: 'payment_pending' })
  }

  // STEP 4: Petani bayar
  const farmerPay = async () => {
    if (!payModal) return
    setPaying(true)
    try {
      await api.patch(`/transactions/${payModal.id}/pay`, payForm)
      updateTx(payModal.id, { status: 'paid', paymentMethod: payForm.paymentMethod })
      setPayModal(null)
      setPayForm({ paymentMethod: 'transfer_bank', paymentProof: '' })
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal melakukan pembayaran')
    } finally {
      setPaying(false)
    }
  }

  // STEP 5: Buruh konfirmasi terima bayaran
  const confirmPayment = async (id: number) => {
    if (!confirm('Konfirmasi sudah menerima pembayaran dari petani?')) return
    await api.patch(`/transactions/${id}/confirm-payment`)
    updateTx(id, { status: 'done' })
  }

  const giveReview = async (txId: number) => {
    const rating = prompt('Beri rating (1-5):')
    if (!rating || isNaN(+rating) || +rating < 1 || +rating > 5) {
      alert('Rating harus antara 1-5'); return
    }
    const comment = prompt('Komentar (opsional):') || ''
    try {
      await api.post(`/reviews/transaction/${txId}`, { rating: +rating, comment })
      alert('Rating berhasil diberikan! Terima kasih.')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal beri rating')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h1>
        <p className="text-gray-500 text-sm mb-6">Pembayaran dilakukan setelah pekerjaan selesai dan diverifikasi</p>

        {/* Alur */}
        <div className="card mb-6 bg-blue-50 border-blue-200">
          <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wide">Alur Transaksi</p>
          <div className="flex items-center gap-2 flex-wrap text-xs text-blue-600">
            {['Pekerjaan Dimulai','Buruh Konfirmasi Selesai','Petani Verifikasi','Petani Bayar Upah','Buruh Terima Bayaran','✅ Selesai'].map((s, i, arr) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-medium">{s}</span>
                {i < arr.length - 1 && <span className="text-blue-300">→</span>}
              </span>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : transactions.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">Belum ada transaksi</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t: any) => {
              const info = statusInfo[t.status] || { label: t.status, color: 'badge-pending', desc: '' }
              return (
                <div key={t.id} className="card hover:shadow-card-hover transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{t.listing?.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {user?.role === 'petani'
                          ? `👷 Buruh: ${t.worker?.profile?.fullName}`
                          : `🌾 Petani: ${t.farmer?.profile?.fullName}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        📅 {t.workStartDate && formatDateShort(t.workStartDate)} – {t.workEndDate && formatDateShort(t.workEndDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={info.color + ' mb-1 block'}>{info.label}</span>
                      <p className="text-xs text-gray-400">{info.desc}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-gray-50 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-400">Total Upah</div>
                      <div className="font-bold text-xl text-primary-600">{formatRupiah(t.amount)}</div>
                    </div>
                    {t.paymentMethod && (
                      <div className="text-right">
                        <div className="text-xs text-gray-400">Metode Bayar</div>
                        <div className="text-sm font-medium text-gray-700 capitalize">
                          {t.paymentMethod.replace('_', ' ')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions berdasarkan role dan status */}
                  <div className="flex gap-2 flex-wrap">

                    {/* BURUH: konfirmasi pekerjaan selesai */}
                    {user?.role === 'buruh' && t.status === 'work_started' && (
                      <button onClick={() => workerConfirm(t.id)}
                        className="btn-primary text-sm flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Konfirmasi Pekerjaan Selesai
                      </button>
                    )}

                    {/* PETANI: verifikasi pekerjaan */}
                    {user?.role === 'petani' && t.status === 'work_completed' && (
                      <button onClick={() => farmerVerify(t.id)}
                        className="btn-primary text-sm flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Verifikasi Pekerjaan Selesai
                      </button>
                    )}

                    {/* PETANI: bayar upah */}
                    {user?.role === 'petani' && t.status === 'payment_pending' && (
                      <button onClick={() => setPayModal(t)}
                        className="btn-earth text-sm flex items-center gap-1.5">
                        <Banknote className="w-4 h-4" /> Bayar Upah {formatRupiah(t.amount)}
                      </button>
                    )}

                    {/* BURUH: konfirmasi terima bayaran */}
                    {user?.role === 'buruh' && t.status === 'paid' && (
                      <button onClick={() => confirmPayment(t.id)}
                        className="btn-primary text-sm flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" /> Konfirmasi Terima Pembayaran
                      </button>
                    )}

                    {/* Beri rating jika sudah done */}
                    {t.status === 'done' && (
                      <button onClick={() => giveReview(t.id)}
                        className="btn-secondary text-sm">
                        ⭐ Beri Rating
                      </button>
                    )}

                    {/* Info sudah dibayar */}
                    {t.status === 'paid' && user?.role === 'petani' && (
                      <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                        <Clock className="w-4 h-4" /> Menunggu konfirmasi buruh
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Bayar */}
      {payModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeInUp">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-1">Bayar Upah Buruh</h2>
            <p className="text-sm text-gray-500 mb-5">{payModal.listing?.title}</p>

            <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 mb-5 text-center">
              <div className="text-xs text-gray-500 mb-1">Total yang harus dibayar</div>
              <div className="font-bold text-2xl text-primary-600">{formatRupiah(payModal.amount)}</div>
              <div className="text-xs text-gray-400 mt-1">kepada {payModal.worker?.profile?.fullName}</div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
              <div className="space-y-2">
                {paymentMethods.map(m => (
                  <label key={m.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      payForm.paymentMethod === m.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" name="method" value={m.value}
                      checked={payForm.paymentMethod === m.value}
                      onChange={e => setPayForm(f => ({ ...f, paymentMethod: e.target.value }))}
                      className="hidden" />
                    <m.icon className={`w-5 h-5 ${payForm.paymentMethod === m.value ? 'text-primary-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${payForm.paymentMethod === m.value ? 'text-primary-700' : 'text-gray-700'}`}>
                      {m.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Bukti Pembayaran <span className="text-gray-400 font-normal">(opsional - link foto/struk)</span>
              </label>
              <input className="input-field" placeholder="https://link-bukti-pembayaran.com"
                value={payForm.paymentProof}
                onChange={e => setPayForm(f => ({ ...f, paymentProof: e.target.value }))} />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setPayModal(null)} className="btn-secondary flex-1">Batal</button>
              <button onClick={farmerPay} disabled={paying} className="btn-primary flex-1 disabled:opacity-60">
                {paying ? 'Memproses...' : 'Konfirmasi Pembayaran'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
