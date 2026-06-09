import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { getItemSessions, formatDate } from '../utils/helpers'

export default function SessionHistory({ itemId }) {
  const { sessions, editSession, deleteSession } = useStore()
  const { showToast } = useToast()
  const itemSessions = getItemSessions(sessions, itemId)

  if (itemSessions.length === 0) {
    return <p className="muted">No sessions logged yet.</p>
  }

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [durError, setDurError] = useState(false)

  function startEdit(s) {
    setEditingId(s.id)
    setEditForm({
      date: s.date.slice(0, 10),
      duration: String(s.duration),
      progress: s.progress,
      whatStuck: s.whatStuck || '',
    })
  }

  function saveEdit(id) {
    if (!editForm.duration) {
      setDurError(true)
      return
    }
    editSession(id, {
      date: editForm.date,
      duration: Number(editForm.duration),
      progress: editForm.progress.trim(),
      whatStuck: editForm.whatStuck.trim(),
    })
    setEditingId(null)
    showToast('Session updated!')
  }

  return (
    <div className="session-list">
      {itemSessions.map((s) => (
        <div key={s.id} className="session-entry">
          {editingId === s.id ? (
            <div className="session-edit-form">
              <input
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              />
              <div className="input-with-label">
                <input
                  type="number"
                  min="1"
                  placeholder="Duration"
                  value={editForm.duration}
                  onChange={(e) => { setDurError(false); setEditForm({ ...editForm, duration: e.target.value }) }}
                />
                <span className="input-label">min</span>
              </div>
              {durError && <p className="field-error">Duration is required</p>}
              <input
                type="text"
                placeholder="Progress (e.g. Chapter 3)"
                value={editForm.progress}
                onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
              />
              <input
                type="text"
                placeholder="What stuck?"
                value={editForm.whatStuck}
                onChange={(e) => setEditForm({ ...editForm, whatStuck: e.target.value })}
              />
              <div className="session-actions">
                <button className="btn-small" onClick={() => saveEdit(s.id)}>Save</button>
                <button className="btn-small" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="session-meta">
                <span>{formatDate(s.date)}</span>
                <span>{s.duration} min</span>
              </div>
              {s.progress && <p className="session-progress">{s.progress}</p>}
              {s.whatStuck && <p className="session-stuck">{s.whatStuck}</p>}
              <div className="session-actions">
                <button className="btn-small" onClick={() => startEdit(s)}>Edit</button>
                <button
                  className="btn-small btn-danger"
                  onClick={() => { if (confirm('Delete this session?')) { deleteSession(s.id); showToast('Session deleted!') } }}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
