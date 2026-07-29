import { useNavigate } from 'react-router-dom'
import { useShop } from '../store/ShopContext'

interface ProfileScreenProps {
  onViewOrders: () => void
}

const MENU_ITEMS = [
  {
    group: 'Shopping',
    items: [
      { label: 'My Orders', icon: 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', action: 'orders' },
      { label: 'Saved Items', icon: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z', action: null },
      { label: 'Addresses', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z', action: null },
      { label: 'Payment Methods', icon: 'M1 4h22v16H1zM1 10h22', action: null },
    ],
  },
  {
    group: 'Account',
    items: [
      { label: 'Notifications', icon: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0', action: null },
      { label: 'Privacy & Security', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', action: null },
      { label: 'Help & Support', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01', action: null },
      { label: 'About ShopEase', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01', action: null },
    ],
  },
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'SE'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfileScreen({ onViewOrders }: ProfileScreenProps) {
  const navigate = useNavigate()
  const { user, orders, logout } = useShop()
  const name = user?.name ?? 'Guest'
  const email = user?.email ?? ''
  const orderCount = orders.filter(
    (o) => !o.userEmail || !user?.email || o.userEmail === user.email
  ).length

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="h-full overflow-y-auto hide-scrollbar bg-canvas">
      <div className="bg-ink px-5 pt-14 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-2xl text-white">{initials(name)}</span>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-xl text-white leading-tight truncate">
              {name}
            </h1>
            <p className="text-white/50 font-body text-sm mt-0.5 truncate">{email}</p>
          </div>
          <button
            type="button"
            className="ml-auto w-9 h-9 flex items-center justify-center rounded-full bg-white/10 border border-white/20"
            aria-label="Edit profile"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 mt-6">
          {[
            { value: String(orderCount), label: 'Orders' },
            { value: '3', label: 'Saved' },
            { value: '12', label: 'Reviews' },
          ].map(({ value, label }) => (
            <div key={label} className="flex-1 bg-white/10 rounded-2xl p-3 text-center">
              <p className="font-display font-bold text-xl text-white">{value}</p>
              <p className="font-body text-xs text-white/50 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-6">
        {MENU_ITEMS.map(({ group, items }) => (
          <div key={group} className="mb-6">
            <p className="font-body font-medium text-[10px] text-ink-3 uppercase tracking-[0.2em] mb-3">
              {group}
            </p>
            <div className="bg-surface border border-rule rounded-2xl overflow-hidden">
              {items.map(({ label, icon, action }, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (action === 'orders') onViewOrders()
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors active:bg-canvas ${
                    i < items.length - 1 ? 'border-b border-rule' : ''
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-canvas border border-rule flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5A5A56" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d={icon} />
                    </svg>
                  </div>
                  <span className="flex-1 font-body font-medium text-sm text-ink">{label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="w-full bg-surface border border-rule rounded-2xl px-5 py-4 flex items-center gap-4 text-left transition-colors active:bg-canvas"
        >
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF3B21" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </div>
          <span className="flex-1 font-body font-medium text-sm text-brand">Log Out</span>
        </button>

        <p className="text-center text-ink-3 font-body text-xs mt-6">
          ShopEase v1.0 — Built with care
        </p>
      </div>
    </div>
  )
}
