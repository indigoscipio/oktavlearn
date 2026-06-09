import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { getLatestSession } from '../utils/helpers'
import AddItemForm from './AddItemForm'
import ItemCard from './ItemCard'
import EmptyState from './EmptyState'

const STATUS_ORDER = ['active', 'completed']
const STATUS_LABELS = { active: 'Active', completed: 'Completed' }

export default function LibraryView({ setView }) {
  const { library, sessions } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [sortBy, setSortBy] = useState('alpha')

  function sortItems(items) {
    if (sortBy === 'recent') {
      return [...items].sort((a, b) => {
        const aLast = getLatestSession(sessions, a.id)
        const bLast = getLatestSession(sessions, b.id)
        if (!aLast && !bLast) return 0
        if (!aLast) return 1
        if (!bLast) return -1
        return new Date(bLast.date) - new Date(aLast.date)
      })
    }
    return [...items].sort((a, b) => a.title.localeCompare(b.title))
  }

  if (library.length === 0) {
    return (
      <div className="view">
        <h2>Library</h2>
        <EmptyState
          title="Your library is empty"
          message="Add your first book, article, video, or course to get started."
        />
        <AddItemForm />
      </div>
    )
  }

  return (
    <div className="view">
      <div className="library-header">
        <h2>Library ({library.length})</h2>
        <div className="library-header-actions">
          <button className="btn-small" onClick={() => setSortBy(sortBy === 'alpha' ? 'recent' : 'alpha')}>
            {sortBy === 'alpha' ? 'A-Z' : 'Recent'}
          </button>
          <button className="btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? '− Cancel' : '+ Add Item'}
          </button>
        </div>
      </div>
      {showForm && <AddItemForm />}
      {STATUS_ORDER.map((status) => {
        const items = sortItems(library.filter((i) => i.status === status))
        if (items.length === 0) return null
        return (
          <div key={status} style={{ marginBottom: 16 }}>
            <h3 className="section-header">
              {STATUS_LABELS[status]} <span className="section-count">{items.length}</span>
            </h3>
            <div className="item-list">
              {items.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onSelect={(id) => setView(`item-${id}`)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
