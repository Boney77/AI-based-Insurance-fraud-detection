/**
 * Vercel Edge Middleware — proxies API calls to Railway backend.
 * Runs on Vercel only. Requires RAILWAY_BACKEND_URL env var.
 *
 * Browser POST /claim/submit  →  middleware  →  Railway POST /claim/submit
 */
export default async function middleware(request) {
  const backend = process.env.RAILWAY_BACKEND_URL?.replace(/\/+$/, '')

  if (!backend) {
    return new Response(
      JSON.stringify({
        message: 'RAILWAY_BACKEND_URL is not set. Add it in Vercel Environment Variables.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const url = new URL(request.url)
  const targetUrl = `${backend}${url.pathname}${url.search}`

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')

  const auth = request.headers.get('authorization')
  if (auth) headers.set('Authorization', auth)

  const init = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.text()
  }

  try {
    const response = await fetch(targetUrl, init)
    const body = await response.text()

    return new Response(body, {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        message: `Cannot reach Railway backend at ${backend}`,
        detail: err.message,
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const config = {
  matcher: ['/claim/:path*', '/admin/:path*', '/health'],
}
