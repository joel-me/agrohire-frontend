import { useEffect, useState } from 'react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/api'
import { formatRupiah, formatDateShort, statusLabel, statusBadgeClass } from '../../lib/format'

export default function LamaranSaya() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/applications/my').then(r => setApplications(r.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Lamaran Saya</h1>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : applications.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">
            <p className="mb-4">Belum ada lamaran</p>
            <a href="/cari-kerja" className="btn-primary">Cari Lowongan</a>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((a: any) => (
              <div key={a.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{a.listing?.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {a.listing?.city} · {a.listing?.jobType}
                    </p>
                    <p className="text-sm text-gray-500">
                      💰 {formatRupiah(a.listing?.dailyWage)}/hari
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 {formatDateShort(a.listing?.startDate)} – {formatDateShort(a.listing?.endDate)}
                    </p>
                    {a.listing?.farmer?.profile && (
                      <p className="text-xs text-gray-400 mt-1">
                        Petani: {a.listing.farmer.profile.fullName}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={statusBadgeClass[a.status] || 'badge-pending'}>
                      {statusLabel[a.status]}
                    </span>
                    <div className="text-xs text-gray-400 mt-2">
                      {formatDateShort(a.appliedAt)}
                    </div>
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
