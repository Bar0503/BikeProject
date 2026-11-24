import { useState, type SubmitEvent } from 'react'
import { apiFetch, type Shop } from './api'

type Props = {
  shop: Shop | null // null = uj bolt     nem null = szerkesztes
  onSaved: () => void
  onCancel: () => void
}

export default function ShopForm({ shop, onSaved, onCancel }: Props) {
  // Szerkesztesnel kitoltve, ujnal uresen indul
  const [name, setName] = useState(shop?.name ?? '')
  const [city, setCity] = useState(shop?.city ?? '')
  const [website, setWebsite] = useState(shop?.website ?? '')
  const [foundedYear, setFoundedYear] = useState(shop?.founded_year?.toString() ?? '')
  const [error, setError] = useState('')

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = {
      name,
      city: city.trim() || null,
      website: website.trim() || null,
      founded_year: foundedYear ? Number(foundedYear) : null,
    }
    try {
      if (shop) {
        await apiFetch(`/api/shops/${shop.id}`, 'PUT', data)
      } else {
        await apiFetch('/api/shops', 'POST', data)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <h2>{shop ? 'Bolt szerkesztése' : 'Új bolt'}</h2>
      <div className="form-grid">
        <label>
          Név *
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Város
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>
        <label>
          Weboldal
          <input type="url" placeholder="https://" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
        <label>
          Alapítás éve
          <input type="number" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="form-buttons">
        <button type="submit">Mentés</button>
        <button type="button" className="secondary" onClick={onCancel}>Mégse</button>
      </div>
    </form>
  )
}
