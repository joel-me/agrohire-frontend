import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/layout/Navbar'
import api from '../../lib/vite-env'

const jobTypes = ['Panen', 'Tanam', 'Semprot', 'Pupuk', 'Bajak', 'Irigasi', 'Lainnya']

export default function BuatLowongan() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', description: '', location: '', city: '', province: '',
    startDate: '', endDate: '', durationDays: '', jobType: '',
    requiredWorkers: '1', dailyWage: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.post('/listings', {
        ...form,
        durationDays: parseInt(form.durationDays),
        requiredWorkers: parseInt(form.requiredWorkers),
        dailyWage: parseFloat(form.dailyWage),
      })
      navigate('/petani/lowongan-saya')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal membuat lowongan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <div className="card animate-fadeInUp">
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Buat Lowongan Baru</h1>
          <p className="text-sm text-gray-500 mb-7">Isi detail pekerjaan yang Anda butuhkan</p>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Judul Lowongan *</label>
              <input className="input-field" placeholder="cth: Buruh Panen Padi - Juni 2026"
                value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Pekerjaan</label>
              <select className="input-field" value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                <option value="">-- Pilih --</option>
                {jobTypes.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Deskripsi Pekerjaan *</label>
              <textarea className="input-field h-24 resize-none" placeholder="Jelaskan detail pekerjaan, syarat, dll."
                value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota *</label>
                <input className="input-field" placeholder="Subang" value={form.city} onChange={e => set('city', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Provinsi</label>
                <input className="input-field" placeholder="Jawa Barat" value={form.province} onChange={e => set('province', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat Lengkap *</label>
              <input className="input-field" placeholder="Desa Jatisari, Kec. Ciasem, Subang"
                value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Mulai *</label>
                <input type="date" className="input-field" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal Selesai *</label>
                <input type="date" className="input-field" value={form.endDate} onChange={e => set('endDate', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Durasi (hari) *</label>
                <input type="number" min="1" className="input-field" placeholder="7"
                  value={form.durationDays} onChange={e => set('durationDays', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Jumlah Pekerja *</label>
                <input type="number" min="1" className="input-field" placeholder="5"
                  value={form.requiredWorkers} onChange={e => set('requiredWorkers', e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upah Harian (Rp) *</label>
                <input type="number" min="0" className="input-field" placeholder="120000"
                  value={form.dailyWage} onChange={e => set('dailyWage', e.target.value)} required />
              </div>
            </div>

            {form.dailyWage && form.durationDays && form.requiredWorkers && (
              <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-3 text-sm text-primary-700">
                <span className="font-medium">Total estimasi: </span>
                Rp {(parseFloat(form.dailyWage) * parseInt(form.durationDays) * parseInt(form.requiredWorkers)).toLocaleString('id-ID')}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Batal</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
                {loading ? 'Memposting...' : 'Posting Lowongan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
