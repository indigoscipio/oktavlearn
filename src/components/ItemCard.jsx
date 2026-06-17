import { Trash2 } from 'lucide-react'
import { useStore } from '../store/StoreContext'
import { getLatestSession, formatDate } from '../utils/helpers'

export default function ItemCard({ item, onSelect, showDelete = true }) {
  const { sessions, deleteItem } = useStore()
  const lastSession = getLatestSession(sessions, item.id)
  const sessionCount = sessions.filter((s) => s.itemId === item.id).length
  const sessionLabel = `${sessionCount} ${sessionCount === 1 ? 'session' : 'sessions'}`
  const statusBadgeClass = item.status === 'completed'
    ? 'bg-brand-50 text-brand-800 border-brand-300 dark:bg-brand-950 dark:text-brand-100 dark:border-brand-500'
    : 'bg-gold-100 text-gold-800 border-gold-400 dark:bg-gold-900 dark:text-gold-100 dark:border-gold-500'

  return (
    <div
      className="bg-merino-100 border border-merino-200 rounded-md p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(item.id)}
    >
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-brand-700">{item.type}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadgeClass}`}>{item.status}</span>
          {showDelete && (
            <button
              className="text-stone-400 hover:text-brand-700 transition-colors p-0.5"
              title="Delete"
              onClick={(e) => {
                e.stopPropagation()
                if (confirm(`Delete "${item.title}" and its ${sessionLabel}? This cannot be undone.`)) deleteItem(item.id)
              }}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-stone-800 m-0">{item.title}</h3>
      {lastSession && (
        <p className="text-sm text-stone-500 mt-1">
          {formatDate(lastSession.date)} · {sessionLabel}
          {lastSession.progress && ` — ${lastSession.progress}`}
        </p>
      )}
    </div>
  )
}
