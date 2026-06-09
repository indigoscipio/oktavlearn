import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { formatDate, formatDuration, getItemSessions, getLatestSession } from '../utils/helpers'
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
      <div className="view">
        <p>Item not found.</p>
        <button className="btn" onClick={() => setView('library')}>Back to Library</button>
      </div>
    )
  }

  const itemSessions = getItemSessions(sessions, item.id)
  const lastSession = getLatestSession(sessions, item.id)
  const totalMins = itemSessions.reduce((sum, s) => sum + s.duration, 0)

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
    <div className="view">
      <div className="item-detail-top">
        <button className="btn-small" onClick={() => setView('library')}>
          &larr; Back
        </button>
        <span className="item-type">{item.type}</span>
      </div>

      <div className="item-detail-title-row">
        {editingTitle ? (
          <div className="item-detail-edit-inline">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <button className="btn-small" onClick={saveEdit}>Save</button>
            <button className="btn-small" onClick={() => setEditingTitle(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <h2 className="click-edit-title" onClick={startEdit}>{item.title}</h2>
            <button className="btn-small" onClick={startEdit}>Edit</button>
          </>
        )}
      </div>

      <div className="status-row">
        <span className={`status-badge status-${item.status}`}>{item.status}</span>
        <button className="btn-small" onClick={toggleCompleted}>
          {item.status === 'completed' ? 'Reopen' : 'Mark Complete'}
        </button>
      </div>
      {item.completedAt && (
        <p className="item-meta">Completed {formatDate(item.completedAt)}</p>
      )}

      <div className="item-stats-row">
        <div className="item-stat">
          <span className="item-stat-value">{formatDuration(totalMins)}</span>
          <span className="item-stat-label">total</span>
        </div>
        <div className="item-stat">
          <span className="item-stat-value">{itemSessions.length}</span>
          <span className="item-stat-label">sessions</span>
        </div>
        {lastSession && (
          <div className="item-stat">
            <span className="item-stat-value">{formatDate(lastSession.date)}</span>
            <span className="item-stat-label">last studied</span>
          </div>
        )}
      </div>

      {lastSession?.progress && (
        <p className="item-current">Currently: {lastSession.progress}</p>
      )}

      <p className="item-meta" style={{ marginBottom: 12 }}>Added {formatDate(item.createdAt)}</p>

      <button className="btn" onClick={() => setShowLogForm(!showLogForm)} style={{ marginBottom: showLogForm ? 0 : 16 }}>
        {showLogForm ? '− Hide Form' : '+ Log Session'}
      </button>
      {showLogForm && <LogSessionForm itemId={item.id} lastSession={lastSession} />}

      <h3>Session History ({itemSessions.length})</h3>
      <SessionHistory itemId={item.id} />
    </div>
  )
}
