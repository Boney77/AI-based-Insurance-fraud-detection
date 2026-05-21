import axios from 'axios'

/**
 * API base URL priority:
 * 1. VITE_API_URL (direct to Railway) — set on Vercel if using direct mode
 * 2. /api (Vercel proxy → Railway) — default for production
 * 3. /api (Vite dev proxy → localhost:8080) — local dev
 */
function resolveBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  }
  return '/api'
}

const BASE_URL = resolveBaseUrl()

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
    return `Cannot reach backend at ${BASE_URL}. Check Railway is running and env vars are set on Vercel.`
  }
  let data = err.response.data
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch (_) { /* keep string */ }
  }
  if (data?.message) return data.message
  if (data?.error)   return typeof data.error === 'string' ? data.error : data.error
  if (err.response.status === 404) {
    return 'API not found (404). Set RAILWAY_BACKEND_URL on Vercel and redeploy, OR set VITE_API_URL to your Railway URL directly.'
  }
  if (err.response.status === 405) {
    return 'Method not allowed (405). Backend URL may be pointing to Vercel instead of Railway.'
  }
  if (err.response.status === 502) return data?.message || 'Railway backend unreachable.'
  if (err.response.status >= 500)  return 'Backend server error. Check Railway logs.'
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
