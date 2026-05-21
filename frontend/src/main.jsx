import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initApi } from './api/api.js'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: '#64748b' }}>
    Loading...
  </div>
)

initApi()
  .then(() => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
  .catch((err) => {
    root.render(
      <div style={{ maxWidth: 520, margin: '80px auto', padding: 32, fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#dc2626', marginBottom: 12 }}>Configuration Error</h2>
        <p style={{ color: '#475569', lineHeight: 1.6 }}>{err.message}</p>
        <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>
          Fix: Vercel → Settings → Environment Variables → add<br />
          <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>
            RAILWAY_BACKEND_URL = https://your-app.up.railway.app
          </code>
          <br /><br />Then redeploy.
        </p>
      </div>
    )
  })
