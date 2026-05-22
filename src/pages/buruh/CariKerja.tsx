import { useEffect, useState } from 'react'
import { Search, MapPin, Briefcase, Star } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/api'
import { getUser } from '../../lib/auth'
import { formatRupiah, formatDateShort } from '../../lib/format'

export default function CariKerja() {
  const user = getUser()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ city: '', job_type: '', min_wage: '' })
  const [applying, setApplying] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter.city)     params.set('city', filter.city)
    if (filter.job_type) params.set('job_type', filter.job_type)
    if (filter.min_wage) params.set('min_wage', filter.min_wage)
    api.get(`/listings?${params}`).then(r => setListings(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const apply = async (listingId: number) => {
    if (!user) { window.location.href = '/login'; return }
    if (user.role !== 'buruh') { alert('Hanya buruh yang dapat melamar'); return }
    setApplying(listingId)
    try {
      await api.post(`/applications/listing/${listingId}`)
      alert('Lamaran berhasil dikirim!')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal melamar')
    } finally {
      setApplying(null)
    }
  }

  const jobTypes = ['Panen', 'Tanam', 'Semprot', 'Pupuk', 'Bajak', 'Irigasi', 'Lainnya']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Cari Lowongan Kerja</h1>
        <p className="text-gray-500 mb-7">Temukan pekerjaan pertanian sesuai lokasi dan keahlian Anda</p>

        {/* Filter */}
        <div className="card mb-6 animate-fadeInUp">
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input-field pl-9" placeholder="Kota..."
                value={filter.city} onChange={e => setFilter(f => ({ ...f, city: e.target.value }))} />
            </div>
            <select className="input-field" value={filter.job_type}
              onChange={e => setFilter(f => ({ ...f, job_type: e.target.value }))}>
              <option value="">Semua Jenis</option>
              {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <input type="number" className="input-field" placeholder="Upah min (Rp)"
              value={filter.min_wage} onChange={e => setFilter(f => ({ ...f, min_wage: e.target.value }))} />
            <button onClick={load} className="btn-primary flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Cari
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="card text-center py-16 text-gray-400">Mencari lowongan...</div>
        ) : listings.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">Tidak ada lowongan ditemukan</div>
        ) : (
          <div className="space-y-4 animate-fadeInUp delay-100">
            <p className="text-sm text-gray-500">{listings.length} lowongan ditemukan</p>
            {listings.map((l: any) => (
              <div key={l.id} className="card hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-open">Terbuka</span>
                      {l.jobType && (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <Briefcase className="w-3 h-3" /> {l.jobType}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{l.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{l.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span>📍 {l.location}</span>
                      <span>📅 {formatDateShort(l.startDate)} – {formatDateShort(l.endDate)}</span>
                      <span>👥 {l.requiredWorkers} pekerja</span>
                    </div>
                    {/* Info Petani */}
                    {l.farmer?.profile && (
                      <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-bold text-xs">{l.farmer.profile.fullName?.charAt(0)}</span>
                        </div>
                        <span>{l.farmer.profile.fullName}</span>
                        {l.farmer.profile.avgRating > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            {l.farmer.profile.avgRating}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-bold text-xl text-primary-600">{formatRupiah(l.dailyWage)}</div>
                    <div className="text-xs text-gray-400 mb-3">per hari</div>
                    {user?.role === 'buruh' && (
                      <button onClick={() => apply(l.id)} disabled={applying === l.id}
                        className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                        {applying === l.id ? 'Melamar...' : 'Lamar'}
                      </button>
                    )}
                    {!user && (
                      <a href="/login" className="btn-primary text-sm">Masuk untuk Melamar</a>
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
