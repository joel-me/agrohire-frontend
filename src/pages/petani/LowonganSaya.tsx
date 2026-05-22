import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/api'
import { formatRupiah, formatDateShort, statusLabel, statusBadgeClass } from '../../lib/format'

export default function LowonganSaya() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/listings/my').then(r => setListings(r.data)).finally(() => setLoading(false))
  }, [])

  const cancel = async (id: number) => {
    if (!confirm('Batalkan lowongan ini?')) return
    await api.patch(`/listings/${id}/cancel`)
    setListings(listings.filter((l: any) => l.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Lowongan Saya</h1>
          <Link to="/petani/buat-lowongan" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Buat Lowongan
          </Link>
        </div>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : listings.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">Belum ada lowongan</p>
            <Link to="/petani/buat-lowongan" className="btn-primary">Buat Lowongan</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((l: any) => (
              <div key={l.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={statusBadgeClass[l.status] || 'badge-pending'}>{statusLabel[l.status]}</span>
                      {l.jobType && <span className="text-xs text-gray-400">{l.jobType}</span>}
                    </div>
                    <h3 className="font-semibold text-gray-900">{l.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {l.location} · {formatDateShort(l.startDate)} – {formatDateShort(l.endDate)}
                    </p>
                    <p className="text-sm text-gray-500">
                      👥 {l.requiredWorkers} pekerja · {formatRupiah(l.dailyWage)}/hari
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/petani/pelamar/${l.id}`}
                      className="flex items-center gap-1 text-sm text-primary-600 font-medium hover:underline">
                      <Users className="w-4 h-4" /> Pelamar
                    </Link>
                    {l.status === 'open' && (
                      <button onClick={() => cancel(l.id)}
                        className="text-sm text-red-500 hover:underline text-left">Batalkan</button>
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
