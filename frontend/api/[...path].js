/**
 * Vercel serverless proxy — forwards /api/* to Railway backend.
 * Set RAILWAY_BACKEND_URL in Vercel Environment Variables.
 * Example: https://your-app.up.railway.app  (no trailing slash)
 */
module.exports = async function handler(req, res) {
  const backend = process.env.RAILWAY_BACKEND_URL || process.env.VITE_API_URL

  if (!backend) {
    return res.status(500).json({
      message: 'Backend not configured. Set RAILWAY_BACKEND_URL in Vercel Environment Variables.',
    })
  }

  const pathParam = req.query.path
  const pathStr = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '')
  const target = `${backend.replace(/\/+$/, '')}/${pathStr}`

  const headers = { 'Content-Type': 'application/json' }
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization
  }

  try {
    const options = { method: req.method, headers }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body || {})
    }

    const response = await fetch(target, options)
    const text = await response.text()

    res.status(response.status)
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    return res.send(text)
  } catch (err) {
    return res.status(502).json({
      message: `Cannot reach Railway backend at ${backend}. Check Railway is running.`,
      detail: err.message,
    })
  }
}
