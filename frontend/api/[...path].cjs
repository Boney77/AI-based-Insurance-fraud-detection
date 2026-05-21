/**
 * Vercel serverless proxy: /api/* → Railway backend
 * Uses .cjs extension so it works with "type": "module" in package.json
 *
 * Set on Vercel: RAILWAY_BACKEND_URL=https://your-app.up.railway.app
 */
module.exports = async function handler(req, res) {
  const backend = process.env.RAILWAY_BACKEND_URL || process.env.VITE_API_URL

  if (!backend) {
    return res.status(500).json({
      message: 'Set RAILWAY_BACKEND_URL in Vercel Environment Variables to your Railway URL.',
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
      const body = req.body
      options.body = typeof body === 'string' ? body : JSON.stringify(body || {})
    }

    const response = await fetch(target, options)
    const text = await response.text()

    res.status(response.status)
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json')
    return res.send(text)
  } catch (err) {
    return res.status(502).json({
      message: 'Cannot reach Railway backend. Check RAILWAY_BACKEND_URL and that Railway is running.',
      detail: err.message,
    })
  }
}
