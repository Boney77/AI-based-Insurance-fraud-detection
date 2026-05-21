import axios from 'axios'

let apiInstance = null
let apiBaseUrl = ''

export async function initApi() {
  if (import.meta.env.DEV) {
    apiBaseUrl = 'http://localhost:8080'
  } else {
    const res = await fetch('/config.json')
    if (!res.ok) throw new Error('config.json not found — redeploy after setting RAILWAY_BACKEND_URL on Vercel')
    const config = await res.json()
    apiBaseUrl = (config.apiUrl || '').replace(/\/+$/, '')
    if (!apiBaseUrl || apiBaseUrl === 'http://localhost:8080') {
      throw new Error(
        'Backend URL not configured. On Vercel, set RAILWAY_BACKEND_URL to your Railway URL and redeploy.'
      )
    }
  }

  apiInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 20000,
  })

  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  })

  return apiBaseUrl
}

export function getApiBaseUrl() {
  return apiBaseUrl
}

function api() {
  if (!apiInstance) throw new Error('API not ready')
  return apiInstance
}

export function getApiErrorMessage(err) {
  if (!err.response) {
    return `Cannot reach backend at ${apiBaseUrl || 'unknown'}. Check Railway is running.`
  }
  let data = err.response.data
  if (typeof data === 'string') {
    try { data = JSON.parse(data) } catch (_) {}
  }
  if (data?.message) return data.message
  if (data?.error)   return data.error
  if (err.response.status === 404) return `Backend endpoint not found. Is Railway URL correct? (${apiBaseUrl})`
  if (err.response.status >= 500)  return 'Backend server error. Check Railway logs.'
  return `Request failed (${err.response.status}). Please try again.`
}

export const submitClaim = (data) => api().post('/claim/submit', data)
export const getClaimStatus = (claimId) => api().get(`/claim/${claimId}`)
export const checkBackendHealth = () => api().get('/health')

export const adminLogin = (username, password) =>
  api().post('/admin/login', { username, password })
export const getAllClaims = () => api().get('/admin/claims')
export const getClaimById = (claimId) => api().get(`/admin/claims/${claimId}`)
export const approveClaim = (claimId, note = '') =>
  api().put(`/admin/approve/${claimId}`, { note })
export const rejectClaim = (claimId, note = '') =>
  api().put(`/admin/reject/${claimId}`, { note })
export const investigateClaim = (claimId, note = '') =>
  api().put(`/admin/investigate/${claimId}`, { note })

export default api
