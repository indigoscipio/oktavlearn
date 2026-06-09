import { useState } from 'react'
import { StoreProvider } from './store/StoreContext'
import { ToastProvider } from './store/ToastContext'
import Navigation from './components/Navigation'
import DashboardView from './components/DashboardView'

import LibraryView from './components/LibraryView'
import ItemDetailView from './components/ItemDetailView'
import SettingsView from './components/SettingsView'
import './App.css'

function AppContent() {
  const [view, setView] = useState('dashboard')

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
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Oktav Learn</h1>
      </header>
      <main className="app-main">{renderView()}</main>
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
