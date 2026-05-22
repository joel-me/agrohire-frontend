import { Link } from 'react-router-dom'
import { Sprout, Search, ShieldCheck, Star, ArrowRight, Users, Briefcase, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-body">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-gray-900">AgroHire</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link to="/cari-kerja" className="hover:text-primary-600 transition-colors">Cari Kerja</Link>
          <Link to="/login" className="hover:text-primary-600 transition-colors">Masuk</Link>
          <Link to="/register" className="btn-primary text-sm">Mulai Sekarang</Link>
        </div>
        <div className="md:hidden flex gap-2">
          <Link to="/login" className="btn-secondary text-sm">Masuk</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-earth-50 pt-20 pb-24 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, #16a34a 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="relative max-w-4xl mx-auto text-center animate-fadeInUp">
          <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">
            Platform Job Matching Pertanian #1
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Hubungkan <span className="text-primary-600">Petani</span> dengan<br />
            <span className="text-earth-600">Buruh Tani</span> Terpercaya
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            AgroHire mempertemukan petani yang membutuhkan tenaga kerja dengan buruh tani berpengalaman.
            Sistem escrow aman memastikan pembayaran terjamin untuk semua pihak.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-3.5">
              Mulai Gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cari-kerja" className="btn-secondary flex items-center justify-center gap-2 text-base px-8 py-3.5">
              <Search className="w-4 h-4" /> Cari Lowongan
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="relative max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 animate-fadeInUp delay-200">
          {[
            { icon: Users, value: '2.400+', label: 'Pengguna Aktif' },
            { icon: Briefcase, value: '850+', label: 'Lowongan Terpasang' },
            { icon: TrendingUp, value: 'Rp 1,2M+', label: 'Upah Tersalurkan' },
          ].map((s) => (
            <div key={s.label} className="card text-center py-5">
              <s.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
              <div className="font-display font-bold text-2xl text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section className="py-20 px-6 md:px-16 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Cara Kerja AgroHire</h2>
          <p className="text-gray-500">Sederhana, aman, dan transparan</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Petani */}
          <div className="card border-l-4 border-primary-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Sprout className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-900">Untuk Petani</h3>
            </div>
            <div className="space-y-3">
              {['Daftar sebagai Petani', 'Posting lowongan pekerjaan', 'Pilih buruh dari pelamar', 'Dana escrow ditahan hingga selesai', 'Verifikasi → dana dilepas ke buruh'].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Buruh */}
          <div className="card border-l-4 border-earth-500">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-earth-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-earth-600" />
              </div>
              <h3 className="font-display font-semibold text-xl text-gray-900">Untuk Buruh Tani</h3>
            </div>
            <div className="space-y-3">
              {['Daftar sebagai Buruh Tani', 'Cari lowongan sesuai lokasi & keahlian', 'Lamar pekerjaan pilihan', 'Mulai bekerja setelah diterima', 'Konfirmasi selesai → upah cair'].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-earth-500 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-sm text-gray-600">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section className="bg-gray-50 py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">Mengapa AgroHire?</h2>
            <p className="text-gray-500">Dirancang khusus untuk ekosistem pertanian Indonesia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, color: 'text-primary-600 bg-primary-100', title: 'Sistem Escrow Aman', desc: 'Dana petani ditahan aman hingga pekerjaan terverifikasi selesai.' },
              { icon: Star, color: 'text-earth-600 bg-earth-100', title: 'Rating Dua Arah', desc: 'Bangun reputasi melalui sistem ulasan transparan antara petani dan buruh.' },
              { icon: Search, color: 'text-blue-600 bg-blue-100', title: 'Pencarian Cerdas', desc: 'Filter berdasarkan lokasi, jenis pekerjaan, dan upah harian.' },
            ].map((f) => (
              <div key={f.title} className="card hover:shadow-card-hover transition-shadow duration-300">
                <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center bg-primary-600">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Siap Bergabung?</h2>
        <p className="text-primary-100 mb-8 max-w-md mx-auto">Daftar gratis sekarang dan mulai perjalanan Anda bersama komunitas pertanian Indonesia.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-colors shadow-md">
          Daftar Sekarang <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm text-center py-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sprout className="w-4 h-4 text-primary-400" />
          <span className="text-white font-semibold">AgroHire</span>
        </div>
        <p>© 2024 AgroHire · Skripsi Joel Alwan Sembiring (2381048) · Universitas Advent Indonesia</p>
      </footer>
    </div>
  )
}
