import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import api from '../lib/api'

export default function ProfilPage() {
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.get('/users/profile').then(r => {
      setProfile(r.data)
      setForm({
        fullName: r.data.profile?.fullName || '',
        phone: r.data.profile?.phone || '',
        address: r.data.profile?.address || '',
        city: r.data.profile?.city || '',
        province: r.data.profile?.province || '',
        bio: r.data.profile?.bio || '',
        farmName: r.data.profile?.farmName || '',
        skills: (r.data.profile?.skills || []).join(', '),
      })
    })
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.patch('/users/profile', {
        ...form,
        skills: form.skills ? form.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      })
      setMsg('Profil berhasil disimpan!')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

        {msg && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-5">{msg}</div>}

        {profile && (
          <div className="card mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-primary-700">
                {profile.profile?.fullName?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{profile.profile?.fullName}</div>
                <div className="text-sm text-gray-500">{profile.email} · {profile.role}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  ⭐ {profile.profile?.avgRating || '0.0'} · {profile.profile?.totalJobs || 0} pekerjaan
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card animate-fadeInUp">
          <h2 className="font-semibold text-gray-900 mb-5">Edit Profil</h2>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <input className="input-field" value={form.fullName || ''} onChange={e => setForm({...form, fullName: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">No. HP</label>
                <input className="input-field" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Kota</label>
                <input className="input-field" value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Provinsi</label>
              <input className="input-field" value={form.province || ''} onChange={e => setForm({...form, province: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Alamat</label>
              <input className="input-field" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea className="input-field h-20 resize-none" value={form.bio || ''} onChange={e => setForm({...form, bio: e.target.value})} />
            </div>
            {profile?.role === 'buruh' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Keahlian (pisahkan dengan koma)</label>
                <input className="input-field" placeholder="panen, tanam, pupuk" value={form.skills || ''} onChange={e => setForm({...form, skills: e.target.value})} />
              </div>
            )}
            {profile?.role === 'petani' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lahan/Kebun</label>
                <input className="input-field" value={form.farmName || ''} onChange={e => setForm({...form, farmName: e.target.value})} />
              </div>
            )}
            <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
