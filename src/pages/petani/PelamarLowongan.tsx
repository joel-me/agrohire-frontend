import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/api'
import { statusBadgeClass, statusLabel } from '../../lib/format'

export default function PelamarLowongan() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/applications/listing/${listingId}`)
      .then(r => setApplicants(r.data))
      .finally(() => setLoading(false))
  }, [listingId])

  const updateStatus = async (id: number, action: 'accept' | 'reject') => {
    await api.patch(`/applications/${id}/${action}`)
    setApplicants(applicants.map((a: any) =>
      a.id === id ? { ...a, status: action === 'accept' ? 'accepted' : 'rejected' } : a
    ))
  }

  const startTransaction = async (appId: number) => {
    if (!confirm('Mulai transaksi escrow untuk pelamar ini?')) return
    try {
      await api.post(`/transactions/start/${appId}`)
      alert('Transaksi berhasil dibuat! Periksa halaman Transaksi.')
      navigate('/transaksi')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat transaksi')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Daftar Pelamar</h1>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : applicants.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">Belum ada pelamar</div>
        ) : (
          <div className="space-y-4">
            {applicants.map((a: any) => (
              <div key={a.id} className="card">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 bg-earth-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold text-earth-700">{a.worker?.profile?.fullName?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{a.worker?.profile?.fullName}</h3>
                        {a.worker?.isVerified && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Terverifikasi</span>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span>{a.worker?.profile?.avgRating || '0.0'}</span>
                        <span className="text-gray-300">·</span>
                        <span>{a.worker?.profile?.totalJobs || 0} pekerjaan</span>
                      </div>
                      {a.worker?.profile?.city && (
                        <p className="text-xs text-gray-400 mt-0.5">📍 {a.worker.profile.city}</p>
                      )}
                      {a.coverNote && (
                        <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg px-3 py-2 italic">"{a.coverNote}"</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={statusBadgeClass[a.status] || 'badge-pending'}>{statusLabel[a.status]}</span>
                    {a.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(a.id, 'accept')}
                          className="flex items-center gap-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" /> Terima
                        </button>
                        <button onClick={() => updateStatus(a.id, 'reject')}
                          className="flex items-center gap-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                          <XCircle className="w-3.5 h-3.5" /> Tolak
                        </button>
                      </div>
                    )}
                    {a.status === 'accepted' && (
                      <button onClick={() => startTransaction(a.id)}
                        className="text-xs bg-primary-600 text-white hover:bg-primary-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                        Mulai Transaksi
                      </button>
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
