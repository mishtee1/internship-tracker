const STATUSES = ['wishlist','applied','interview','offer','rejected']
const STATUS_COLORS = {
  wishlist:'#8b7cf8', applied:'#60a5fa',
  interview:'#f59e0b', offer:'#4ade80', rejected:'#f87171'
}
const STATUS_BG = {
  wishlist:'rgba(139,124,248,0.15)', applied:'rgba(96,165,250,0.15)',
  interview:'rgba(245,158,11,0.15)', offer:'rgba(74,222,128,0.15)',
  rejected:'rgba(248,113,113,0.15)'
}

function fmtDate(s) {
  if (!s) return null
  return new Date(s + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
}
function daysUntil(dl) {
  if (!dl) return null
  return Math.ceil((new Date(dl + 'T00:00:00') - new Date()) / (1000*60*60*24))
}

export default function KanbanBoard({ apps, onEdit }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
      {STATUSES.map(s => {
        const col = apps.filter(a => a.status === s)
        return (
          <div key={s} style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: STATUS_COLORS[s] }}>{s}</span>
              <span style={{ fontSize: 11, background: '#26262d', color: '#5a5a6e', padding: '1px 7px', borderRadius: 100 }}>{col.length}</span>
            </div>
            {col.length === 0 && (
              <div style={{ fontSize: 11, color: '#5a5a6e', padding: '8px 0' }}>None yet</div>
            )}
            {col.map(a => {
              const du = daysUntil(a.deadline)
              const urgentColor = du !== null && du < 0 ? '#f87171' : du !== null && du <= 7 ? '#f59e0b' : '#5a5a6e'
              return (
                <div key={a.id} onClick={() => onEdit(a)} style={{
                  background: '#1e1e23', border: '1px solid #2e2e38',
                  borderRadius: 8, padding: '10px 12px', marginBottom: 7, cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#3a3a46'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#2e2e38'}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#f0f0f4', marginBottom: 2 }}>{a.company}</div>
                  <div style={{ fontSize: 11, color: '#5a5a6e', marginBottom: 6 }}>{a.role}</div>
                  {a.deadline && (
                    <div style={{ fontSize: 10, color: urgentColor, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <i className="ti ti-calendar" style={{ fontSize: 10 }} />{fmtDate(a.deadline)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}