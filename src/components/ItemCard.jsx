import { useStore } from '../store/StoreContext'
import { getLatestSession, formatDate } from '../utils/helpers'

export default function ItemCard({ item, onSelect }) {
  const { sessions, deleteItem } = useStore()
  const lastSession = getLatestSession(sessions, item.id)
  const sessionCount = sessions.filter((s) => s.itemId === item.id).length

  return (
    <div className="item-card" onClick={() => onSelect(item.id)}>
      <div className="item-card-header">
        <span className="item-type">{item.type}</span>
        <div className="item-card-header-right">
          <span className={`status-badge status-${item.status}`}>{item.status}</span>
          <button
            className="btn-trash"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              if (confirm(`Delete "${item.title}"?`)) deleteItem(item.id)
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>
      <h3>{item.title}</h3>
      {lastSession && (
        <p className="item-meta">
          {formatDate(lastSession.date)} &middot; {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
          {lastSession.progress && ` \u2014 ${lastSession.progress}`}
        </p>
      )}
    </div>
  )
}
