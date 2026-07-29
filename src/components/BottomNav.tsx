import type { JSX } from 'react'
import type { NavTab } from '../types'

interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  cartCount: number
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF3B21' : '#9A9A96'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF3B21' : '#9A9A96'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function CartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF3B21' : '#9A9A96'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function OrdersIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF3B21' : '#9A9A96'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#FF3B21' : '#9A9A96'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

const tabs: { id: NavTab; label: string; Icon: (props: { active: boolean }) => JSX.Element }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'search', label: 'Search', Icon: SearchIcon },
  { id: 'cart', label: 'Cart', Icon: CartIcon },
  { id: 'orders', label: 'Orders', Icon: OrdersIcon },
  { id: 'profile', label: 'Me', Icon: ProfileIcon },
]

export default function BottomNav({ activeTab, onTabChange, cartCount }: BottomNavProps) {
  return (
    <div className="shrink-0 bg-surface border-t border-rule">
      <div className="flex">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-1"
          >
            <div className="relative">
              <Icon active={activeTab === id} />
              {id === 'cart' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-brand text-white text-[9px] font-display font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span
              style={{ fontSize: 10 }}
              className={`font-body font-medium leading-none ${activeTab === id ? 'text-brand' : 'text-ink-3'}`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
