const TABS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'library', label: 'Library' },
  { key: 'settings', label: 'Settings' },
]

export default function Navigation({ view, setView }) {
  return (
    <nav className="nav">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`nav-btn${view === tab.key ? ' active' : ''}`}
          onClick={() => setView(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
