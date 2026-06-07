import { create } from 'zustand'

const STORAGE_KEY = 'internpath-apps'

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

const saveToStorage = (apps) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

const useAppStore = create((set, get) => ({
  apps: loadFromStorage(),

  addApp: (app) => {
    const newApp = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      addedAt: new Date().toISOString(),
      status: 'wishlist',
      ...app,
    }
    const apps = [newApp, ...get().apps]
    saveToStorage(apps)
    set({ apps })
  },

  updateApp: (id, updates) => {
    const apps = get().apps.map(a => a.id === id ? { ...a, ...updates } : a)
    saveToStorage(apps)
    set({ apps })
  },

  deleteApp: (id) => {
    const apps = get().apps.filter(a => a.id !== id)
    saveToStorage(apps)
    set({ apps })
  },
}))

export default useAppStore