import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, List, Users, TrendingUp, Star, ArrowRight } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/vite-env'
import { getUser } from '../../lib/auth'
import { formatRupiah, formatDateShort, statusLabel, statusBadgeClass } from '../../lib/format'

export default function DashboardPetani() {
  const user = getUser()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/listings/my').then(r => setListings(r.data)).finally(() => setLoading(false))
  }, [])

  const open      = listings.filter((l: any) => l.status === 'open').length
  const progress  = listings.filter((l: any) => l.status === 'in_progress').length
  const completed = listings.filter((l: any) => l.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Greeting */}
        <div className="mb-8 animate-fadeInUp">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Selamat datang, {user?.fullName?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Kelola lowongan dan temukan buruh tani terbaik.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fadeInUp delay-100">
          {[
            { label: 'Total Lowongan', value: listings.length, icon: List, color: 'text-blue-600 bg-blue-100' },
            { label: 'Terbuka', value: open, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
            { label: 'Berlangsung', value: progress, icon: Users, color: 'text-yellow-600 bg-yellow-100' },
            { label: 'Selesai', value: completed, icon: Star, color: 'text-purple-600 bg-purple-100' },
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
          <Link to="/petani/buat-lowongan"
            className="card bg-primary-600 border-0 text-white hover:bg-primary-700 transition-colors flex items-center justify-between group">
            <div>
              <div className="font-semibold text-lg mb-1">Buat Lowongan Baru</div>
              <div className="text-primary-100 text-sm">Pasang lowongan dan temukan buruh yang tepat</div>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
          </Link>
          <Link to="/transaksi"
            className="card hover:shadow-card-hover transition-shadow flex items-center justify-between group">
            <div>
              <div className="font-semibold text-lg text-gray-900 mb-1">Riwayat Transaksi</div>
              <div className="text-gray-500 text-sm">Lihat semua transaksi & escrow</div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Listings */}
        <div className="animate-fadeInUp delay-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-gray-900">Lowongan Terbaru</h2>
            <Link to="/petani/lowongan-saya" className="text-sm text-primary-600 hover:underline font-medium">
              Lihat semua →
            </Link>
          </div>

          {loading ? (
            <div className="card text-center py-12 text-gray-400">Memuat...</div>
          ) : listings.length === 0 ? (
            <div className="card text-center py-12">
              <List className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">Belum ada lowongan</p>
              <Link to="/petani/buat-lowongan" className="btn-primary">Buat Lowongan Pertama</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.slice(0, 5).map((l: any) => (
                <div key={l.id} className="card hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={statusBadgeClass[l.status] || 'badge-pending'}>
                          {statusLabel[l.status] || l.status}
                        </span>
                        {l.jobType && <span className="text-xs text-gray-400">{l.jobType}</span>}
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">{l.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {l.city} · {formatDateShort(l.startDate)} – {formatDateShort(l.endDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-primary-600">{formatRupiah(l.dailyWage)}<span className="text-xs text-gray-400">/hari</span></div>
                      <div className="text-xs text-gray-400 mt-1">{l.requiredWorkers} orang</div>
                      <Link to={`/petani/pelamar/${l.id}`}
                        className="text-xs text-primary-600 hover:underline font-medium mt-2 block">
                        Lihat Pelamar →
                      </Link>
                    </div>
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
