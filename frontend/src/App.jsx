import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ClaimForm from './pages/ClaimForm'
import ClaimResult from './pages/ClaimResult'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem('adminToken')
  return token ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/submit"        element={<ClaimForm />} />
            <Route path="/result/:claimId" element={<ClaimResult />} />
            <Route path="/admin/login"   element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="border-t border-slate-200 py-5 text-center text-sm text-slate-400">
          InsureGuard &copy; {new Date().getFullYear()} &mdash; AI-Powered Fraud Detection
        </footer>
      </div>
    </BrowserRouter>
  )
}
