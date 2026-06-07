import { useState } from 'react'
import useProfileStore from '../store/useProfileStore'

const CATEGORIES = ['software','design','data','research','business','hardware','other']

const DEFAULT_EDU = {
  university: '', degree: '', major: '', minor: '', doubleMajor: '',
  grad: '', gpa: '', honors: '', coursework: [], expected: false,
}

export default function Profile() {
  const { profile, projects, skills, updateProfile, addProject, updateProject, deleteProject, setSkills } = useProfileStore()

  const [educations, setEducations] = useState(
    profile.educations?.length
      ? profile.educations
      : [{ ...DEFAULT_EDU, university: profile.university || '', degree: profile.degree || '', grad: profile.grad || '', gpa: profile.gpa || '' }]
  )

  const [skillInput, setSkillInput] = useState('')
  const [showAddProj, setShowAddProj] = useState(false)
  const [editProjId, setEditProjId] = useState(null)
  const [projForm, setProjForm] = useState({ name:'', desc:'', tech:'', impact:'', category:'software' })
  const [saved, setSaved] = useState(false)

  const saveProfile = () => {
    const fields = ['name','email','phone','location','linkedin','github']
    const updates = {}
    fields.forEach(k => {
      const el = document.getElementById('pf-' + k)
      if (el) updates[k] = el.value
    })
    updates.educations = educations
    updates.university = educations[0]?.university || ''
    updates.degree = educations[0]?.degree || ''
    updates.grad = educations[0]?.grad || ''
    updates.gpa = educations[0]?.gpa || ''
    updateProfile(updates)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateEdu = (i, field, val) => {
    setEducations(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e))
  }

  const addEducation = () => setEducations(prev => [...prev, { ...DEFAULT_EDU }])
  const removeEducation = (i) => setEducations(prev => prev.filter((_, idx) => idx !== i))

  const addSkill = () => {
    const val = skillInput.trim()
    if (val && !skills.includes(val)) setSkills([...skills, val])
    setSkillInput('')
  }

  const openAddProj = () => {
    setEditProjId(null)
    setProjForm({ name:'', desc:'', tech:'', impact:'', category:'software' })
    setShowAddProj(true)
  }

  const openEditProj = (p) => {
    setEditProjId(p.id)
    setProjForm({ name: p.name, desc: p.desc, tech: (p.tech||[]).join(', '), impact: p.impact||'', category: p.category||'software' })
    setShowAddProj(true)
  }

  const saveProj = () => {
    if (!projForm.name.trim() || !projForm.desc.trim()) return
    const data = { ...projForm, tech: projForm.tech.split(',').map(t => t.trim()).filter(Boolean) }
    if (editProjId) updateProject(editProjId, data)
    else addProject(data)
    setShowAddProj(false)
    setEditProjId(null)
  }

  const PROJ_COLORS = {
    software:'#8b7cf8', design:'#2dd4bf', data:'#f59e0b',
    research:'#60a5fa', business:'#4ade80', hardware:'#f87171', other:'#9191a4'
  }

  return (
    <div style={{ padding: 28, maxWidth: 800 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: '#f0f0f4' }}>Profile</h1>
        <p style={{ fontSize: 13, color: '#5a5a6e', marginTop: 3 }}>Your info used to generate tailored resumes</p>
      </div>

      {/* Personal info */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-user" style={{ color: '#8b7cf8' }} /> Personal info
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Field id="pf-name"     label="Full name"  defaultValue={profile.name}     placeholder="Jane Doe" />
          <Field id="pf-email"    label="Email"      defaultValue={profile.email}    placeholder="jane@email.com" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <Field id="pf-phone"    label="Phone"           defaultValue={profile.phone}    placeholder="(555) 000-0000" />
          <Field id="pf-location" label="Location"        defaultValue={profile.location} placeholder="New Jersey, NJ" />
          <Field id="pf-linkedin" label="LinkedIn handle" defaultValue={profile.linkedin} placeholder="janedoe" />
        </div>
        <Field id="pf-github" label="GitHub handle" defaultValue={profile.github} placeholder="janedoe" />
      </div>

      {/* Education */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', display: 'flex', alignItems: 'center', gap: 7 }}>
            <i className="ti ti-school" style={{ color: '#8b7cf8' }} /> Education
          </div>
          <button onClick={addEducation} style={{ fontSize: 12, background: 'rgba(139,124,248,0.12)', border: '1px solid rgba(139,124,248,0.25)', borderRadius: 8, padding: '5px 12px', color: '#8b7cf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <i className="ti ti-plus" style={{ fontSize: 12 }} /> Add school (transfer)
          </button>
        </div>

        {educations.map((edu, i) => (
          <div key={i} style={{ background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: '#8b7cf8', fontWeight: 500 }}>
                {educations.length > 1 ? (i === 0 ? 'Current school' : 'Previous school ' + i) : 'School'}
              </span>
              {educations.length > 1 && (
                <button onClick={() => removeEducation(i)} style={{ background: 'none', border: 'none', color: '#5a5a6e', cursor: 'pointer', fontSize: 13 }}>
                  <i className="ti ti-trash" />
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <EduField label="University / College" value={edu.university} onChange={v => updateEdu(i,'university',v)} placeholder="Rutgers University" />
              <EduField label="Degree type" value={edu.degree} onChange={v => updateEdu(i,'degree',v)} placeholder="B.S., B.A., A.S." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <EduField label="Major" value={edu.major} onChange={v => updateEdu(i,'major',v)} placeholder="Computer Science" />
              <EduField label="Double major (optional)" value={edu.doubleMajor} onChange={v => updateEdu(i,'doubleMajor',v)} placeholder="Mathematics" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <EduField label="Minor (optional)" value={edu.minor} onChange={v => updateEdu(i,'minor',v)} placeholder="Business, Design..." />
              <EduField label="GPA (optional)" value={edu.gpa} onChange={v => updateEdu(i,'gpa',v)} placeholder="3.8 / 4.0" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Graduation</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    value={edu.grad}
                    onChange={e => updateEdu(i,'grad',e.target.value)}
                    placeholder="May 2028"
                    style={{ flex: 1, background: '#26262d', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#5a5a6e', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <input type="checkbox" checked={!!edu.expected} onChange={e => updateEdu(i,'expected',e.target.checked)} style={{ accentColor: '#8b7cf8' }} />
                    Expected
                  </label>
                </div>
              </div>
              <EduField label="Honors / Awards (optional)" value={edu.honors} onChange={v => updateEdu(i,'honors',v)} placeholder="Dean's List, Cum Laude..." />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Relevant coursework (optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {(edu.coursework || []).map((c, ci) => (
                  <span key={ci} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 100, background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)', color: '#2dd4bf', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {c}
                    <button
                      onClick={() => updateEdu(i, 'coursework', (edu.coursework||[]).filter((_,x) => x !== ci))}
                      style={{ background: 'none', border: 'none', color: '#2dd4bf', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>
                      x
                    </button>
                  </span>
                ))}
                {(!edu.coursework || edu.coursework.length === 0) && (
                  <span style={{ fontSize: 12, color: '#5a5a6e' }}>No courses added yet</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  id={'course-input-' + i}
                  placeholder="Type a course and press Enter or Add..."
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = e.target.value.trim()
                      if (val) {
                        updateEdu(i, 'coursework', [...(edu.coursework || []), val])
                        e.target.value = ''
                      }
                    }
                  }}
                  style={{ flex: 1, background: '#26262d', border: '1px solid #2e2e38', borderRadius: 10, padding: '7px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('course-input-' + i)
                    const val = input?.value.trim()
                    if (val) {
                      updateEdu(i, 'coursework', [...(edu.coursework || []), val])
                      input.value = ''
                    }
                  }}
                  style={{ background: '#26262d', border: '1px solid #3a3a46', borderRadius: 10, padding: '7px 14px', fontSize: 13, color: '#9191a4', cursor: 'pointer' }}>
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 14, padding: '20px 22px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
          <i className="ti ti-tools" style={{ color: '#8b7cf8' }} /> Skills
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {skills.map(s => (
            <span key={s} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 100, background: 'rgba(139,124,248,0.12)', border: '1px solid rgba(139,124,248,0.25)', color: '#8b7cf8', display: 'flex', alignItems: 'center', gap: 5 }}>
              {s}
              <button onClick={() => setSkills(skills.filter(x => x !== s))} style={{ background: 'none', border: 'none', color: '#8b7cf8', cursor: 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>x</button>
            </span>
          ))}
          {skills.length === 0 && <span style={{ fontSize: 12, color: '#5a5a6e' }}>No skills added yet</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder="Python, React, Figma, SQL..."
            style={{ flex: 1, background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}
          />
          <button onClick={addSkill} style={{ background: '#26262d', border: '1px solid #3a3a46', borderRadius: 10, padding: '8px 14px', fontSize: 13, color: '#9191a4', cursor: 'pointer' }}>
            Add
          </button>
        </div>
      </div>

      {/* Save button */}
      <button onClick={saveProfile} style={{ background: '#8b7cf8', border: 'none', borderRadius: 10, padding: '10px 20px', fontSize: 13, color: '#fff', fontWeight: 500, cursor: 'pointer', marginBottom: 32 }}>
        {saved ? 'Saved!' : 'Save profile'}
      </button>

      {/* Projects */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 500, color: '#f0f0f4' }}>Projects</h2>
          <p style={{ fontSize: 12, color: '#5a5a6e', marginTop: 2 }}>{projects.length} saved — AI picks the best fit per role</p>
        </div>
        <button onClick={openAddProj} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8b7cf8', color: '#fff', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          <i className="ti ti-plus" style={{ fontSize: 14 }} /> Add project
        </button>
      </div>

      {showAddProj && (
        <div style={{ background: '#17171a', border: '1px solid #3a3a46', borderRadius: 14, padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4', marginBottom: 14 }}>
            {editProjId ? 'Edit project' : 'New project'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <FormField label="Project name *" value={projForm.name} onChange={v => setProjForm(f => ({...f, name: v}))} placeholder="E-commerce Platform" />
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Category</label>
              <select
                value={projForm.category}
                onChange={e => setProjForm(f => ({...f, category: e.target.value}))}
                style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>Description * (what you built, your role)</label>
            <textarea
              value={projForm.desc}
              onChange={e => setProjForm(f => ({...f, desc: e.target.value}))}
              placeholder="Built a full-stack e-commerce site with React and Node.js..."
              style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none', resize: 'vertical', height: 80, fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <FormField label="Tech stack (comma-separated)" value={projForm.tech} onChange={v => setProjForm(f => ({...f, tech: v}))} placeholder="React, Node.js, PostgreSQL" />
          </div>
          <div style={{ marginBottom: 16 }}>
            <FormField label="Impact / outcome (optional but powerful)" value={projForm.impact} onChange={v => setProjForm(f => ({...f, impact: v}))} placeholder="500+ users, reduced load time 40%, won hackathon..." />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowAddProj(false)} style={{ background: 'none', border: '1px solid #3a3a46', borderRadius: 10, padding: '7px 14px', fontSize: 13, color: '#9191a4', cursor: 'pointer' }}>Cancel</button>
            <button onClick={saveProj} style={{ background: '#8b7cf8', border: 'none', borderRadius: 10, padding: '7px 16px', fontSize: 13, color: '#fff', fontWeight: 500, cursor: 'pointer' }}>Save project</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {projects.length === 0 && !showAddProj && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#5a5a6e', fontSize: 13 }}>
            <i className="ti ti-folder-open" style={{ fontSize: 28, display: 'block', marginBottom: 10 }} />
            No projects yet — add your first one above
          </div>
        )}
        {projects.map(p => (
          <div key={p.id} style={{ background: '#17171a', border: '1px solid #2e2e38', borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: PROJ_COLORS[p.category] || '#8b7cf8', marginTop: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#f0f0f4' }}>{p.name}</div>
              <div style={{ fontSize: 12, color: '#5a5a6e', marginTop: 3, lineHeight: 1.5 }}>{p.desc}</div>
              {p.impact && (
                <div style={{ fontSize: 11, color: '#4ade80', marginTop: 4 }}>
                  <i className="ti ti-trending-up" style={{ fontSize: 11 }} /> {p.impact}
                </div>
              )}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 8 }}>
                {(p.tech || []).map(t => (
                  <span key={t} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: 'rgba(139,124,248,0.12)', color: '#8b7cf8' }}>{t}</span>
                ))}
                <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 100, background: '#1e1e23', color: '#5a5a6e' }}>{p.category}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => openEditProj(p)} style={{ background: 'none', border: 'none', color: '#5a5a6e', cursor: 'pointer', padding: 4, fontSize: 14 }}>
                <i className="ti ti-edit" />
              </button>
              <button onClick={() => deleteProject(p.id)} style={{ background: 'none', border: 'none', color: '#5a5a6e', cursor: 'pointer', padding: 4, fontSize: 14 }}>
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

function Field({ id, label, defaultValue, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>{label}</label>
      <input id={id} defaultValue={defaultValue} placeholder={placeholder}
        style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }} />
    </div>
  )
}

function EduField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: '#26262d', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }} />
    </div>
  )
}

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#5a5a6e', marginBottom: 5 }}>{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: '#1e1e23', border: '1px solid #2e2e38', borderRadius: 10, padding: '8px 11px', fontSize: 13, color: '#f0f0f4', outline: 'none' }} />
    </div>
  )
}