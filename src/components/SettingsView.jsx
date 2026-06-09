import { useRef, useState } from 'react'
import { useStore } from '../store/StoreContext'
import { useToast } from '../store/ToastContext'
import { formatDate } from '../utils/helpers'

export default function SettingsView() {
  const { library, sessions, userName, exportData, importData, saveUserName, clearAllData } = useStore()
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const [nameInput, setNameInput] = useState(userName)
  const [showClear, setShowClear] = useState(false)
  const [clearConfirm, setClearConfirm] = useState('')

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
        if (!data.library || !data.sessions) {
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
    <div className="view">
      <h2>Settings</h2>

      <div className="form">
        <h3>Display Name</h3>
        <p className="muted">Customize your dashboard greeting.</p>
        <div className="settings-name-row">
          <input
            type="text"
            placeholder="Your name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <button className="btn" onClick={handleSaveName}>Save</button>
        </div>
      </div>

      <div className="data-card">
        <h3>Your Data</h3>
        <p className="data-card-row"><span>Library items</span><span>{library.length}</span></p>
        <p className="data-card-row"><span>Sessions logged</span><span>{sessions.length}</span></p>
        <p className="data-card-row"><span>First log</span><span>{firstSession ? formatDate(firstSession.date) : '—'}</span></p>
        <p className="data-card-row"><span>Last log</span><span>{lastSession ? formatDate(lastSession.date) : '—'}</span></p>
        <p className="data-card-row"><span>Storage used</span><span>{sizeStr}</span></p>
        <p className="muted" style={{ marginTop: 8 }}>All data stored locally in your browser.</p>
      </div>

      <div className="form">
        <h3>Export Data</h3>
        <p className="muted">Download a backup of your library and sessions.</p>
        <button className="btn" onClick={handleExport}>Export JSON</button>
      </div>

      <div className="form">
        <h3>Import Data</h3>
        <p className="muted">Restore from a previously exported JSON file.</p>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
        <button className="btn" onClick={() => fileRef.current.click()}>Import JSON</button>
      </div>

      <div className="form form-danger">
        <h3>Clear All Data</h3>
        <p className="muted">Permanently delete all library items and sessions.</p>
        {!showClear ? (
          <button className="btn btn-danger" onClick={() => setShowClear(true)}>Clear Everything</button>
        ) : (
          <div>
            <p className="field-error" style={{ marginBottom: 6 }}>Type DELETE to confirm</p>
            <div className="settings-name-row">
              <input
                type="text"
                placeholder="Type DELETE"
                value={clearConfirm}
                onChange={(e) => setClearConfirm(e.target.value)}
              />
              <button
                className="btn btn-danger"
                disabled={clearConfirm !== 'DELETE'}
                onClick={handleClear}
              >
                Confirm
              </button>
              <button className="btn btn-outline" onClick={() => { setShowClear(false); setClearConfirm('') }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <p className="settings-footer">Oktav Learn v1.0 — No servers, no accounts. Your data stays on this device.</p>
    </div>
  )
}
