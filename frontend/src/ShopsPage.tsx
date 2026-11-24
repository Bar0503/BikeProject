import { useEffect, useState } from 'react'
import { apiFetch, type Shop } from './api'
import ShopForm from './ShopForm'

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingShop, setEditingShop] = useState<Shop | null>(null) // null = uj bolt

  async function loadShops() {
    try {
      setShops(await apiFetch<Shop[]>('/api/shops'))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  // Egyszer fut le, amikor megjelenik az oldal
  useEffect(() => {
    loadShops()
  }, [])

  function openForm(shop: Shop | null) {
    setError('') // Regi hibauzenet eltuntetese
    setEditingShop(shop)
    setShowForm(true)
  }

  async function handleSaved() {
    setShowForm(false)
    await loadShops()
  }

  async function handleDelete(shop: Shop) {
    if (!confirm(`Biztosan törlöd ezt a boltot: ${shop.name}?`)) return
    setError('')
    try {
      await apiFetch(`/api/shops/${shop.id}`, 'DELETE')
      await loadShops()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2>Boltok ({shops.length})</h2>
        <button onClick={() => openForm(null)}>+ Új bolt</button>
      </div>

      {showForm && (
        // A key miatt mindig friss urlap nyilik
        <ShopForm
          key={editingShop?.id ?? 'new'}
          shop={editingShop}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      {error && <p className="error">{error}</p>}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Név</th>
              <th>Város</th>
              <th>Weboldal</th>
              <th className="num">Alapítva</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id}>
                <td className="id">#{shop.id}</td>
                <td className="strong">{shop.name}</td>
                <td>{shop.city}</td>
                <td>
                  {shop.website ? (
                    <a href={shop.website} target="_blank" rel="noreferrer">
                      {shop.website.replace('https://', '')}
                    </a>
                  ) : (
                    <span className="muted">-</span>
                  )}
                </td>
                <td className="num">{shop.founded_year}</td>
                <td>
                  <div className="actions">
                    <button className="small secondary" onClick={() => openForm(shop)}>Szerkesztés</button>
                    <button className="small danger" onClick={() => handleDelete(shop)}>Törlés</button>
                  </div>
                </td>
              </tr>
            ))}
            {shops.length === 0 && (
              <tr>
                <td className="empty" colSpan={6}>Nincs bolt.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
