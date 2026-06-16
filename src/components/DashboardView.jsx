import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { Clock, CalendarDays, BookOpen } from 'lucide-react'
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
      <div className="px-5 py-6 pb-24">
        <h1 className="text-2xl font-bold text-stone-800 mb-1">{greeting}</h1>
        <div className="bg-merino-100 border border-merino-200 rounded-md p-6 mt-4 text-center">
          <h3 className="text-lg font-semibold text-stone-800 mb-1">Welcome to Oktav Learn!</h3>
          <p className="text-sm text-stone-500 mb-4">Track your study sessions and watch your progress grow.</p>
          <p className="text-sm text-stone-500 mb-4">Start by adding your first item:</p>
          <AddItemForm />
          <p className="text-sm text-stone-400 mt-3">After that, log your first session right here on the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 pb-24">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">{greeting}</h1>
      <p className="text-sm text-stone-500 mb-4">
        {activeCount} Active · {completedCount} Completed
      </p>

      <form className="bg-merino-100 border border-merino-200 rounded-md p-3 mb-4" onSubmit={handleQuickLog}>
        <select
          value={quickItemId}
          onChange={(e) => setQuickItemId(e.target.value)}
          required
          autoFocus
          className="w-full px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 mb-2"
        >
          <option value="" disabled>Select item</option>
          {library.map((item) => (
            <option key={item.id} value={item.id}>{item.title}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="number"
              min="1"
              placeholder="Insert Minutes"
              value={quickDuration}
              onChange={(e) => setQuickDuration(e.target.value)}
              required
              className="w-full pl-8 pr-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
          >
            Log
          </button>
        </div>
      </form>

      <div className="bg-merino-100 border border-merino-200 rounded-md p-4 mb-4">
        <div className="flex justify-between">
          {weekDays.map((date, i) => (
            <div key={date} className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{dayLabels[i]}</span>
              <span className={`w-3 h-3 rounded-full border-2 ${
                sessionDates.has(date)
                  ? 'bg-brand-700 border-brand-700'
                  : 'bg-transparent border-stone-300'
              }`} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <Clock size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{formatDuration(total * 60)}</span>
          <span className="block text-xs text-stone-500">Total</span>
        </div>
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <CalendarDays size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{formatDuration(weekHours * 60)}</span>
          <span className="block text-xs text-stone-500">This Week</span>
        </div>
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <BookOpen size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{weekSessions.length}</span>
          <span className="block text-xs text-stone-500">Sessions</span>
        </div>
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-stone-800 mb-2">Recently Studied</h2>
          <div className="flex flex-col gap-2">
            {recent.map(({ item, lastSession }) => (
              <div
                key={item.id}
                className="bg-merino-100 border border-merino-200 rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setView(`item-${item.id}`)}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">{item.type}</span>
                <h3 className="text-lg font-semibold text-stone-800 m-0 mt-1">{item.title}</h3>
                <p className="text-sm text-stone-500 mt-1">
                  {formatDate(lastSession.date)}
                  {lastSession.progress && ` · ${lastSession.progress}`}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
