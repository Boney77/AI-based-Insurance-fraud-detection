import { writeFileSync, mkdirSync } from 'fs'

const url =
  process.env.VITE_API_URL ||
  process.env.RAILWAY_BACKEND_URL ||
  'http://localhost:8080'

const clean = url.replace(/\/+$/, '')

mkdirSync('public', { recursive: true })
writeFileSync('public/config.json', JSON.stringify({ apiUrl: clean }, null, 2))

console.log('')
console.log('========================================')
console.log('  Backend URL written to config.json')
console.log('  apiUrl =', clean)
console.log('========================================')
console.log('')

if (clean === 'http://localhost:8080' && process.env.VERCEL) {
  console.warn('WARNING: No VITE_API_URL or RAILWAY_BACKEND_URL set on Vercel!')
  console.warn('Set one of them in Vercel → Settings → Environment Variables')
  process.exit(1)
}
