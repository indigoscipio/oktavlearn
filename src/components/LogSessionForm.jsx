import { useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { todayISO } from '../utils/helpers'
import { Clock, RotateCcw } from 'lucide-react'

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
    <form className="bg-merino-100 border border-merino-200 rounded-md p-4" onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-stone-800 mb-3">Log Session</h3>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800"
        />
        <div className="relative">
          <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="number"
            min="1"
            placeholder="Minutes"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full pl-8 pr-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
          />
        </div>
      </div>
      <input
        type="text"
        placeholder="Progress (e.g. Chapter 3)"
        value={progress}
        onChange={(e) => setProgress(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400 mb-2"
      />
      <input
        type="text"
        placeholder="What stuck? (optional)"
        value={whatStuck}
        onChange={(e) => setWhatStuck(e.target.value)}
        className="w-full px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400 mb-3"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-sm hover:bg-stone-900 transition-colors"
        >
          Log Session
        </button>
        {lastSession && (
          <button
            type="button"
            className="px-4 py-2 bg-transparent text-stone-600 text-sm font-medium rounded-sm border border-merino-200 hover:bg-merino-100 transition-colors flex items-center gap-1.5"
            onClick={repeatLast}
          >
            <RotateCcw size={14} />
            Repeat Last
          </button>
        )}
      </div>
    </form>
  )
}
