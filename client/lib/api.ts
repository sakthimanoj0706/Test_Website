import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE, timeout: 15000 });

api.interceptors.request.use(cfg => {
  if (typeof window !== 'undefined') {
    const t = localStorage.getItem('waec_token');
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  }
  return cfg;
});

api.interceptors.response.use(r => r, err => {
  if (err.response?.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('waec_token');
    localStorage.removeItem('waec_user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export const authApi = {
  register:   (d: Record<string,string>) => api.post('/register', d),
  login:      (u: string, p: string)     => api.post('/login', { username:u, password:p }),
  adminLogin: (u: string, p: string)     => api.post('/admin/login', { username:u, password:p }),
};

export const challengeApi = {
  selectHero:     (hero_id: string) => api.post('/challenge/select-hero', { hero_id }),
  start:          ()                => api.post('/challenge/start'),
  complete:       ()                => api.post('/challenge/complete'),
  status:         ()                => api.get('/challenge/status'),
  logEvent:       (event: string)   => api.post('/challenge/security-event', { event }),
};

export const adminApi = {
  getStudents:     (p?: Record<string,string>) => api.get('/admin/students', { params: p }),
  getAnalytics:    ()                          => api.get('/admin/analytics'),
  getSettings:     ()                          => api.get('/admin/settings'),
  updateSettings:  (d: Record<string,unknown>) => api.put('/admin/settings', d),
  deleteStudent:   (id: string)                => api.delete(`/admin/student/${id}`),
  resetStudent:    (id: string)                => api.post(`/admin/reset/${id}`),
  exportExcel:     ()                          => api.get('/admin/export/excel',      { responseType:'blob' }),
  downloadDb:      ()                          => api.get('/admin/download/database', { responseType:'blob' }),
  backup:          ()                          => api.post('/admin/backup'),
};

export default api;
