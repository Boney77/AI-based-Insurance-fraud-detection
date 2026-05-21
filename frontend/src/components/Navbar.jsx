import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const isAdmin   = !!localStorage.getItem('adminToken')
  const isAdminPage = location.pathname.startsWith('/admin')

  function handleLogout() {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  return (
    <header className="bg-brand-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <ShieldIcon className="h-6 w-6 text-brand-300" />
          <span>InsureGuard</span>
          <span className="text-brand-400 font-normal text-sm hidden sm:inline">Fraud Detection</span>
        </Link>

        <nav className="flex items-center gap-1">
          <NavLink to="/" label="Home" current={location.pathname} />
          <NavLink to="/submit" label="Submit Claim" current={location.pathname} />

          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" label="Dashboard" current={location.pathname} />
              <button
                onClick={handleLogout}
                className="ml-2 text-sm text-brand-200 hover:text-white px-3 py-1.5 rounded-lg hover:bg-brand-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            !isAdminPage && (
              <Link
                to="/admin/login"
                className="ml-2 text-sm bg-brand-700 hover:bg-brand-600 px-4 py-1.5 rounded-lg transition-colors"
              >
                Admin
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ to, label, current }) {
  const active = current === to
  return (
    <Link
      to={to}
      className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
        active
          ? 'bg-brand-700 text-white font-medium'
          : 'text-brand-200 hover:text-white hover:bg-brand-800'
      }`}
    >
      {label}
    </Link>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
    </svg>
  )
}
