export interface AuthUser {
  student_id?: string;
  name?: string;
  domain?: string;
  department?: string;
  year?: string;
  college?: string;
  email?: string;
  hero_id?: string | null;
  assigned_scenario?: number | null;
  challenge_started_at?: string | null;
  challenge_completed?: number;
  role: 'student' | 'admin';
  username?: string;
}

export const getUser   = (): AuthUser | null => { try { const r = localStorage.getItem('waec_user'); return r ? JSON.parse(r) : null; } catch { return null; } };
export const getToken  = (): string | null   => localStorage.getItem('waec_token');
export const setAuth   = (t: string, u: AuthUser) => { localStorage.setItem('waec_token', t); localStorage.setItem('waec_user', JSON.stringify(u)); };
export const clearAuth = () => { localStorage.removeItem('waec_token'); localStorage.removeItem('waec_user'); };
export const refreshUser = (u: Partial<AuthUser>) => { const cur = getUser(); if (cur) localStorage.setItem('waec_user', JSON.stringify({ ...cur, ...u })); };
