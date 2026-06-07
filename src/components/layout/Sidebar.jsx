import { NavLink, useLocation } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'

const navItems = [
  { path: '/dashboard',    icon: 'ti-layout-dashboard', label: 'Dashboard'    },
  { path: '/applications', icon: 'ti-briefcase',        label: 'Applications' },
  { path: '/resume',       icon: 'ti-file-cv',          label: 'Resume AI'    },
  { path: '/calendar',     icon: 'ti-calendar',         label: 'Calendar'     },
  { path: '/profile',      icon: 'ti-user',             label: 'Profile'      },
]

const STATUSES = ['wishlist','applied','interview','offer','rejected']
const STATUS_COLORS = {
  wishlist:  '#8b7cf8',
  applied:   '#60a5fa',
  interview: '#f59e0b',
  offer:     '#4ade80',
  rejected:  '#f87171',
}

export default function Sidebar() {
  const apps = useAppStore(s => s.apps)
  const counts = {}
  STATUSES.forEach(s => counts[s] = apps.filter(a => a.status === s).length)

  const total = apps.length
  const score = total === 0 ? 0 : Math.min(100,
    Math.round((
      counts.applied   * 20 +
      counts.interview * 50 +
      counts.offer     * 100 +
      counts.rejected  * 5 +
      counts.wishlist  * 2
    ) / Math.max(total * 20, 1) * 20)
  )

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#17171a',
      borderRight: '1px solid #2e2e38', display: 'flex',
      flexDirection: 'column', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px', borderBottom: '1px solid #2e2e38' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: '#8b7cf8',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 16, color: '#fff',
          }}>
            <i className="ti ti-rocket" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f4' }}>InternPath</div>
            <div style={{ fontSize: 11, color: '#5a5a6e' }}>Application tracker</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 500, color: '#5a5a6e', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px 8px' }}>
          Menu
        </div>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '8px 10px', borderRadius: 8, marginBottom: 2,
            fontSize: 13, textDecoration: 'none', fontWeight: 400,
            background: isActive ? 'rgba(139,124,248,0.12)' : 'transparent',
            color: isActive ? '#8b7cf8' : '#9191a4',
          })}>
            <i className={`ti ${item.icon}`} style={{ fontSize: 16 }} />
            {item.label}
            {item.path === '/applications' && total > 0 && (
              <span style={{
                marginLeft: 'auto', fontSize: 11, background: '#26262d',
                color: '#5a5a6e', padding: '1px 7px', borderRadius: 100,
              }}>{total}</span>
            )}
          </NavLink>
        ))}

        {/* Status counts */}
        <div style={{ fontSize: 10, fontWeight: 500, color: '#5a5a6e', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '16px 10px 8px' }}>
          By Status
        </div>
        {STATUSES.map(s => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 10px', fontSize: 12, color: '#9191a4',
          }}>
            <i className="ti ti-circle" style={{ fontSize: 10, color: STATUS_COLORS[s] }} />
            <span style={{ textTransform: 'capitalize' }}>{s}</span>
            <span style={{
              marginLeft: 'auto', fontSize: 11, background: '#26262d',
              color: '#5a5a6e', padding: '1px 7px', borderRadius: 100,
            }}>{counts[s]}</span>
          </div>
        ))}
      </nav>

      {/* Health score */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid #2e2e38' }}>
        <div style={{ fontSize: 11, color: '#5a5a6e', marginBottom: 6 }}>Application health</div>
        <div style={{ height: 4, background: '#26262d', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${score}%`, background: '#8b7cf8', borderRadius: 2, transition: 'width 0.6s ease' }} />
        </div>
        <div style={{ fontSize: 12, color: '#8b7cf8', marginTop: 5, fontWeight: 500 }}>{score}/100</div>
      </div>
    </aside>
  )
}