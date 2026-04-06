import { NavLink, Outlet } from 'react-router-dom'
import { usePharmacyAuth } from '../context/PharmacyAuthContext'
import { PHARMACY_NAME } from '../data/demoData'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: '\u2302' },
  { to: '/deliveries', label: 'Deliveries', icon: '\uD83D\uDCE6' },
  { to: '/pod-records', label: 'POD Records', icon: '\u2611' },
  { to: '/reports', label: 'Reports', icon: '\uD83D\uDCCA' },
  { to: '/settings', label: 'Settings', icon: '\u2699' },
]

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function AppLayout({ title }) {
  const { signOut } = usePharmacyAuth()

  return (
    <div className="lyn__layout">
      {/* Sidebar */}
      <aside className="lyn__sidebar">
        <div className="lyn__sidebar-logo">
          <span className="lyn__sidebar-logo-text">
            LYN<span className="lyn__sidebar-logo-dot" />
          </span>
        </div>

        <nav className="lyn__sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `lyn__sidebar-link${isActive ? ' active' : ''}`
              }
            >
              <span className="lyn__sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="lyn__sidebar-footer">
          <span className="lyn__sidebar-footer-text">Powered by LYN Software</span>
        </div>
      </aside>

      {/* Header */}
      <header className="lyn__header">
        <h1 className="lyn__header-title">{title}</h1>
        <div className="lyn__header-right">
          <span className="lyn__header-date">{formatDate()}</span>
          <span className="lyn__header-pharmacy">{PHARMACY_NAME}</span>
          <div className="lyn__header-avatar">GE</div>
          <button className="lyn__header-signout" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="lyn__content">
        <Outlet />
      </main>
    </div>
  )
}
