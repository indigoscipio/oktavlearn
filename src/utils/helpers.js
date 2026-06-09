export function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export function generateId() {
  return crypto.randomUUID()
}

export function nowISO() {
  return new Date().toISOString()
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(iso) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const d = new Date(iso.slice(0, 10) + 'T00:00:00')
  const diff = Math.round((today - d) / (1000 * 60 * 60 * 24))

  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff > 0 && diff < 7) return `${diff} days ago`

  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function getWeekStart() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function totalHours(sessions) {
  return sessions.reduce((sum, s) => sum + s.duration, 0) / 60
}

export function sessionsThisWeek(sessions) {
  const weekStart = getWeekStart()
  return sessions.filter((s) => new Date(s.date) >= weekStart)
}

export function hoursThisWeek(sessions) {
  return sessionsThisWeek(sessions).reduce((sum, s) => sum + s.duration, 0) / 60
}

function sortByDate(a, b) {
  const d = new Date(b.date) - new Date(a.date)
  if (d !== 0) return d
  return new Date(b.createdAt) - new Date(a.createdAt)
}

export function getLatestSession(sessions, itemId) {
  const itemSessions = sessions
    .filter((s) => s.itemId === itemId)
    .sort(sortByDate)
  return itemSessions[0] || null
}

export function getItemSessions(sessions, itemId) {
  return sessions
    .filter((s) => s.itemId === itemId)
    .sort(sortByDate)
}

export function getRecentItems(library, sessions, limit = 5) {
  const studied = library
    .map((item) => ({
      item,
      lastSession: getLatestSession(sessions, item.id),
    }))
    .filter((x) => x.lastSession)
    .sort((a, b) => new Date(b.lastSession.date) - new Date(a.lastSession.date))
    .slice(0, limit)
  return studied
}
