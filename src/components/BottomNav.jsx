import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const TABS = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/calendar', label: 'Calendar', icon: 'cal' },
  { to: '/map', label: 'Map', icon: 'pin' },
  { to: '/rides', label: 'Rides', icon: 'car' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-3 left-3 right-3 mx-auto flex max-w-[456px] gap-0.5 rounded-[28px] bg-ink p-2 shadow-[0_12px_30px_rgba(22,24,29,0.25)]">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === '/'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center rounded-[20px] py-[7px] text-[10.5px] no-underline ${
              isActive ? 'bg-white/10 text-white' : 'text-[#9aa0ae]'
            }`
          }
        >
          <Icon name={t.icon} />
          <span className="mt-0.5">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
