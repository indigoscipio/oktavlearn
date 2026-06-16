import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'

export default function AddItemForm() {
  const { addItem } = useStore()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('book')

  const TYPES = [
    { value: 'book', label: 'Book' },
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'course', label: 'Other' },
  ]

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addItem({ title: title.trim(), type })
    showToast('Added!')
    setTitle('')
    setType('book')
  }

  return (
    <form className="bg-merino-100 border border-merino-200 rounded-md p-4" onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-stone-800 mb-3">Add new library item</h3>
      <input
        type="text"
        placeholder="Enter library item name..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400 mb-3"
      />
      <div className="flex gap-2 mb-3">
        {TYPES.map((t) => (
          <button
            key={t.value}
            type="button"
            className={`px-3 py-1.5 text-sm rounded-sm border transition-colors ${
              type === t.value
                ? 'bg-gold-500 text-white border-gold-500'
                : 'bg-transparent text-gold-600 border-gold-300 hover:bg-gold-50'
            }`}
            onClick={() => setType(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
      >
        Add Item
      </button>
    </form>
  )
}
