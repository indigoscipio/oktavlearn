import { LayoutGrid, BookOpen, Settings } from 'lucide-react'

const TABS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { key: 'library', label: 'Library', icon: BookOpen },
  { key: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ view, setView }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-merino-50 border-t border-merino-200 flex z-50">
      {TABS.map((tab) => {
        const active = view === tab.key
        const Icon = tab.icon
        return (
          <button
            key={tab.key}
            className={`flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors ${
              active ? 'text-brand-700' : 'text-stone-500'
            }`}
            onClick={() => setView(tab.key)}
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-700 rounded-full" />
            )}
            <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-xs">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
