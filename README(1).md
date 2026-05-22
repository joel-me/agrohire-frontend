# AgroHire Frontend - React + TypeScript + Tailwind

Skripsi: Joel Alwan Sembiring (2381048) - Universitas Advent Indonesia

## Cara Menjalankan (Lokal)

```bash
npm install
npm run dev
# Buka: http://localhost:5173
```

## Halaman yang Tersedia

| Route | Halaman | Akses |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Halaman Login | Public |
| `/register` | Daftar Akun | Public |
| `/cari-kerja` | Cari Lowongan | Public |
| `/dashboard/petani` | Dashboard Petani | Petani |
| `/petani/buat-lowongan` | Buat Lowongan | Petani |
| `/petani/lowongan-saya` | Kelola Lowongan | Petani |
| `/petani/pelamar/:id` | Lihat Pelamar | Petani |
| `/dashboard/buruh` | Dashboard Buruh | Buruh |
| `/buruh/lamaran-saya` | Lamaran Saya | Buruh |
| `/dashboard/admin` | Panel Admin | Admin |
| `/transaksi` | Riwayat Transaksi | Login |
| `/profil` | Edit Profil | Login |
| `/notifikasi` | Notifikasi | Login |

## Deploy ke Vercel via GitHub

1. Push folder ini ke GitHub
2. Buka https://vercel.com → Import Project → pilih repo ini
3. Di Vercel, tambahkan Environment Variable:
   ```
   VITE_API_URL = https://url-backend-railway-kamu.railway.app/api
   ```
4. Klik Deploy ✅

## Konfigurasi Backend URL

Edit file `.env`:
```
VITE_API_URL=http://localhost:3001/api   # lokal
```

Edit `.env.production`:
```
VITE_API_URL=https://backend-kamu.railway.app/api   # production
```
