import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'
import { getUser } from '../lib/auth'
import { formatRupiah, formatDateShort, statusLabel, statusBadgeClass } from '../lib/format'

export default function TransaksiPage() {
  const user = getUser()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/transactions/my').then(r => setTransactions(r.data)).finally(() => setLoading(false))
  }, [])

  const workerConfirm = async (id: number) => {
    if (!confirm('Konfirmasi pekerjaan sudah selesai?')) return
    await api.patch(`/transactions/${id}/worker-confirm`)
    setTransactions(transactions.map((t: any) =>
      t.id === id ? { ...t, status: 'work_completed' } : t
    ))
  }

  const farmerVerify = async (id: number) => {
    if (!confirm('Verifikasi pekerjaan selesai? Dana akan dilepas ke buruh.')) return
    await api.patch(`/transactions/${id}/farmer-verify`)
    setTransactions(transactions.map((t: any) =>
      t.id === id ? { ...t, status: 'released' } : t
    ))
  }

  const giveReview = async (txId: number) => {
    const rating = prompt('Beri rating (1-5):')
    if (!rating || isNaN(+rating)) return
    const comment = prompt('Komentar (opsional):') || ''
    await api.post(`/reviews/transaction/${txId}`, { rating: +rating, comment })
    alert('Rating berhasil diberikan!')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h1>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : transactions.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">Belum ada transaksi</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t: any) => (
              <div key={t.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.listing?.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {user?.role === 'petani' ? `Buruh: ${t.worker?.profile?.fullName}` : `Petani: ${t.farmer?.profile?.fullName}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 {t.workStartDate && formatDateShort(t.workStartDate)} – {t.workEndDate && formatDateShort(t.workEndDate)}
                    </p>
                  </div>
                  <span className={statusBadgeClass[t.status] || 'badge-pending'}>
                    {statusLabel[t.status] || t.status}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-400">Total Transaksi</div>
                    <div className="font-bold text-primary-600">{formatRupiah(t.amount)}</div>
                    <div className="text-xs text-gray-400">Net: {formatRupiah(t.netAmount)}</div>
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'buruh' && t.status === 'escrow_held' && (
                      <button onClick={() => workerConfirm(t.id)}
                        className="btn-primary text-sm">Konfirmasi Selesai</button>
                    )}
                    {user?.role === 'petani' && t.status === 'work_completed' && (
                      <button onClick={() => farmerVerify(t.id)}
                        className="btn-primary text-sm">Verifikasi & Lepas Dana</button>
                    )}
                    {t.status === 'released' && (
                      <button onClick={() => giveReview(t.id)}
                        className="btn-secondary text-sm">⭐ Beri Rating</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
