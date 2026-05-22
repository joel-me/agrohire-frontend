export const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export const formatDateShort = (date: string) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

export const statusLabel: Record<string, string> = {
  open: 'Terbuka',
  in_progress: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
  pending: 'Menunggu',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  withdrawn: 'Ditarik',
  escrow_held: 'Dana Ditahan',
  work_started: 'Pekerjaan Dimulai',
  work_completed: 'Menunggu Verifikasi',
  farmer_verified: 'Terverifikasi',
  released: 'Dana Dilepas',
  disputed: 'Sengketa',
}

export const statusBadgeClass: Record<string, string> = {
  open: 'badge-open',
  pending: 'badge-pending',
  accepted: 'badge-accepted',
  rejected: 'badge-rejected',
  released: 'badge-released',
  completed: 'badge-completed',
  in_progress: 'badge-accepted',
  work_completed: 'badge-pending',
  escrow_held: 'badge-pending',
}
