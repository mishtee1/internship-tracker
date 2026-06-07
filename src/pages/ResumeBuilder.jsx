import { useState } from 'react'
import useProfileStore from '../store/useProfileStore'
import { generateResume } from '../hooks/useAI'

export default function ResumeBuilder() {
  const { profile, projects, skills } = useProfileStore()
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const canGenerate = role.trim() && projects.length > 0

  const generate = async () => {
    if (!canGenerate) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const data = await generateResume(profile, projects, skills, role, company)
      setResult(data)
    } catch (e) {
      setError('Something went wrong. Check your API key and make sure your profile has projects.')
    }
    setLoading(false)
  }

  const downloadResume = () => {
    const el = document.getElementById('resume-preview')
    if (!el) return
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume - ${role}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Georgia,serif;font-size:12px;line-height:1.6;color:#111;padding:40px;max-width:800px;margin:0 auto}
      .name{font-size:24px;font-weight:700}
      .contact{font-size:11px;color:#555;margin-top:3px}
      hr{border:none;border-top:2px solid #111;margin:10px 0 8px}
      .section{margin-bottom:14px}
      .section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid #ddd;padding-bottom:3px;margin-bottom:8px}
      .entry{margin-bottom:8px}
      .entry-header{display:flex;justify-content:space-between}
      .entry-title{font-weight:700;font-size:12px}
      .entry-sub{font-size:11px;color:#555;font-style:italic;margin-top:1px}
      .entry-detail{font-size:11px;color:#555}
      .entry-honors{font-size:11px;color:#444;font-weight:700}
      .bullet{font-size:11px;padding-left:14px;position:relative;margin-top:3px}
      .bullet::before{content:"•";position:absolute;left:0}
      .skills-wrap{display:flex;flex-wrap:wrap;gap:4px}
      .skill{font-size:11px;background:#f3f3f3;padding:2px 8px;border-radius:3px}
      .title-line{text-align:center;font-size:13px;font-weight:700;color:#444;margin-bottom:10px;letter-spacing:.03em}
    </style>
    </head><body>${el.innerHTML}</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `resume_${role.replace(/\s+/g, '_').toLowerCase()}.html`
    a.click()
  }

  // Get educations — support both new multi-edu format and legacy single
  const educations = profile.educations?.length
    ? profile.educations
    : [{ university: profile.university, degree: profile.degree, major: '', minor: '', doubleMajor: '', grad: profile.grad, gpa: profile.gpa, honors: '', coursework: [], expected: false }]

  return (
    <div style={{ padding: 28, maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f4' }}>Resume AI</h1>
        <p style={{ fontSize: 13, color: '#5a5a6e', marginTop: 3 }}>AI picks your best 3 projects for any role and writes your resume</p>
      </div>

      {/* Generator card */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-sparkles" style={{ color: '#8b7cf8', fontSize: 16 }} /> AI resume generator
        </div>
        <div style={{ fontSize: 12, color: '#5a5a6e', marginBottom: 16 }}>Scores all your projects and picks the top 3 for the role</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Role you're applying for *</label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Software Engineer Intern, UX Design Intern..."
              style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Company (optional)</label>
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Google, Figma, Meta..."
              style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}
            />
          </div>
        </div>

        <button onClick={generate} disabled={!canGenerate || loading} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: canGenerate && !loading ? '#8b7cf8' : '#26262d',
          color: canGenerate && !loading ? '#fff' : '#5a5a6e',
          border: 'none', borderRadius: 10, padding: '10px 18px',
          fontSize: 13, fontWeight: 500, cursor: canGenerate && !loading ? 'pointer' : 'not-allowed',
        }}>
          {loading
            ? <><i className="ti ti-loader-2" style={{ fontSize: 15, animation: 'spin 1s linear infinite' }} /> Generating resume...</>
            : <><i className="ti ti-wand" style={{ fontSize: 15 }} /> Generate tailored resume</>
          }
        </button>

        {projects.length === 0 && (
          <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 10 }}>
            <i className="ti ti-alert-circle" style={{ fontSize: 13 }} /> Add projects in the Profile tab first
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#f87171', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          {/* Project score cards */}
          <div style={{ fontSize: 12, fontWeight: 500, color: '#9191a4', marginBottom: 10 }}>Top 3 projects selected by AI</div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            {(result.selectedProjects || []).map((proj, i) => (
              <div key={i} style={{ flex: 1, background: '#17171a', border: '1px solid #2e2e38', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ fontSize: 10, color: '#8b7cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>#{i + 1} match</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#f0f0f4', marginBottom: 2 }}>{proj.name}</div>
                <div style={{ fontSize: 11, color: proj.score >= 75 ? '#4ade80' : proj.score >= 50 ? '#f59e0b' : '#9191a4' }}>
                  {proj.score}/100 — {proj.scoreReason}
                </div>
                <div style={{ height: 3, background: '#26262d', borderRadius: 2, marginTop: 7, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${proj.score}%`, background: proj.score >= 75 ? '#4ade80' : proj.score >= 50 ? '#f59e0b' : '#9191a4', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Resume preview — white paper look */}
          <div id="resume-preview" style={{ background: '#fff', color: '#111', borderRadius: 12, padding: '32px 36px', fontFamily: 'Georgia, serif', fontSize: 12, lineHeight: 1.6 }}>

            {/* Header */}
            <div style={{ fontSize: 24, fontWeight: 700, color: '#111' }}>{profile.name || 'Your Name'}</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
              {[
                profile.email,
                profile.phone,
                profile.location,
                profile.linkedin && `linkedin.com/in/${profile.linkedin}`,
                profile.github && `github.com/${profile.github}`
              ].filter(Boolean).join(' · ')}
            </div>
            <hr style={{ border: 'none', borderTop: '2px solid #111', margin: '10px 0 8px' }} />

            {/* Tailored title */}
            {result.tailoredTitle && (
              <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#444', marginBottom: 12, letterSpacing: '0.03em' }}>
                {result.tailoredTitle}
              </div>
            )}

            {/* Summary */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #ddd', paddingBottom: 3, marginBottom: 8 }}>Summary</div>
              <div style={{ fontSize: 12, color: '#333' }}>{result.summary}</div>
            </div>

            {/* Education — all entries with every field */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #ddd', paddingBottom: 3, marginBottom: 8 }}>Education</div>
              {educations.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>

                  {/* School + graduation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 12 }}>{edu.university}</span>
                    <span style={{ fontSize: 11, color: '#666' }}>{edu.expected ? 'Expected ' : ''}{edu.grad}</span>
                  </div>

                  {/* Degree + major + double major */}
                  {(edu.degree || edu.major) && (
                    <div style={{ fontSize: 11, color: '#555', fontStyle: 'italic', marginTop: 1 }}>
                      {edu.degree}{edu.major ? ' in ' + edu.major : ''}
                      {edu.doubleMajor ? ' & ' + edu.doubleMajor : ''}
                    </div>
                  )}

                  {/* Minor */}
                  {edu.minor ? (
                    <div style={{ fontSize: 11, color: '#555' }}>Minor: {edu.minor}</div>
                  ) : null}

                  {/* GPA */}
                  {edu.gpa ? (
                    <div style={{ fontSize: 11, color: '#555' }}>GPA: {edu.gpa}</div>
                  ) : null}

                  {/* Honors */}
                  {edu.honors ? (
                    <div style={{ fontSize: 11, color: '#333', fontWeight: 700 }}>{edu.honors}</div>
                  ) : null}

                  {/* Relevant coursework */}
                  {edu.coursework?.length > 0 ? (
                    <div style={{ fontSize: 11, color: '#555', marginTop: 3 }}>
                      <span style={{ fontWeight: 700 }}>Relevant coursework: </span>
                      {Array.isArray(edu.coursework) ? edu.coursework.join(' · ') : edu.coursework}
                    </div>
                  ) : null}

                </div>
              ))}
            </div>

            {/* Projects */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #ddd', paddingBottom: 3, marginBottom: 8 }}>Projects</div>
              {(result.selectedProjects || []).map((proj, i) => {
                const orig = projects.find(p => p.id === proj.id) || {}
                return (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 12 }}>{proj.name}</span>
                      <span style={{ fontSize: 10, color: '#888' }}>{(orig.tech || []).slice(0, 4).join(', ')}</span>
                    </div>
                    {(proj.bullets || []).map((b, j) => (
                      <div key={j} style={{ fontSize: 11, paddingLeft: 14, position: 'relative', marginTop: 3, color: '#333' }}>
                        <span style={{ position: 'absolute', left: 0 }}>•</span>{b}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>

            {/* Skills */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #ddd', paddingBottom: 3, marginBottom: 8 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {(result.highlightedSkills || skills).map(s => (
                  <span key={s} style={{ fontSize: 11, background: '#f3f3f3', padding: '2px 8px', borderRadius: 3, color: '#333' }}>{s}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Download button */}
          <button onClick={downloadResume} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.25)', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginTop: 14 }}>
            <i className="ti ti-download" style={{ fontSize: 15 }} /> Download resume
          </button>
          <div style={{ fontSize: 11, color: '#5a5a6e', marginTop: 6 }}>
            Open the downloaded file in Chrome → File → Print → Save as PDF
          </div>

        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}