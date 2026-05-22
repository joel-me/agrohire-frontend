export interface User {
  id: number
  username: string
  email: string
  role: 'petani' | 'buruh' | 'admin'
  fullName: string
  avgRating?: number
  totalJobs?: number
  isVerified?: boolean
}

export const getUser = (): User | null => {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export const getToken = (): string | null => localStorage.getItem('token')

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const isLoggedIn = (): boolean => !!getToken()
