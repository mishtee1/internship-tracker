import { create } from 'zustand'

const PKEY = 'internpath-profile'
const PROJKEY = 'internpath-projects'

const load = (key) => {
  try {
    const d = localStorage.getItem(key)
    return d ? JSON.parse(d) : null
  } catch { return null }
}

const useProfileStore = create((set, get) => ({
  profile: load(PKEY) || {
    name: '', email: '', phone: '', location: '',
    linkedin: '', github: '', university: '',
    degree: '', grad: '', gpa: '',
  },
  projects: load(PROJKEY) || [],
  skills: load('internpath-skills') || [],

  updateProfile: (updates) => {
    const profile = { ...get().profile, ...updates }
    localStorage.setItem(PKEY, JSON.stringify(profile))
    set({ profile })
  },

  addProject: (project) => {
    const newProj = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      ...project,
    }
    const projects = [...get().projects, newProj]
    localStorage.setItem(PROJKEY, JSON.stringify(projects))
    set({ projects })
  },

  updateProject: (id, updates) => {
    const projects = get().projects.map(p => p.id === id ? { ...p, ...updates } : p)
    localStorage.setItem(PROJKEY, JSON.stringify(projects))
    set({ projects })
  },

  deleteProject: (id) => {
    const projects = get().projects.filter(p => p.id !== id)
    localStorage.setItem(PROJKEY, JSON.stringify(projects))
    set({ projects })
  },

  setSkills: (skills) => {
    localStorage.setItem('internpath-skills', JSON.stringify(skills))
    set({ skills })
  },
}))

export default useProfileStore