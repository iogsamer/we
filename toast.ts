import type { Order, Product, OrderStatus } from './types'

const BASE = '/api'
const TIMEOUT_MS = 9000

async function request<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: unknown,
  headers: Record<string, string> = {},
): Promise<T | null> {
  const ctrl = new AbortController()
  const tid  = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    clearTimeout(tid)
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string }
      console.warn(`API ${method} ${path} → ${res.status}:`, err.error)
      return null
    }
    return await res.json() as T
  } catch (e) {
    clearTimeout(tid)
    if ((e as Error).name !== 'AbortError') console.warn(`API ${path} failed:`, (e as Error).message)
    return null
  }
}

// ─── Products ───────────────────────────────────────────
export const api = {
  async getProducts(): Promise<Product[] | null> {
    const r = await request<{ products: Product[] }>('/products')
    return r?.products ?? null
  },

  async saveProducts(products: Product[], token: string): Promise<boolean> {
    const r = await request('/products', 'PUT', { products }, { 'X-Admin-Token': token })
    return r !== null
  },

  // ─── Orders ─────────────────────────────────────────
  async createOrder(order: Order): Promise<boolean> {
    const r = await request('/orders', 'POST', order)
    return r !== null
  },

  async getOrders(token: string): Promise<Order[] | null> {
    const r = await request<{ orders: Order[] }>('/orders', 'GET', undefined, { 'X-Admin-Token': token })
    return r?.orders ?? null
  },

  async updateOrderStatus(id: string, status: OrderStatus, token: string): Promise<boolean> {
    const r = await request('/orders', 'PUT', { id, status }, { 'X-Admin-Token': token })
    return r !== null
  },

  // ─── Payment ────────────────────────────────────────
  async createPaymentIntent(amount: number): Promise<string | null> {
    const r = await request<{ clientSecret: string }>(
      '/payment', 'POST',
      { amount, currency: 'ils', description: 'MTFLIX Order' },
    )
    return r?.clientSecret ?? null
  },
}
