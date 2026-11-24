export type Shop = {
  id: number
  name: string
  city: string | null
  website: string | null
  founded_year: number | null
}

export type Bike = {
  id: number
  title: string
  brand: string | null
  price: number | null
  year: number | null
  condition: 'new' | 'used'
  shop_id: number
  shop_name: string
}

// A token a bongeszo ful bezarasaig marad meg
const TOKEN_KEY = 'token'

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function saveToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
}

export async function apiFetch<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  // Lejart vagy rossz token, kileptetes
  if (response.status === 401 && token) {
    clearToken()
    window.location.reload()
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(errorMessage(data, response.status))
  }

  // Torlesnel nincs valasz torzs
  if (response.status === 204) {
    return undefined as T
  }
  return response.json()
}

function errorMessage(data: { detail?: unknown } | null, status: number): string {
  // Szoveges vagy lista hiba
  if (typeof data?.detail === 'string') {
    return data.detail
  }
  if (Array.isArray(data?.detail)) {
    return 'Hibás adat: ' + data.detail.map(validationMessage).join(', ')
  }
  // Nincs JSON valasz, pl. ha nem fut a backend
  return `A szerver nem érhető el vagy hibát adott (${status})`
}

// Mezonevek magyarul
const FIELD_LABELS: Record<string, string> = {
  name: 'Név', city: 'Város', website: 'Weboldal', founded_year: 'Alapítás éve',
  title: 'Cím', brand: 'Márka', price: 'Ár', year: 'Évjárat', condition: 'Állapot', shop_id: 'Bolt',
}

type ValidationError = { type: string; loc: string[]; msg: string; ctx?: { ge?: number; le?: number } }

// 422-es hiba magyarul
function validationMessage(error: ValidationError): string {
  const field = error.loc[error.loc.length - 1]
  const label = FIELD_LABELS[field] ?? field
  const messages: Record<string, string> = {
    missing: 'kötelező',
    string_too_short: 'nem lehet üres',
    greater_than_equal: `legalább ${error.ctx?.ge}`,
    less_than_equal: `legfeljebb ${error.ctx?.le}`,
    int_parsing: 'egész számnak kell lennie',
    int_type: 'egész számnak kell lennie',
    int_from_float: 'egész számnak kell lennie',
    literal_error: 'érvénytelen érték',
    string_pattern_mismatch: 'http:// vagy https:// kezdetű cím kell',
  }
  // Ismeretlen hibanal angol szoveg
  return `${label}: ${messages[error.type] ?? error.msg}`
}
