import axios from 'axios'

// Strip trailing slash so we never get double-slash URLs
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const BASE_URL = rawUrl.replace(/\/+$/, '')

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

/** Turn axios errors into human-readable messages */
export function getApiErrorMessage(err) {
  if (!err.response) {
    // No response = network error or CORS block
    if (import.meta.env.VITE_API_URL) {
      return `Cannot reach backend at ${BASE_URL}. Check that Railway is running and VITE_API_URL is correct.`
    }
    return 'Cannot reach backend. Set VITE_API_URL in Vercel to your Railway URL and redeploy.'
  }
  const data = err.response.data
  if (data?.message) return data.message
  if (data?.error)   return data.error
  if (err.response.status === 404) return 'API endpoint not found. Check VITE_API_URL has no trailing slash.'
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
