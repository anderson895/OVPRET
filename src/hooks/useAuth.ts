import { useState, useCallback, useEffect } from 'react'
import type { AppUser } from '../types'
import { loginUser, logoutUser } from '../services/auth'

let _user: AppUser | null = (() => {
  try { return JSON.parse(sessionStorage.getItem('ovpret_user') || 'null') } catch { return null }
})()

type Listener = (u: AppUser | null) => void
const _listeners = new Set<Listener>()

function setGlobalUser(u: AppUser | null) {
  _user = u
  if (u) sessionStorage.setItem('ovpret_user', JSON.stringify(u))
  else sessionStorage.removeItem('ovpret_user')
  _listeners.forEach((fn) => fn(u))
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(_user)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    const fn: Listener = (u) => setUser(u)
    _listeners.add(fn)
    return () => { _listeners.delete(fn) }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true); setError('')
    try {
      const u = await loginUser(email, password)
      setGlobalUser(u)
    } catch (e: any) {
      setError(e.message || 'Login failed.')
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    await logoutUser()
    setGlobalUser(null)
  }, [])

  return { user, loading, error, login, logout, setError }
}
