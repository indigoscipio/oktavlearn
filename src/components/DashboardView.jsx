import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import {
  getWeekStart,
  totalHours,
  hoursThisWeek,
  sessionsThisWeek,
  getRecentItems,
  formatDuration,
  formatDate,
  todayISO,
  getTimeOfDay,
} from '../utils/helpers'
import AddItemForm from './AddItemForm'

export default function DashboardView({ setView }) {
  const { library, sessions, addSession, userName } = useStore()
  const { showToast } = useToast()
  const [quickItemId, setQuickItemId] = useState(library[0]?.id || '')
  const [quickDuration, setQuickDuration] = useState('')

  const total = totalHours(sessions)
  const weekSessions = sessionsThisWeek(sessions)
  const weekHours = hoursThisWeek(sessions)
  const recent = getRecentItems(library, sessions)
  const activeCount = library.filter((i) => i.status === 'active').length
  const completedCount = library.filter((i) => i.status === 'completed').length

  function handleQuickLog(e) {
    e.preventDefault()
    if (!quickItemId || !quickDuration) return
    addSession({
      itemId: quickItemId,
      date: todayISO(),
      duration: Number(quickDuration),
      progress: '',
      whatStuck: '',
    })
    setQuickDuration('')
    showToast('Logged!')
  }

  const greeting = `Good ${getTimeOfDay()}, ${userName || 'You'}!`

  const weekStart = getWeekStart()
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const sessionDates = new Set(sessions.map((s) => s.date.slice(0, 10)))
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return d.toISOString().slice(0, 10)
  })

  if (library.length === 0) {
    return (
      <div className="view">
        <h2>{greeting}</h2>
        <div className="guided-flow">
          <h3>Welcome to Oktav Learn!</h3>
          <p>Track your study sessions and watch your progress grow.</p>
          <p>Start by adding your first item:</p>
          <AddItemForm />
          <p className="muted" style={{ marginTop: 12 }}>After that, log your first session right here on the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view">
      <h2>{greeting}</h2>
      <form className="quick-log" onSubmit={handleQuickLog}>
        <select
          value={quickItemId}
          onChange={(e) => setQuickItemId(e.target.value)}
          required
          autoFocus
        >
          <option value="" disabled>Select item</option>
          {library.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
        <div className="quick-log-row">
          <input
            type="number"
            min="1"
            placeholder="Minutes"
            value={quickDuration}
            onChange={(e) => setQuickDuration(e.target.value)}
            required
          />
          <button className="btn" type="submit">Log</button>
        </div>
      </form>

      <div className="week-dots">
        {weekDays.map((date, i) => (
          <div key={date} className="week-dot-col">
            <span className="week-label">{dayLabels[i]}</span>
            <span className={`week-dot${sessionDates.has(date) ? ' filled' : ''}`} />
          </div>
        ))}
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{formatDuration(total * 60)}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatDuration(weekHours * 60)}</span>
          <span className="stat-label">This Week</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{weekSessions.length}</span>
          <span className="stat-label">Sessions</span>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{activeCount}</span>
          <span className="stat-label">Active</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {recent.length > 0 && (
        <>
          <h3>Recently Studied</h3>
          <div className="item-list">
            {recent.map(({ item, lastSession }) => (
              <div
                key={item.id}
                className="item-card"
                onClick={() => setView(`item-${item.id}`)}
              >
                <div className="item-card-header">
                  <span className="item-type">{item.type}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="item-meta">
                  {formatDate(lastSession.date)} &middot; {lastSession.progress}
                  {lastSession.whatStuck && ` \u2014 ${lastSession.whatStuck}`}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
