import { useEffect, useState } from 'react'
import { Users, List, TrendingUp, CheckCircle, UserX } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/vite-env'
import { formatRupiah } from '../../lib/format'

export default function DashboardAdmin() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState<'stats' | 'users' | 'listings' | 'transactions'>('stats')
  const [listings, setListings] = useState([])
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data))
    api.get('/admin/users').then(r => setUsers(r.data))
  }, [])

  const loadListings = () => {
    if (listings.length === 0) api.get('/admin/listings').then(r => setListings(r.data))
    setTab('listings')
  }

  const loadTransactions = () => {
    if (transactions.length === 0) api.get('/admin/transactions').then(r => setTransactions(r.data))
    setTab('transactions')
  }

  const deactivate = async (id: number) => {
    if (!confirm('Nonaktifkan pengguna ini?')) return
    await api.patch(`/admin/users/${id}/deactivate`)
    setUsers(users.map((u: any) => u.id === id ? { ...u, isActive: false } : u))
  }

  const verify = async (id: number) => {
    await api.patch(`/admin/users/${id}/verify`)
    setUsers(users.map((u: any) => u.id === id ? { ...u, isVerified: true } : u))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Dashboard Admin</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { key: 'stats', label: 'Statistik' },
            { key: 'users', label: 'Pengguna' },
            { key: 'listings', label: 'Lowongan' },
            { key: 'transactions', label: 'Transaksi' },
          ].map(t => (
            <button key={t.key}
              onClick={() => t.key === 'listings' ? loadListings() : t.key === 'transactions' ? loadTransactions() : setTab(t.key as any)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        {tab === 'stats' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp">
            {[
              { label: 'Total Pengguna', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-100' },
              { label: 'Petani', value: stats.totalPetani, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
              { label: 'Buruh', value: stats.totalBuruh, icon: Users, color: 'text-earth-600 bg-earth-100' },
              { label: 'Lowongan Aktif', value: stats.openListings, icon: List, color: 'text-purple-600 bg-purple-100' },
              { label: 'Total Lowongan', value: stats.totalListings, icon: List, color: 'text-indigo-600 bg-indigo-100' },
              { label: 'Total Transaksi', value: stats.totalTransactions, icon: TrendingUp, color: 'text-yellow-600 bg-yellow-100' },
              { label: 'Transaksi Selesai', value: stats.releasedTx, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
            ].map(s => (
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
        )}

        {/* Users */}
        {tab === 'users' && (
          <div className="space-y-3 animate-fadeInUp">
            {users.map((u: any) => (
              <div key={u.id} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                    {u.profile?.fullName?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{u.profile?.fullName}</div>
                    <div className="text-xs text-gray-500">{u.email} · {u.role}</div>
                    <div className="flex gap-2 mt-0.5">
                      {u.isVerified && <span className="text-xs text-blue-600">✓ Terverifikasi</span>}
                      {!u.isActive && <span className="text-xs text-red-500">Nonaktif</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!u.isVerified && u.role !== 'admin' && (
                    <button onClick={() => verify(u.id)}
                      className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded-lg font-medium">
                      <CheckCircle className="w-3.5 h-3.5" /> Verifikasi
                    </button>
                  )}
                  {u.isActive && u.role !== 'admin' && (
                    <button onClick={() => deactivate(u.id)}
                      className="flex items-center gap-1 text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-lg font-medium">
                      <UserX className="w-3.5 h-3.5" /> Nonaktifkan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Listings */}
        {tab === 'listings' && (
          <div className="space-y-3 animate-fadeInUp">
            {listings.map((l: any) => (
              <div key={l.id} className="card">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{l.title}</h3>
                    <p className="text-sm text-gray-500">{l.city} · {l.jobType} · {l.farmer?.profile?.fullName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-primary-600">{formatRupiah(l.dailyWage)}/hari</div>
                    <span className="text-xs text-gray-500">{l.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions */}
        {tab === 'transactions' && (
          <div className="space-y-3 animate-fadeInUp">
            {transactions.map((t: any) => (
              <div key={t.id} className="card">
                <div className="flex justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{t.listing?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {t.farmer?.profile?.fullName} → {t.worker?.profile?.fullName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-primary-600">{formatRupiah(t.amount)}</div>
                    <span className="text-xs text-gray-500">{t.status}</span>
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
