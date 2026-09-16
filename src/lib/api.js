import { supabase } from './supabase'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')

export async function fetchApi(endpoint, options = {}) {
  // Ambil token aktif saat ini (Supabase auto-refresh jika expired)
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `API Error: ${response.statusText}`)
  }

  return response.json()
}