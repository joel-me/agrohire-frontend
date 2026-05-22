import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sprout, Eye, EyeOff, Tractor, Users } from 'lucide-react'
import api from '../lib/api'
import { saveAuth } from '../lib/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', phone: '', role: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.role) { setError('Pilih peran Anda terlebih dahulu'); return }
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      saveAuth(res.data.token, res.data.user)
      navigate(`/dashboard/${res.data.user.role}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-earth-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">AgroHire</span>
          </Link>
        </div>

        <div className="card shadow-card-hover animate-fadeInUp">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Buat Akun</h2>
          <p className="text-sm text-gray-500 mb-6">Bergabung dengan komunitas pertanian Indonesia</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}

          {/* Pilih Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Saya adalah</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'petani', icon: Tractor, label: 'Petani', desc: 'Butuh tenaga kerja' },
                { value: 'buruh', icon: Users, label: 'Buruh Tani', desc: 'Cari pekerjaan' },
              ].map((r) => (
                <button key={r.value} type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.role === r.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}>
                  <r.icon className={`w-5 h-5 mb-2 ${form.role === r.value ? 'text-primary-600' : 'text-gray-400'}`} />
                  <div className={`font-semibold text-sm ${form.role === r.value ? 'text-primary-700' : 'text-gray-700'}`}>{r.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <input className="input-field" placeholder="Budi Santoso" value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <input className="input-field" placeholder="pak_budi" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. HP</label>
                <input className="input-field" placeholder="081200000000" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input type="email" className="input-field" placeholder="email@contoh.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-11" placeholder="Minimal 6 karakter"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Mendaftarkan...' : 'Buat Akun'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 pt-5 border-t border-gray-100">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
