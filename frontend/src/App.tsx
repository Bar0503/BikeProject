import { useEffect, useState } from 'react'
import { clearToken, getToken } from './api'
import BikesPage from './BikesPage'
import Login from './Login'
import ShopsPage from './ShopsPage'

export default function App() {
  // Ha van mentett token, frissites utan is belepve marad
  const [loggedIn, setLoggedIn] = useState(getToken() !== null)
  // Melyik ful latszik
  const [tab, setTab] = useState<'shops' | 'bikes'>('shops')
  // Kezdo tema
  const [theme, setTheme] = useState(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  // Temavaltaskor atallitja es elmenti
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  function logout() {
    clearToken()
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Bike Locator</div>
        <nav className="tabs">
          <button className={tab === 'shops' ? 'active' : ''} onClick={() => setTab('shops')}>
            Boltok
          </button>
          <button className={tab === 'bikes' ? 'active' : ''} onClick={() => setTab('bikes')}>
            Hirdetések
          </button>
        </nav>
        <div className="topbar-actions">
          <button
            className="secondary icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Világos téma' : 'Sötét téma'}
          >
            {theme === 'dark' ? '☀︎' : '☾︎'}
          </button>
          <button className="secondary" onClick={logout}>Kilépés</button>
        </div>
      </header>
      <main className="content">{tab === 'shops' ? <ShopsPage /> : <BikesPage />}</main>
    </div>
  )
}
