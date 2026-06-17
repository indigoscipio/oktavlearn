import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { formatDate, formatDuration, getItemSessions, getLatestSession } from '../utils/helpers'
import { ChevronLeft, Pencil, Clock, CalendarDays, BookOpen, Plus } from 'lucide-react'
import LogSessionForm from './LogSessionForm'
import SessionHistory from './SessionHistory'

export default function ItemDetailView({ itemId, setView }) {
  const { library, sessions, editItem, setItemStatus } = useStore()
  const { showToast } = useToast()
  const item = library.find((i) => i.id === itemId)

  const [editingTitle, setEditingTitle] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [showLogForm, setShowLogForm] = useState(false)

  if (!item) {
    return (
      <div className="px-5 py-6 pb-24">
        <p className="text-sm text-stone-500">Item not found.</p>
        <button
          className="mt-2 px-4 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
          onClick={() => setView('library')}
        >
          Back to Library
        </button>
      </div>
    )
  }

  const itemSessions = getItemSessions(sessions, item.id)
  const lastSession = getLatestSession(sessions, item.id)
  const totalMins = itemSessions.reduce((sum, s) => sum + s.duration, 0)
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1))
  weekStart.setHours(0, 0, 0, 0)
  const weekMins = itemSessions
    .filter((s) => new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.duration, 0)

  function startEdit() {
    setEditTitle(item.title)
    setEditingTitle(true)
  }

  function saveEdit() {
    if (!editTitle.trim()) return
    editItem(item.id, { title: editTitle.trim() })
    showToast('Title updated!')
    setEditingTitle(false)
  }

  function toggleCompleted() {
    if (item.status === 'completed') {
      setItemStatus(item.id, 'active')
      showToast('Reopened!')
    } else {
      setItemStatus(item.id, 'completed')
      showToast('Marked complete!')
    }
  }

  return (
    <div className="px-5 py-6 pb-24">
      <button
        className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4 px-2 py-1 border border-merino-200 rounded-sm"
        onClick={() => setView('library')}
      >
        <ChevronLeft size={14} />
        Back
      </button>

      <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">{item.type}</span>

      <div className="flex justify-between items-start mt-1 mb-2">
        {editingTitle ? (
          <div className="flex gap-2 items-center flex-1">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-1.5 bg-white border border-merino-200 rounded-sm text-lg font-semibold text-stone-800"
            />
            <button className="px-3 py-1.5 text-xs font-medium border border-merino-200 rounded-sm hover:bg-merino-100 transition-colors" onClick={saveEdit}>Save</button>
            <button className="px-3 py-1.5 text-xs font-medium border border-merino-200 rounded-sm hover:bg-merino-100 transition-colors" onClick={() => setEditingTitle(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-stone-800 cursor-pointer border-b border-dashed border-merino-200 hover:border-brand-700 transition-colors" onClick={startEdit}>
              {item.title}
            </h1>
            <button className="flex items-center gap-1 text-xs font-medium border border-merino-200 rounded-sm px-2 py-1 hover:bg-merino-100 transition-colors" onClick={startEdit}>
              <Pencil size={12} />
              Edit
            </button>
          </>
        )}
      </div>

      <p className="text-sm text-stone-500 mb-3">
        Currently: {lastSession?.progress || '—'} · Last Added: {lastSession ? formatDate(lastSession.date) : '—'}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand-700">{item.status}</span>
        <button
          className="px-3 py-1.5 text-xs font-medium bg-brand-700 text-white rounded-sm hover:bg-brand-800 transition-colors"
          onClick={toggleCompleted}
        >
          {item.status === 'completed' ? 'Reopen' : 'Mark As Complete'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <Clock size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{formatDuration(totalMins)}</span>
          <span className="block text-xs text-stone-500">Total</span>
        </div>
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <CalendarDays size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{formatDuration(weekMins)}</span>
          <span className="block text-xs text-stone-500">This Week</span>
        </div>
        <div className="bg-merino-100 border border-merino-200 rounded-md p-3 text-center">
          <BookOpen size={18} className="mx-auto text-stone-400 mb-1" />
          <span className="block text-lg font-bold text-stone-800">{itemSessions.length}</span>
          <span className="block text-xs text-stone-500">Sessions</span>
        </div>
      </div>

      <button
        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors mb-4"
        onClick={() => setShowLogForm(!showLogForm)}
      >
        {showLogForm ? 'Hide Form' : (
          <>
            Log Session
            <Plus size={16} />
          </>
        )}
      </button>

      {showLogForm && (
        <div className="mb-4">
          <LogSessionForm itemId={item.id} lastSession={lastSession} />
        </div>
      )}

      <h2 className="text-lg font-semibold text-stone-800 mb-2">Session History ({itemSessions.length})</h2>
      <SessionHistory itemId={item.id} />
    </div>
  )
}
