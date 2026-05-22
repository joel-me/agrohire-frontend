import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, FileText, Star, TrendingUp, ArrowRight } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/vite-env'
import { getUser } from '../../lib/auth'
import { formatRupiah, formatDateShort, statusLabel, statusBadgeClass } from '../../lib/format'

export default function DashboardBuruh() {
  const user = getUser()
  const [applications, setApplications] = useState([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/applications/my'),
      api.get('/users/profile'),
    ]).then(([appRes, profileRes]) => {
      setApplications(appRes.data)
      setProfile(profileRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const pending  = applications.filter((a: any) => a.status === 'pending').length
  const accepted = applications.filter((a: any) => a.status === 'accepted').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="mb-8 animate-fadeInUp">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Halo, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Temukan pekerjaan pertanian yang cocok untuk Anda.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeInUp delay-100">
          {[
            { label: 'Total Lamaran', value: applications.length, icon: FileText, color: 'text-blue-600 bg-blue-100' },
            { label: 'Menunggu', value: pending, icon: TrendingUp, color: 'text-yellow-600 bg-yellow-100' },
            { label: 'Diterima', value: accepted, icon: Star, color: 'text-green-600 bg-green-100' },
            { label: 'Rating', value: profile?.profile?.avgRating || '0.0', icon: Star, color: 'text-purple-600 bg-purple-100' },
          ].map((s) => (
            <div key={s.label} className="card flex items-center gap-4">
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8 animate-fadeInUp delay-200">
          <Link to="/cari-kerja"
            className="card bg-primary-600 border-0 text-white hover:bg-primary-700 transition-colors flex items-center justify-between group">
            <div>
              <div className="font-semibold text-lg mb-1">Cari Lowongan Kerja</div>
              <div className="text-primary-100 text-sm">Temukan pekerjaan sesuai keahlian</div>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-white" />
            </div>
          </Link>
          <Link to="/transaksi"
            className="card hover:shadow-card-hover transition-shadow flex items-center justify-between group">
            <div>
              <div className="font-semibold text-lg text-gray-900 mb-1">Riwayat Transaksi</div>
              <div className="text-gray-500 text-sm">Cek status pembayaran</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Lamaran Terbaru */}
        <div className="animate-fadeInUp delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-gray-900">Lamaran Terbaru</h2>
            <Link to="/buruh/lamaran-saya" className="text-sm text-primary-600 hover:underline font-medium">Lihat semua →</Link>
          </div>

          {loading ? (
            <div className="card text-center py-12 text-gray-400">Memuat...</div>
          ) : applications.length === 0 ? (
            <div className="card text-center py-12">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Belum ada lamaran</p>
              <Link to="/cari-kerja" className="btn-primary">Cari Lowongan</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((a: any) => (
                <div key={a.id} className="card hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{a.listing?.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {a.listing?.city} · {a.listing?.jobType}
                      </p>
                      <p className="text-sm text-gray-500">
                        💰 {formatRupiah(a.listing?.dailyWage)}/hari ·{' '}
                        {formatDateShort(a.listing?.startDate)} – {formatDateShort(a.listing?.endDate)}
                      </p>
                    </div>
                    <span className={statusBadgeClass[a.status] || 'badge-pending'}>
                      {statusLabel[a.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
