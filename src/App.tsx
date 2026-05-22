import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getUser } from './lib/auth'

// Pages
import LandingPage      from './pages/LandingPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import DashboardPetani  from './pages/petani/DashboardPetani'
import BuatLowongan     from './pages/petani/BuatLowongan'
import LowonganSaya     from './pages/petani/LowonganSaya'
import PelamarLowongan  from './pages/petani/PelamarLowongan'
import DashboardBuruh   from './pages/buruh/DashboardBuruh'
import CariKerja        from './pages/buruh/CariKerja'
import LamaranSaya      from './pages/buruh/LamaranSaya'
import DashboardAdmin   from './pages/admin/DashboardAdmin'
import TransaksiPage    from './pages/TransaksiPage'
import ProfilPage       from './pages/ProfilPage'
import NotifPage        from './pages/NotifPage'

// Guard: harus login
const RequireAuth = ({ children, role }: { children: any; role?: string }) => {
  const user = getUser()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const user = getUser()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={`/dashboard/${user.role}`} /> : <RegisterPage />} />
        <Route path="/cari-kerja" element={<CariKerja />} />

        {/* Petani */}
        <Route path="/dashboard/petani" element={<RequireAuth role="petani"><DashboardPetani /></RequireAuth>} />
        <Route path="/petani/buat-lowongan" element={<RequireAuth role="petani"><BuatLowongan /></RequireAuth>} />
        <Route path="/petani/lowongan-saya" element={<RequireAuth role="petani"><LowonganSaya /></RequireAuth>} />
        <Route path="/petani/pelamar/:listingId" element={<RequireAuth role="petani"><PelamarLowongan /></RequireAuth>} />

        {/* Buruh */}
        <Route path="/dashboard/buruh" element={<RequireAuth role="buruh"><DashboardBuruh /></RequireAuth>} />
        <Route path="/buruh/lamaran-saya" element={<RequireAuth role="buruh"><LamaranSaya /></RequireAuth>} />

        {/* Admin */}
        <Route path="/dashboard/admin" element={<RequireAuth role="admin"><DashboardAdmin /></RequireAuth>} />

        {/* Shared */}
        <Route path="/transaksi"  element={<RequireAuth><TransaksiPage /></RequireAuth>} />
        <Route path="/profil"     element={<RequireAuth><ProfilPage /></RequireAuth>} />
        <Route path="/notifikasi" element={<RequireAuth><NotifPage /></RequireAuth>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
