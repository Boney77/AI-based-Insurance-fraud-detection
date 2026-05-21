import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach admin token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── User APIs ────────────────────────────────────────────────────────────────

export const submitClaim = (data) => api.post('/claim/submit', data)

export const getClaimStatus = (claimId) => api.get(`/claim/${claimId}`)

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
