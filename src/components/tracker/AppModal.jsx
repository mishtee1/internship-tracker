import { useState } from 'react'
import useAppStore from '../../store/useAppStore'

const STATUSES = ['wishlist','applied','interview','offer','rejected']

export default function AppModal({ app, onClose }) {
  const { addApp, updateApp } = useAppStore()
  const [form, setForm] = useState({
    company:  app?.company  || '',
    role:     app?.role     || '',
    status:   app?.status   || 'applied',
    deadline: app?.deadline || '',
    link:     app?.link     || '',
    notes:    app?.notes    || '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.company.trim() || !form.role.trim()) return
    if (app) updateApp(app.id, form)
    else addApp(form)
    onClose()
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: 60, zIndex: 50,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: '#17171a', border: '1px solid #3a3a46',
        borderRadius: 16, padding: 28, width: 460, maxWidth: 'calc(100vw - 32px)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#f0f0f4' }}>
            {app ? 'Edit application' : 'New application'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a5a6e', cursor: 'pointer', fontSize: 18 }}>
            <i className="ti ti-x" />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Field label="Company *" value={form.company} onChange={v => set('company', v)} placeholder="Google, Meta..." />
          <Field label="Role *" value={form.role} onChange={v => set('role', v)} placeholder="SWE Intern..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} style={{
              width: '100%', background: '#1e1e23', border: '1px solid #2e2e38',
              borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none',
            }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <Field label="Deadline" value={form.deadline} onChange={v => set('deadline', v)} type="date" />
        </div>
        <div style={{ marginBottom: 12 }}>
          <Field label="Job posting link" value={form.link} onChange={v => set('link', v)} placeholder="https://..." />
        </div>
        <div style={{ marginBottom: 22 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Notes</label>
          <textarea value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Recruiter name, salary, interview rounds..."
            style={{
              width: '100%', background: '#1e1e23', border: '1px solid #2e2e38',
              borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4',
              outline: 'none', resize: 'vertical', height: 80, fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            background: 'none', border: '1px solid #3a3a46', borderRadius: 10,
            padding: '8px 16px', fontSize: 13, color: '#9191a4', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={save} style={{
            background: '#8b7cf8', border: 'none', borderRadius: 10,
            padding: '8px 18px', fontSize: 13, color: '#fff', fontWeight: 500, cursor: 'pointer',
          }}>{app ? 'Save changes' : 'Add application'}</button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{
          width: '100%', background: '#1e1e23', border: '1px solid #2e2e38',
          borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none',
        }}
      />
    </div>
  )
}