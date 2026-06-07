import useAppStore from '../../store/useAppStore'

const STATUS_COLORS = {
  wishlist:'#8b7cf8', applied:'#60a5fa',
  interview:'#f59e0b', offer:'#4ade80', rejected:'#f87171'
}
const STATUS_BG = {
  wishlist:'rgba(139,124,248,0.15)', applied:'rgba(96,165,250,0.15)',
  interview:'rgba(245,158,11,0.15)', offer:'rgba(74,222,128,0.15)',
  rejected:'rgba(248,113,113,0.15)'
}
const STATUSES = ['wishlist','applied','interview','offer','rejected']

function daysUntil(dl) {
  if (!dl) return null
  const diff = (new Date(dl + 'T00:00:00') - new Date()) / (1000*60*60*24)
  return Math.ceil(diff)
}
function fmtDate(s) {
  if (!s) return null
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
}
function initials(name) {
  return (name || '?').split(' ').slice(0,2).map(w => w[0] || '').join('').toUpperCase()
}

export default function AppCard({ app, onEdit }) {
  const { updateApp, deleteApp } = useAppStore()
  const du = daysUntil(app.deadline)
  const urgentColor = du !== null && du < 0 ? '#f87171' : du !== null && du <= 7 ? '#f59e0b' : '#5a5a6e'
  const deadlineLabel = du === null ? null : du < 0 ? `${Math.abs(du)}d overdue` : du === 0 ? 'Due today' : du === 1 ? 'Due tomorrow' : `${du}d left`

  const cycleStatus = (e) => {
    e.stopPropagation()
    const i = STATUSES.indexOf(app.status)
    updateApp(app.id, { status: STATUSES[(i + 1) % STATUSES.length] })
  }

  return (
    <div onClick={() => onEdit(app)} style={{
      background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14,
      padding: '14px 16px', display: 'grid',
      gridTemplateColumns: '38px 1fr auto', gap: 12,
      alignItems: 'center', cursor: 'pointer', transition: 'border-color 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = '#3a3a46'}
    onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2e38'}
    >
      {/* Avatar */}
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: STATUS_BG[app.status], color: STATUS_COLORS[app.status],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 500, flexShrink: 0,
      }}>
        {initials(app.company)}
      </div>

      {/* Body */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: '#f0f0f4' }}>{app.company}</span>
          {app.link && (
            <a href={app.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ color: '#5a5a6e', fontSize: 13 }}>
              <i className="ti ti-external-link" />
            </a>
          )}
        </div>
        <div style={{ fontSize: 12, color: '#5a5a6e', marginBottom: 7 }}>{app.role}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={cycleStatus} style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 100,
            background: STATUS_BG[app.status], color: STATUS_COLORS[app.status],
            border: 'none', cursor: 'pointer', fontWeight: 500, textTransform: 'capitalize',
          }}>
            {app.status}
          </button>
          {deadlineLabel && (
            <span style={{ fontSize: 11, color: urgentColor, display: 'flex', alignItems: 'center', gap: 3 }}>
              <i className="ti ti-clock" style={{ fontSize: 11 }} />{deadlineLabel}
            </span>
          )}
          {app.notes && <i className="ti ti-notes" style={{ fontSize: 12, color: '#5a5a6e' }} />}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={e => { e.stopPropagation(); onEdit(app) }} style={{
            background: 'none', border: 'none', color: '#5a5a6e',
            cursor: 'pointer', padding: 4, borderRadius: 6, fontSize: 15,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0f0f4'}
          onMouseLeave={e => e.currentTarget.style.color = '#5a5a6e'}>
            <i className="ti ti-edit" />
          </button>
          <button onClick={e => { e.stopPropagation(); deleteApp(app.id) }} style={{
            background: 'none', border: 'none', color: '#5a5a6e',
            cursor: 'pointer', padding: 4, borderRadius: 6, fontSize: 15,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
          onMouseLeave={e => e.currentTarget.style.color = '#5a5a6e'}>
            <i className="ti ti-trash" />
          </button>
        </div>
        {app.deadline && (
          <span style={{ fontSize: 11, color: '#5a5a6e' }}>{fmtDate(app.deadline)}</span>
        )}
      </div>
    </div>
  )
}