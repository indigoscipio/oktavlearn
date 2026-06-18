import { useState, useEffect } from 'react'
import { StoreProvider } from './store/StoreContext'
import { ToastProvider } from './store/ToastContext'
import Navigation from './components/Navigation'
import DashboardView from './components/DashboardView'
import LibraryView from './components/LibraryView'
import ItemDetailView from './components/ItemDetailView'
import SettingsView from './components/SettingsView'
import { User } from 'lucide-react'

function AppContent() {
  const [view, setView] = useState('dashboard')

  useEffect(() => {
    const saved = localStorage.getItem('oktav_theme') === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', saved)
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  function renderView() {
    if (view.startsWith('item-')) {
      const itemId = view.slice(5)
      return <ItemDetailView itemId={itemId} setView={setView} />
    }
    switch (view) {
      case 'dashboard':
        return <DashboardView setView={setView} />
      case 'library':
        return <LibraryView setView={setView} />
      case 'settings':
        return <SettingsView />
      default:
        return <DashboardView setView={setView} />
    }
  }

  return (
    <div className="min-h-screen bg-merino-50 max-w-lg mx-auto relative">
      <header className="flex justify-between items-center px-5 py-4 border-b border-merino-200 bg-merino-50">
        <div className="rounded-sm dark:bg-[#FAF7F2] dark:px-1 dark:py-0.5">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Pliny" className="h-7 w-auto" />
        </div>
        <button
          onClick={() => setView('settings')}
          aria-label="Open settings"
          className="w-9 h-9 rounded-full border border-merino-200 flex items-center justify-center text-stone-500 hover:text-brand-700 hover:border-brand-300 transition-colors"
        >
          <User size={18} />
        </button>
      </header>
      <main className="pb-16">{renderView()}</main>
      <Navigation view={view} setView={setView} />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ToastProvider>
  )
}
