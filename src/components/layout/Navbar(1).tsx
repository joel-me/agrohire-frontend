import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sprout, Bell, User, LogOut, Menu, X, ChevronDown } from 'lucide-react'
import { getUser, clearAuth } from '../../lib/auth'

export default function Navbar() {
  const user = getUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  const dashPath = user ? `/dashboard/${user.role}` : '/login'

  const navLinks = user?.role === 'petani'
    ? [
        { to: '/dashboard/petani', label: 'Dashboard' },
        { to: '/petani/lowongan-saya', label: 'Lowongan Saya' },
        { to: '/transaksi', label: 'Transaksi' },
      ]
    : user?.role === 'buruh'
    ? [
        { to: '/dashboard/buruh', label: 'Dashboard' },
        { to: '/cari-kerja', label: 'Cari Kerja' },
        { to: '/buruh/lamaran-saya', label: 'Lamaran Saya' },
        { to: '/transaksi', label: 'Transaksi' },
      ]
    : user?.role === 'admin'
    ? [{ to: '/dashboard/admin', label: 'Dashboard Admin' }]
    : [
        { to: '/cari-kerja', label: 'Cari Kerja' },
        { to: '/login', label: 'Masuk' },
      ]

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={dashPath} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">AgroHire</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === l.to
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right: notif + user */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/notifikasi" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-sm">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-card-hover border border-gray-100 py-1 z-50">
                    <Link to="/profil" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Profil Saya
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm">Masuk</Link>
              <Link to="/register" className="btn-primary text-sm">Daftar</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
              {l.label}
            </Link>
          ))}
          {user && (
            <>
              <Link to="/profil" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Profil</Link>
              <button onClick={logout} className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">Keluar</button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
