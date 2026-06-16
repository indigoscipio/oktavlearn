import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { getItemSessions, formatDate } from '../utils/helpers'
import { Pencil, Trash2, Clock } from 'lucide-react'

export default function SessionHistory({ itemId }) {
  const { sessions, editSession, deleteSession } = useStore()
  const { showToast } = useToast()
  const itemSessions = getItemSessions(sessions, itemId)

  if (itemSessions.length === 0) {
    return <p className="text-sm text-stone-400 italic">No sessions logged yet.</p>
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
    <div className="flex flex-col gap-2">
      {itemSessions.map((s) => (
        <div key={s.id} className="bg-merino-100 border border-merino-200 rounded-md p-4">
          {editingId === s.id ? (
            <div className="flex flex-col gap-2">
              <input
                type="date"
                value={editForm.date}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800"
              />
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="number"
                  min="1"
                  placeholder="Duration"
                  value={editForm.duration}
                  onChange={(e) => { setDurError(false); setEditForm({ ...editForm, duration: e.target.value }) }}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
                />
              </div>
              {durError && <p className="text-xs text-red-500">Duration is required</p>}
              <input
                type="text"
                placeholder="Progress (e.g. Chapter 3)"
                value={editForm.progress}
                onChange={(e) => setEditForm({ ...editForm, progress: e.target.value })}
                className="px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
              />
              <input
                type="text"
                placeholder="What stuck?"
                value={editForm.whatStuck}
                onChange={(e) => setEditForm({ ...editForm, whatStuck: e.target.value })}
                className="px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
              />
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium border border-merino-200 rounded-sm hover:bg-merino-100 transition-colors" onClick={() => saveEdit(s.id)}>Save</button>
                <button className="px-3 py-1.5 text-xs font-medium border border-merino-200 rounded-sm hover:bg-merino-100 transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">{formatDate(s.date)}</span>
                <span className="text-xs text-stone-500 flex items-center gap-1"><Clock size={12} />{s.duration} min</span>
              </div>
              {s.progress && <p className="text-sm font-semibold text-stone-800 mb-0.5">{s.progress}</p>}
              {s.whatStuck && <p className="text-sm text-stone-500 italic mb-1">{s.whatStuck}</p>}
              <div className="flex gap-2 mt-2">
                <button className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium border border-merino-200 rounded-sm hover:bg-merino-100 transition-colors" onClick={() => startEdit(s)}>
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-brand-700 text-white rounded-sm hover:bg-brand-800 transition-colors"
                  onClick={() => { if (confirm('Delete this session?')) { deleteSession(s.id); showToast('Session deleted!') } }}
                >
                  <Trash2 size={12} />
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
