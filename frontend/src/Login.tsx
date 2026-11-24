import { useState, type SubmitEvent } from 'react'
import { apiFetch, saveToken } from './api'

type Props = {
  onLogin: () => void
}

export default function Login({ onLogin }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault() // Ne toltse ujra az oldalt
    setError('')
    try {
      const data = await apiFetch<{ access_token: string }>('/api/login', 'POST', { username, password })
      saveToken(data.access_token)
      onLogin()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div className="login-page">
      <form className="login" onSubmit={handleSubmit}>
        <div className="brand">Bike Locator</div>
        <p className="subtitle">Bejelentkezés</p>
        <label>
          Felhasználónév
          <input value={username} onChange={(e) => setUsername(e.target.value)} required autoFocus />
        </label>
        <label>
          Jelszó
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Belépés</button>
      </form>
    </div>
  )
}
