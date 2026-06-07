import { useState } from 'react'
import useAppStore from '../store/useAppStore'
import AppModal from '../components/tracker/AppModal'
import AppCard from '../components/tracker/AppCard'
import KanbanBoard from '../components/tracker/KanbanBoard'

const STATUSES = ['wishlist','applied','interview','offer','rejected']
const STATUS_COLORS = {
  wishlist:'#8b7cf8', applied:'#60a5fa',
  interview:'#f59e0b', offer:'#4ade80', rejected:'#f87171'
}

export default function Applications() {
  const apps = useAppStore(s => s.apps)
  const [view, setView] = useState('list')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editApp, setEditApp] = useState(null)

  const filtered = apps.filter(a => {
    const matchStatus = filter === 'all' || a.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || a.company?.toLowerCase().includes(q) || a.role?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const openAdd = () => { setEditApp(null); setShowModal(true) }
  const openEdit = (app) => { setEditApp(app); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditApp(null) }

  return (
    <div style={{ padding: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f4' }}>Applications</h1>
          <p style={{ fontSize: 13, color: '#5a5a6e', marginTop: 3 }}>{apps.length} total · {apps.filter(a=>a.status==='interview').length} interviews · {apps.filter(a=>a.status==='offer').length} offers</p>
        </div>
        <button onClick={openAdd} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#8b7cf8', color: '#fff', border: 'none',
          borderRadius: 10, padding: '9px 16px', fontSize: 13,
          fontWeight: 500, cursor: 'pointer',
        }}>
          <i className="ti ti-plus" style={{ fontSize: 15 }} /> Add application
        </button>
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <i className="ti ti-search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#5a5a6e', fontSize: 14 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search companies or roles..."
            style={{
              width: '100%', background: '#17171a', border: '1px solid #2e2e38',
              borderRadius: 10, padding: '8px 12px 8px 32px', fontSize: 13,
              color: '#f0f0f4', outline: 'none',
            }}
          />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: '#17171a', border: '1px solid #2e2e38', borderRadius: 10, padding: 3, gap: 2 }}>
          {[['list','ti-layout-list'],['kanban','ti-layout-kanban']].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? '#26262d' : 'none',
              border: 'none', borderRadius: 8, padding: '6px 12px',
              color: view === v ? '#f0f0f4' : '#5a5a6e', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
            }}>
              <i className={`ti ${icon}`} style={{ fontSize: 14 }} />
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '5px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
          border: `1px solid ${filter==='all' ? '#8b7cf8' : '#2e2e38'}`,
          background: filter==='all' ? 'rgba(139,124,248,0.12)' : 'none',
          color: filter==='all' ? '#8b7cf8' : '#9191a4',
        }}>
          All <span style={{ opacity: 0.6 }}>{apps.length}</span>
        </button>
        {STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '5px 14px', borderRadius: 100, fontSize: 12, cursor: 'pointer',
            border: `1px solid ${filter===s ? STATUS_COLORS[s] : '#2e2e38'}`,
            background: filter===s ? `${STATUS_COLORS[s]}20` : 'none',
            color: filter===s ? STATUS_COLORS[s] : '#9191a4',
            textTransform: 'capitalize',
          }}>
            {s} <span style={{ opacity: 0.6 }}>{apps.filter(a=>a.status===s).length}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'list' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#5a5a6e', fontSize: 13 }}>
              <i className="ti ti-inbox" style={{ fontSize: 32, display: 'block', marginBottom: 10 }} />
              {apps.length === 0 ? 'No applications yet — add your first one!' : 'No matches found'}
            </div>
          ) : (
            filtered.map(app => <AppCard key={app.id} app={app} onEdit={openEdit} />)
          )}
        </div>
      ) : (
        <KanbanBoard apps={apps} onEdit={openEdit} />
      )}

      {showModal && <AppModal app={editApp} onClose={closeModal} />}
    </div>
  )
}