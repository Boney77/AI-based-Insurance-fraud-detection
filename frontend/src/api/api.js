import axios from 'axios'

// Production: /api → Vercel proxy → Railway backend
// Local dev:  /api → Vite proxy  → localhost:8080
const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(err) {
  if (!err.response) {
    return 'Cannot reach backend. Check Railway is running and RAILWAY_BACKEND_URL is set on Vercel.'
  }
  let data = err.response.data
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch (_) { /* keep string */ }
  }
  if (data?.message) return data.message
  if (data?.error)   return data.error
  if (err.response.status === 405) {
    return 'Backend misconfigured (405). Set RAILWAY_BACKEND_URL on Vercel and redeploy.'
  }
  if (err.response.status === 404) return 'API endpoint not found. Check Railway backend is deployed.'
  if (err.response.status === 502) return data?.message || 'Railway backend is unreachable.'
  if (err.response.status >= 500)  return 'Backend server error. Check Railway logs.'
  return `Request failed (${err.response.status}). Please try again.`
}

// ── User APIs ────────────────────────────────────────────────────────────────

export const submitClaim = (data) => api.post('/claim/submit', data)

export const getClaimStatus = (claimId) => api.get(`/claim/${claimId}`)

export const checkBackendHealth = () => api.get('/health')

// ── Admin APIs ───────────────────────────────────────────────────────────────

export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password })

export const getAllClaims = () => api.get('/admin/claims')

export const getClaimById = (claimId) => api.get(`/admin/claims/${claimId}`)

export const approveClaim = (claimId, note = '') =>
  api.put(`/admin/approve/${claimId}`, { note })

export const rejectClaim = (claimId, note = '') =>
  api.put(`/admin/reject/${claimId}`, { note })

export const investigateClaim = (claimId, note = '') =>
  api.put(`/admin/investigate/${claimId}`, { note })

export default api
