import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import Navbar from '../components/layout/Navbar'


export default function NotifPage() {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/notifications').then(r => setNotifs(r.data)).finally(() => setLoading(false))
  }, [])

  const markRead = async (id: number) => {
    await api.patch(`/notifications/${id}/read`)
    setNotifs(notifs.map((n: any) => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAll = async () => {
    await api.patch('/notifications/read-all')
    setNotifs(notifs.map((n: any) => ({ ...n, isRead: true })))
  }

  const unread = notifs.filter((n: any) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Notifikasi</h1>
          {unread > 0 && (
            <button onClick={markAll} className="text-sm text-primary-600 hover:underline font-medium">
              Tandai semua dibaca
            </button>
          )}
        </div>

        {loading ? (
          <div className="card text-center py-12 text-gray-400">Memuat...</div>
        ) : notifs.length === 0 ? (
          <div className="card text-center py-16 text-gray-500">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifs.map((n: any) => (
              <div key={n.id}
                onClick={() => !n.isRead && markRead(n.id)}
                className={`card cursor-pointer transition-all ${!n.isRead ? 'border-primary-200 bg-primary-50' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!n.isRead ? 'bg-primary-500' : 'bg-gray-200'}`} />
                  <div>
                    <div className="font-medium text-sm text-gray-900">{n.title}</div>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
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
