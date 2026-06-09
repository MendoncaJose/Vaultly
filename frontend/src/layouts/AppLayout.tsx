import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth.context'

const NAV_ITEMS = [
  { to: '/app/dashboard', label: 'Dashboard' },
  { to: '/app/stocks', label: 'Stocks' },
  { to: '/app/crypto', label: 'Crypto' },
  { to: '/app/etfs', label: 'ETFs' },
  { to: '/app/transactions', label: 'Transactions' },
  { to: '/app/watchlist', label: 'Watchlist' },
  { to: '/app/alerts', label: 'Alerts' },
  { to: '/app/settings', label: 'Settings' },
]

export default function AppLayout() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen bg-graphite">
      <aside className="w-56 flex-shrink-0 border-r border-iron flex flex-col">
        <div className="px-6 py-5 border-b border-iron">
          <span className="font-ivy-presto text-heading-sm text-chalk-glow tracking-tight">
            Vaultly
          </span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-0.5 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'px-3 py-2 rounded-sm text-caption transition-colors',
                  isActive
                    ? 'bg-slate text-chalk-glow'
                    : 'text-ash hover:text-chalk hover:bg-slate',
                ].join(' ')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-4 border-t border-iron">
          <p className="text-caption text-ash truncate">{user?.email}</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
