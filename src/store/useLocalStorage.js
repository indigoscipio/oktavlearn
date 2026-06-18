import { useState, useCallback } from 'react'
import { generateId, nowISO } from '../utils/helpers'

const LIBRARY_KEY = 'oktav_library'
const SESSIONS_KEY = 'oktav_sessions'
const NAME_KEY = 'oktav_name'
const LAST_EXPORT_KEY = 'oktav_last_exported_at'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useLocalStorage() {
  const [library, setLibrary] = useState(() => load(LIBRARY_KEY, []))
  const [sessions, setSessions] = useState(() => load(SESSIONS_KEY, []))
  const [userName, setUserName] = useState(() => load(NAME_KEY, ''))
  const [lastExportedAt, setLastExportedAt] = useState(() => load(LAST_EXPORT_KEY, ''))

  const persistLibrary = useCallback((fn) => {
    setLibrary((prev) => {
      const next = fn(prev)
      save(LIBRARY_KEY, next)
      return next
    })
  }, [])

  const persistSessions = useCallback((fn) => {
    setSessions((prev) => {
      const next = fn(prev)
      save(SESSIONS_KEY, next)
      return next
    })
  }, [])

  const addItem = useCallback((item) => {
    const newItem = { id: generateId(), ...item, status: 'active', completedAt: '', createdAt: nowISO() }
    persistLibrary((prev) => [...prev, newItem])
    return newItem
  }, [persistLibrary])

  const editItem = useCallback((id, updates) => {
    persistLibrary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [persistLibrary])

  const deleteItem = useCallback((id) => {
    persistLibrary((prev) => prev.filter((item) => item.id !== id))
    persistSessions((prev) => prev.filter((s) => s.itemId !== id))
  }, [persistLibrary, persistSessions])

  const addSession = useCallback((session) => {
    const newSession = { id: generateId(), ...session, createdAt: nowISO() }
    persistSessions((prev) => [...prev, newSession])
    return newSession
  }, [persistSessions])

  const editSession = useCallback((id, updates) => {
    persistSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }, [persistSessions])

  const setItemStatus = useCallback((id, status) => {
    const updates = { status }
    if (status === 'completed') updates.completedAt = nowISO()
    if (status === 'active') updates.completedAt = ''
    persistLibrary((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [persistLibrary])

  const deleteSession = useCallback((id) => {
    persistSessions((prev) => prev.filter((s) => s.id !== id))
  }, [persistSessions])

  const exportData = useCallback(() => {
    const exportedAt = nowISO()
    save(LAST_EXPORT_KEY, exportedAt)
    setLastExportedAt(exportedAt)
    return JSON.stringify({ version: '2.4', exportedAt, library, sessions }, null, 2)
  }, [library, sessions])

  const saveUserName = useCallback((name) => {
    save(NAME_KEY, name)
    setUserName(name)
  }, [])

  const clearAllData = useCallback(() => {
    localStorage.removeItem(LIBRARY_KEY)
    localStorage.removeItem(SESSIONS_KEY)
    localStorage.removeItem(NAME_KEY)
    localStorage.removeItem(LAST_EXPORT_KEY)
    setLibrary([])
    setSessions([])
    setUserName('')
    setLastExportedAt('')
  }, [])

  const importData = useCallback((data) => {
    save(LIBRARY_KEY, data.library || [])
    save(SESSIONS_KEY, data.sessions || [])
    setLibrary(data.library || [])
    setSessions(data.sessions || [])
  }, [])

  return {
    library,
    sessions,
    userName,
    lastExportedAt,
    addItem,
    editItem,
    deleteItem,
    addSession,
    editSession,
    deleteSession,
    setItemStatus,
    exportData,
    importData,
    saveUserName,
    clearAllData,
  }
}
