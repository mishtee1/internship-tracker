import { useState, useEffect } from 'react'
import { initGoogle, signIn, signOut, isSignedIn, createCalendarEvent, getUpcomingEvents } from '../hooks/useCalendar'
import useAppStore from '../store/useAppStore'

function fmtDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Calendar() {
  const apps = useAppStore(s => s.apps)
  const interviews = apps.filter(a => a.status === 'interview')

  const [signedIn, setSignedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedApp, setSelectedApp] = useState(null)
  const [form, setForm] = useState({ date: '', time: '10:00', duration: '60', notes: '' })

  useEffect(() => {
    initGoogle()
  }, [])

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await signIn()
      setSignedIn(true)
      const ev = await getUpcomingEvents()
      setEvents(ev)
    } catch (e) {
      setError('Sign in failed. Make sure popups are allowed.')
    }
    setLoading(false)
  }

  const handleSignOut = () => {
    signOut()
    setSignedIn(false)
    setEvents([])
  }

  const openForm = (app) => {
    setSelectedApp(app)
    setForm({ date: app.deadline || '', time: '10:00', duration: '60', notes: '' })
    setShowForm(true)
  }

  const addToCalendar = async () => {
    if (!selectedApp || !form.date) return
    setLoading(true)
    setError(null)
    try {
      const start = new Date(`${form.date}T${form.time}:00`)
      const end = new Date(start.getTime() + parseInt(form.duration) * 60000)
      const event = {
        summary: `Interview — ${selectedApp.company} (${selectedApp.role})`,
        description: `InternPath interview reminder\n${form.notes}`,
        start: { dateTime: start.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: end.toISOString(), timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 30 },
          ],
        },
      }
      await createCalendarEvent(event)
      const ev = await getUpcomingEvents()
      setEvents(ev)
      setShowForm(false)
      setSuccess(`Interview with ${selectedApp.company} added to Google Calendar!`)
      setTimeout(() => setSuccess(null), 4000)
    } catch (e) {
      setError('Failed to add event. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 28, maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f4' }}>Calendar</h1>
        <p style={{ fontSize: 13, color: '#5a5a6e', marginTop: 3 }}>Sync your interviews with Google Calendar</p>
      </div>

      {/* Sign in card */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="ti ti-calendar" style={{ color: signedIn ? '#4ade80' : '#8b7cf8', fontSize: 18 }} />
            {signedIn ? 'Connected to Google Calendar' : 'Connect Google Calendar'}
          </div>
          <div style={{ fontSize: 12, color: '#5a5a6e', marginTop: 3 }}>
            {signedIn ? 'Your interviews will sync automatically' : 'Sign in to add interviews as calendar events'}
          </div>
        </div>
        <button
          onClick={signedIn ? handleSignOut : handleSignIn}
          disabled={loading}
          style={{
            background: signedIn ? 'rgba(248,113,113,0.1)' : '#8b7cf8',
            color: signedIn ? '#f87171' : '#fff',
            border: signedIn ? '1px solid rgba(248,113,113,0.2)' : 'none',
            borderRadius: 10, padding: '8px 16px', fontSize: 13,
            fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
          {loading
            ? <><i className="ti ti-loader-2" style={{ fontSize: 14, animation: 'spin 1s linear infinite' }} /> Loading...</>
            : signedIn
              ? <><i className="ti ti-logout" style={{ fontSize: 14 }} /> Disconnect</>
              : <><i className="ti ti-brand-google" style={{ fontSize: 14 }} /> Sign in with Google</>
          }
        </button>
      </div>

      {/* Error / success */}
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f87171', marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#4ade80', marginBottom: 16 }}>
          <i className="ti ti-check" style={{ fontSize: 13 }} /> {success}
        </div>
      )}

      {/* Interviews to schedule */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#9191a4', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-messages" style={{ color: '#f59e0b' }} /> Interviews to schedule ({interviews.length})
        </div>
        {interviews.length === 0 ? (
          <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 12, padding: '32px', textAlign: 'center', color: '#5a5a6e', fontSize: 13 }}>
            <i className="ti ti-calendar-off" style={{ fontSize: 28, display: 'block', marginBottom: 10 }} />
            No interviews yet — mark applications as "Interview" to see them here
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {interviews.map(app => (
              <div key={app.id} style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4' }}>{app.company}</div>
                  <div style={{ fontSize: 12, color: '#5a5a6e', marginTop: 2 }}>{app.role}</div>
                </div>
                <button
                  onClick={() => signedIn ? openForm(app) : setError('Please sign in with Google first')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'rgba(139,124,248,0.12)', color: '#8b7cf8',
                    border: '1px solid rgba(139,124,248,0.25)', borderRadius: 10,
                    padding: '7px 14px', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                  }}>
                  <i className="ti ti-calendar-plus" style={{ fontSize: 14 }} /> Add to Calendar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event form modal */}
      {showForm && selectedApp && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60, zIndex: 50 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#17171a', border: '1px solid #3a3a46', borderRadius: 16, padding: 28, width: 420 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#f0f0f4', marginBottom: 20 }}>
              Schedule interview — {selectedApp.company}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Time</label>
                <input type="time" value={form.time} onChange={e => setForm(f => ({...f, time: e.target.value}))}
                  style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Duration (mins)</label>
                <select value={form.duration} onChange={e => setForm(f => ({...f, duration: e.target.value}))}
                  style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}>
                  <option value="30">30 min</option>
                  <option value="45">45 min</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Notes (optional)</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                placeholder="Interview format, interviewer name, meeting link..."
                style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none', resize: 'vertical', height: 72, fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid #3a3a46', borderRadius: 10, padding: '8px 16px', fontSize: 13, color: '#9191a4', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addToCalendar} disabled={!form.date || loading} style={{ background: '#8b7cf8', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, color: '#fff', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <i className="ti ti-calendar-plus" style={{ fontSize: 14 }} /> Add to Google Calendar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming events from Google */}
      {signedIn && events.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#9191a4', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-calendar-event" style={{ color: '#60a5fa' }} /> Upcoming events from Google Calendar
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {events.map(ev => (
              <div key={ev.id} style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 12, padding: '12px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4' }}>{ev.summary}</div>
                <div style={{ fontSize: 12, color: '#5a5a6e', marginTop: 2 }}>
                  {fmtDate(ev.start?.dateTime || ev.start?.date)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}