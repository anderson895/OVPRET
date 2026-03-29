import { useState, useCallback, useEffect } from 'react';
import type { AppUser } from '../types';
import { loginUser, logoutUser } from '../services/documents';

// Module-level shared state so all useAuth() instances stay in sync
let _globalUser: AppUser | null = (() => {
  try {
    const saved = sessionStorage.getItem('ovpret_user');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
})();

type Listener = (user: AppUser | null) => void;
const _listeners = new Set<Listener>();

function setGlobalUser(u: AppUser | null) {
  _globalUser = u;
  if (u) sessionStorage.setItem('ovpret_user', JSON.stringify(u));
  else sessionStorage.removeItem('ovpret_user');
  _listeners.forEach((fn) => fn(u));
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(_globalUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const listener: Listener = (u) => setUser(u);
    _listeners.add(listener);
    return () => { _listeners.delete(listener); };
  }, []);

  const login = useCallback(async (email: string, password: string, role: string) => {
    setLoading(true);
    setError('');
    try {
      const u = await loginUser(email, password, role);
      const appUser: AppUser = {
        uid: u.uid,
        email: u.email,
        displayName: u.displayName,
        role: u.role as AppUser['role'],
      };
      setGlobalUser(appUser);
    } catch (e: any) {
      setError(e.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setGlobalUser(null);
  }, []);

  return { user, loading, error, login, logout, setError };
}
