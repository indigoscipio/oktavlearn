import { useRef, useState, useEffect } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { formatDate } from '../utils/helpers'
import { Download, Upload, Trash2 } from 'lucide-react'

export default function SettingsView() {
  const { library, sessions, userName, exportData, importData, saveUserName, clearAllData } = useStore()
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const [nameInput, setNameInput] = useState(userName)
  const [showClear, setShowClear] = useState(false)
  const [clearConfirm, setClearConfirm] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem('oktav_theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('oktav_theme', theme)
  }, [theme])

  const firstSession = sessions.length > 0
    ? sessions.slice().sort((a, b) => new Date(a.date) - new Date(b.date))[0]
    : null
  const lastSession = sessions.length > 0
    ? sessions.slice().sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    : null
  const dataSize = new TextEncoder().encode(JSON.stringify({ library, sessions })).length
  const sizeStr = dataSize > 1024 ? `${(dataSize / 1024).toFixed(1)} KB` : `${dataSize} B`

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `oktav-learn-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Data exported!')
  }

  function handleImport(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (!Array.isArray(data.library) || !Array.isArray(data.sessions)) {
          showToast('Invalid file format.', 'error')
          return
        }
        importData(data)
        showToast('Data imported!')
      } catch {
        showToast('Invalid JSON file.', 'error')
      }
    }
    reader.readAsText(file)
  }

  function handleSaveName() {
    saveUserName(nameInput.trim())
    showToast('Name saved!')
  }

  function handleClear() {
    if (clearConfirm !== 'DELETE') return
    clearAllData()
    showToast('All data cleared!')
    setShowClear(false)
    setClearConfirm('')
  }

  return (
    <div className="px-5 py-6 pb-24">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Settings</h1>
      <p className="text-sm text-stone-500 mb-6">Manage your profile, backups, and local data.</p>

      <div className="bg-merino-100 border border-merino-200 rounded-md p-4 mb-4">
        <h3 className="text-base font-semibold text-stone-800 mb-2">Display Name</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your display name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
          />
          <button
            className="px-4 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
            onClick={handleSaveName}
          >
            Save
          </button>
        </div>
      </div>

      <div className="bg-merino-100 border border-merino-200 rounded-md p-4 mb-4">
        <h3 className="text-base font-semibold text-stone-800 mb-3">Your Data</h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-merino-200">
            <span className="text-stone-500">Library Items</span>
            <span className="font-semibold text-stone-800">{library.length}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-merino-200">
            <span className="text-stone-500">Sessions Logged</span>
            <span className="font-semibold text-stone-800">{sessions.length}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-merino-200">
            <span className="text-stone-500">First Log</span>
            <span className="font-semibold text-stone-800">{firstSession ? formatDate(firstSession.date) : '—'}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-merino-200">
            <span className="text-stone-500">Last Log</span>
            <span className="font-semibold text-stone-800">{lastSession ? formatDate(lastSession.date) : '—'}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-stone-500">Storage Used</span>
            <span className="font-semibold text-stone-800">{sizeStr}</span>
          </div>
        </div>
        <p className="text-xs text-stone-400 italic mt-3">*All data stored locally in your browser.</p>
      </div>

      <div className="bg-merino-100 border border-merino-200 rounded-md p-4 mb-4">
        <h3 className="text-base font-semibold text-stone-800 mb-1">Export/Import Data</h3>
        <p className="text-sm text-stone-500 mb-3">Export a backup or restore a previous JSON file.</p>
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gold-500 text-white text-sm font-medium rounded-sm hover:bg-gold-600 transition-colors"
            onClick={handleExport}
          >
            <Download size={14} />
            Export JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <button
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-transparent text-gold-600 text-sm font-medium rounded-sm border border-gold-300 hover:bg-gold-50 transition-colors"
            onClick={() => fileRef.current.click()}
          >
            <Upload size={14} />
            Import JSON
          </button>
        </div>
      </div>

      <div className="bg-merino-100 border-2 border-brand-700 rounded-md p-4 mb-4">
        <h3 className="text-base font-semibold text-stone-800 mb-1">Clear All Data</h3>
        <p className="text-sm text-stone-500 mb-3">This permanently removes your local library and sessions from this browser.</p>
        {!showClear ? (
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors"
            onClick={() => setShowClear(true)}
          >
            <Trash2 size={14} />
            Clear All Data
          </button>
        ) : (
          <div>
            <p className="text-xs text-red-500 mb-2">Type DELETE to confirm</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type DELETE"
                value={clearConfirm}
                onChange={(e) => setClearConfirm(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-merino-200 rounded-sm text-sm text-stone-800 placeholder:text-stone-400"
              />
              <button
                className="px-4 py-2 bg-brand-700 text-white text-sm font-medium rounded-sm hover:bg-brand-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={clearConfirm !== 'DELETE'}
                onClick={handleClear}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-transparent text-stone-600 text-sm font-medium rounded-sm border border-merino-200 hover:bg-merino-100 transition-colors"
                onClick={() => { setShowClear(false); setClearConfirm('') }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-merino-100 border border-merino-200 rounded-md p-4 mb-4">
        <h3 className="text-base font-semibold text-stone-800 mb-2">Appearance</h3>
        <div className="flex gap-2">
          <button
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
              theme === 'light'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-transparent text-stone-600 border-merino-200 hover:bg-merino-100'
            }`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
              theme === 'dark'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-transparent text-stone-600 border-merino-200 hover:bg-merino-100'
            }`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-sm border transition-colors ${
              theme === 'auto'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'bg-transparent text-stone-600 border-merino-200 hover:bg-merino-100'
            }`}
            onClick={() => setTheme('auto')}
          >
            Auto
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-stone-400 mt-6">Oktav Learn v2.0 — No servers, no accounts. Your data stays on this device.</p>
    </div>
  )
}
