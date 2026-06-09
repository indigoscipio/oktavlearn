import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { todayISO } from '../utils/helpers'

export default function LogSessionForm({ itemId, lastSession }) {
  const { addSession } = useStore()
  const { showToast } = useToast()
  const [date, setDate] = useState(todayISO())
  const [duration, setDuration] = useState('')
  const [progress, setProgress] = useState('')
  const [whatStuck, setWhatStuck] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!duration) return
    addSession({
      itemId,
      date,
      duration: Number(duration),
      progress: progress.trim(),
      whatStuck: whatStuck.trim() || '',
    })
    showToast('Logged!')
    setDuration('')
    setProgress('')
    setWhatStuck('')
    setDate(todayISO())
  }

  function repeatLast() {
    if (!lastSession) return
    setDate(todayISO())
    setDuration(String(lastSession.duration))
    setProgress(lastSession.progress)
    setWhatStuck(lastSession.whatStuck || '')
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>Log Session</h3>
      {lastSession && (
        <button type="button" className="btn-small" onClick={repeatLast} style={{ marginBottom: 8 }}>
          ↻ Repeat Last
        </button>
      )}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className="input-with-label">
        <input
          type="number"
          min="1"
          placeholder="Duration *"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <span className="input-label">min</span>
      </div>
      <input
        type="text"
        placeholder="Progress (e.g. Chapter 3)"
        value={progress}
        onChange={(e) => setProgress(e.target.value)}
      />
      <input
        type="text"
        placeholder="What stuck? (optional)"
        value={whatStuck}
        onChange={(e) => setWhatStuck(e.target.value)}
      />
      <button className="btn" type="submit">Log Session</button>
    </form>
  )
}
