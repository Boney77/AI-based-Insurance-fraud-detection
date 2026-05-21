import axios from 'axios'

// Same-origin in production (Vercel middleware proxies to Railway)
// Vite dev proxy forwards /claim, /admin, /health → localhost:8080
const BASE_URL = ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export function getApiErrorMessage(err) {
  if (!err.response) {
    return 'Cannot reach backend. Check Railway is running and RAILWAY_BACKEND_URL is set on Vercel.'
  }
  let data = err.response.data
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch (_) {}
  }
  if (data?.message) return data.message
  if (data?.error)   return data.error
  if (err.response.status === 405) {
    return 'Server rejected POST (405). Redeploy Vercel after setting RAILWAY_BACKEND_URL.'
  }
  if (err.response.status === 502) return data?.message || 'Railway backend is unreachable.'
  if (err.response.status >= 500)  return 'Backend error. Check Railway logs.'
  return `Request failed (${err.response.status}). Please try again.`
}

export const submitClaim = (data) => api.post('/claim/submit', data)
export const getClaimStatus = (claimId) => api.get(`/claim/${claimId}`)
export const checkBackendHealth = () => api.get('/health')

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
