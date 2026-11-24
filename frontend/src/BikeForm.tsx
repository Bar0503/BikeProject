import { useEffect, useState, type SubmitEvent } from 'react'
import { apiFetch, type Bike, type Shop } from './api'

type Props = {
  bike: Bike | null // null = uj hirdetes     nem null = szerkesztes
  onSaved: () => void
  onCancel: () => void
}

export default function BikeForm({ bike, onSaved, onCancel }: Props) {
  const [title, setTitle] = useState(bike?.title ?? '')
  const [brand, setBrand] = useState(bike?.brand ?? '')
  const [price, setPrice] = useState(bike?.price?.toString() ?? '')
  const [year, setYear] = useState(bike?.year?.toString() ?? '')
  const [condition, setCondition] = useState(bike?.condition ?? 'used')
  const [shopId, setShopId] = useState(bike?.shop_id.toString() ?? '')
  const [shops, setShops] = useState<Shop[]>([])
  const [error, setError] = useState('')

  // Boltok betoltese a legordulo listahoz
  useEffect(() => {
    apiFetch<Shop[]>('/api/shops')
      .then(setShops)
      .catch((err) => setError((err as Error).message))
  }, [])

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const data = {
      title,
      brand: brand.trim() || null,
      price: price ? Number(price) : null,
      year: year ? Number(year) : null,
      condition,
      shop_id: Number(shopId),
    }
    try {
      if (bike) {
        await apiFetch(`/api/bikes/${bike.id}`, 'PUT', data)
      } else {
        await apiFetch('/api/bikes', 'POST', data)
      }
      onSaved()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <form className="form-panel" onSubmit={handleSubmit}>
      <h2>{bike ? 'Hirdetés szerkesztése' : 'Új hirdetés'}</h2>
      <div className="form-grid">
        <label>
          Cím *
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Márka
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />
        </label>
        <label>
          Ár (Ft)
          <input type="number" min="0" max="1000000000" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <label>
          Évjárat
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </label>
        <label>
          Állapot *
          <select value={condition} onChange={(e) => setCondition(e.target.value as 'new' | 'used')}>
            <option value="new">Új</option>
            <option value="used">Használt</option>
          </select>
        </label>
        <label>
          Bolt *
          <select value={shopId} onChange={(e) => setShopId(e.target.value)} required>
            <option value="">Válassz boltot...</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>{shop.name}</option>
            ))}
          </select>
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
