import { useEffect, useState } from 'react'
import { apiFetch, type Bike } from './api'
import BikeForm from './BikeForm'

const CONDITION_LABELS = { new: 'Új', used: 'Használt' }

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingBike, setEditingBike] = useState<Bike | null>(null) // null = uj hirdetes

  async function loadBikes() {
    try {
      setBikes(await apiFetch<Bike[]>('/api/bikes'))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  useEffect(() => {
    loadBikes()
  }, [])

  function openForm(bike: Bike | null) {
    setError('') // Regi hibauzenet eltuntetese
    setEditingBike(bike)
    setShowForm(true)
  }

  async function handleSaved() {
    setShowForm(false)
    await loadBikes()
  }

  async function handleDelete(bike: Bike) {
    if (!confirm(`Biztosan törlöd ezt a hirdetést: ${bike.title}?`)) return
    setError('')
    try {
      await apiFetch(`/api/bikes/${bike.id}`, 'DELETE')
      await loadBikes()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <section>
      <div className="page-header">
        <h2>Hirdetések ({bikes.length})</h2>
        <button onClick={() => openForm(null)}>+ Új hirdetés</button>
      </div>

      {showForm && (
        <BikeForm
          key={editingBike?.id ?? 'new'}
          bike={editingBike}
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
              <th>Cím</th>
              <th>Márka</th>
              <th className="num">Ár</th>
              <th className="num">Évjárat</th>
              <th>Állapot</th>
              <th>Bolt</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.id}>
                <td className="id">#{bike.id}</td>
                <td className="strong">{bike.title}</td>
                <td>{bike.brand}</td>
                <td className="num">{bike.price !== null && `${bike.price.toLocaleString('hu-HU')} Ft`}</td>
                <td className="num">{bike.year}</td>
                <td>{CONDITION_LABELS[bike.condition]}</td>
                <td className="muted">{bike.shop_name}</td>
                <td>
                  <div className="actions">
                    <button className="small secondary" onClick={() => openForm(bike)}>Szerkesztés</button>
                    <button className="small danger" onClick={() => handleDelete(bike)}>Törlés</button>
                  </div>
                </td>
              </tr>
            ))}
            {bikes.length === 0 && (
              <tr>
                <td className="empty" colSpan={8}>Nincs hirdetés.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
