import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'

export default function AddItemForm() {
  const { addItem } = useStore()
  const { showToast } = useToast()
  const [title, setTitle] = useState('')
  const [type, setType] = useState('book')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addItem({ title: title.trim(), type })
    showToast('Added!')
    setTitle('')
    setType('book')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Add Library Item</h3>
      <input
        type="text"
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="book">Book</option>
        <option value="article">Article</option>
        <option value="video">Video</option>
        <option value="course">Course</option>
      </select>
      <button className="btn" type="submit">Add</button>
    </form>
  )
}
