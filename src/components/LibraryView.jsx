import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { getLatestSession } from '../utils/helpers'
import { Plus, ArrowUpDown } from 'lucide-react'
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
      <div className="px-5 py-6 pb-24">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">Library</h1>
        <EmptyState
          title="Your library is empty"
          message="Add anything you are actively studying: a book, article, video, course, or paper."
        />
        <div className="bg-merino-100 border border-merino-200 rounded-md p-4 text-sm text-stone-500">
          <p className="font-semibold text-stone-800 mb-1">What belongs here?</p>
          <p>Use library items as containers for your study sessions. Each item gets its own history, progress notes, and totals.</p>
        </div>
        <div className="mt-4">
          <AddItemForm />
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-stone-800">Library ({library.length})</h1>
        <button
          className="flex items-center gap-1.5 px-3 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} />
          {showForm ? 'Cancel' : 'Add Item'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4">
          <AddItemForm />
        </div>
      )}

      {STATUS_ORDER.map((status) => {
        const items = sortItems(library.filter((i) => i.status === status))
        if (items.length === 0) return null
        return (
          <div key={status} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                {STATUS_LABELS[status]}
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-merino-200 text-stone-600">{items.length}</span>
              </h2>
              <button
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition-colors px-2 py-1 border border-merino-200 rounded-sm"
                onClick={() => setSortBy(sortBy === 'alpha' ? 'recent' : 'alpha')}
              >
                <ArrowUpDown size={12} />
                {sortBy === 'alpha' ? 'A-Z' : 'Recent'}
              </button>
            </div>
            <div className="flex flex-col gap-2">
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
