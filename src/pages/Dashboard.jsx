import useAppStore from '../store/useAppStore'

const STATUSES = ['wishlist','applied','interview','offer','rejected']
const COLORS = { wishlist:'#8b7cf8', applied:'#60a5fa', interview:'#f59e0b', offer:'#4ade80', rejected:'#f87171' }

export default function Dashboard() {
  const apps = useAppStore(s => s.apps)
  const counts = {}
  STATUSES.forEach(s => counts[s] = apps.filter(a => a.status === s).length)

  const stats = [
    { label: 'Applied',    value: counts.applied,   color: '#60a5fa', icon: 'ti-send'     },
    { label: 'Interviews', value: counts.interview,  color: '#f59e0b', icon: 'ti-messages' },
    { label: 'Offers',     value: counts.offer,      color: '#4ade80', icon: 'ti-trophy'   },
    { label: 'Rejected',   value: counts.rejected,   color: '#f87171', icon: 'ti-x'        },
  ]

  return (
    <div style={{ padding: '28px 28px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f4' }}>Dashboard</h1>
        <p style={{ fontSize: 13, color: '#5a5a6e', marginTop: 3 }}>
          {apps.length} application{apps.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: '#17171a', border: '1px solid #2e2e38',
            borderRadius: 12, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 11, color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <i className={`ti ${s.icon}`} style={{ fontSize: 14 }} />{s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline summary */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px' }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#9191a4', marginBottom: 16 }}>Pipeline overview</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {STATUSES.map(s => (
            <div key={s} style={{ flex: 1, background: '#1e1e23', borderRadius: 10, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, color: COLORS[s], textTransform: 'capitalize', fontWeight: 500, marginBottom: 8 }}>{s}</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: '#f0f0f4' }}>{counts[s]}</div>
            </div>
          ))}
        </div>
        {apps.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#5a5a6e', fontSize: 13 }}>
            No applications yet — go to Applications to add your first one
          </div>
        )}
      </div>
    </div>
  )
}