import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product, CartItem, Order, OrderStatus, StoreSettings, AdminSession } from './types'
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS } from './defaults'
import { ils } from './security'

// ═══════════════════════════════════════════════════════
//  STORE TYPES
// ═══════════════════════════════════════════════════════
interface AppState {
  // Products
  products:    Product[]
  filter:      string
  search:      string
  setProducts: (p: Product[]) => void
  setFilter:   (f: string) => void
  setSearch:   (s: string) => void

  // Cart
  cart:        CartItem[]
  addToCart:   (id: string) => string | null  // returns error or null
  removeFromCart: (id: string) => void
  changeQty:   (id: string, delta: number) => void
  clearCart:   () => void

  // Orders
  orders:      Order[]
  addOrder:    (o: Order) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  cancelOrder: (id: string) => void  // also restores stock

  // Settings
  settings:    StoreSettings
  setSettings: (s: StoreSettings) => void

  // UI panels
  cartOpen:     boolean
  openCart:     () => void
  closeCart:    () => void

  // Computed helpers
  cartTotal:    () => number
  cartCount:    () => number
  cartTotalILS: () => string
  filteredProducts: () => Product[]
}

// ═══════════════════════════════════════════════════════
//  ADMIN SESSION — in memory only, never persisted
// ═══════════════════════════════════════════════════════
interface AdminState {
  session: AdminSession | null
  setSession: (s: AdminSession | null) => void
  isLoggedIn: () => boolean
  getToken:   () => string | null
}

// ═══════════════════════════════════════════════════════
//  MAIN STORE  (persisted to localStorage)
// ═══════════════════════════════════════════════════════
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Products ──────────────────────────────────────
      products: DEFAULT_PRODUCTS,
      filter:   'All',
      search:   '',

      setProducts: (products) => set({ products }),
      setFilter:   (filter)   => set({ filter }),
      setSearch:   (search)   => set({ search }),

      // ── Cart ──────────────────────────────────────────
      cart: [],

      addToCart: (id) => {
        const { products, cart } = get()
        const prod = products.find(p => p.id === id)
        if (!prod || prod.stock <= 0) return 'Out of stock'
        const item = cart.find(i => i.id === id)
        if (item && item.qty >= prod.stock) return 'Maximum stock reached'
        if (item) {
          set({ cart: cart.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i) })
        } else {
          set({ cart: [...cart, { id, qty: 1 }] })
        }
        return null
      },

      removeFromCart: (id) => set(s => ({ cart: s.cart.filter(i => i.id !== id) })),

      changeQty: (id, delta) => {
        const { cart, products } = get()
        const item = cart.find(i => i.id === id)
        if (!item) return
        const prod = products.find(p => p.id === id)
        const newQty = item.qty + delta
        if (newQty <= 0) {
          set({ cart: cart.filter(i => i.id !== id) })
        } else if (prod && newQty > prod.stock) {
          // silently cap at stock
        } else {
          set({ cart: cart.map(i => i.id === id ? { ...i, qty: newQty } : i) })
        }
      },

      clearCart: () => set({ cart: [] }),

      // ── Orders ────────────────────────────────────────
      orders: [],

      addOrder: (order) => set(s => ({ orders: [order, ...s.orders] })),

      updateOrderStatus: (id, status) =>
        set(s => ({
          orders: s.orders.map(o => o.id === id ? { ...o, status } : o),
        })),

      cancelOrder: (id) => set(s => {
        const order = s.orders.find(o => o.id === id)
        if (!order) return {}
        // Restore stock
        const products = s.products.map(p => {
          const item = order.items.find(i => i.id === p.id)
          return item ? { ...p, stock: p.stock + item.qty } : p
        })
        return {
          products,
          orders: s.orders.map(o => o.id === id ? { ...o, status: 'Cancelled' as const } : o),
        }
      }),

      // ── Settings ──────────────────────────────────────
      settings: DEFAULT_SETTINGS,
      setSettings: (settings) => set({ settings }),

      // ── UI ────────────────────────────────────────────
      cartOpen: false,
      openCart:  () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),

      // ── Computed ──────────────────────────────────────
      cartTotal: () => {
        const { cart, products } = get()
        return cart.reduce((sum, ci) => {
          const p = products.find(x => x.id === ci.id)
          return sum + (p ? p.price * ci.qty : 0)
        }, 0)
      },

      cartCount: () => get().cart.reduce((s, i) => s + i.qty, 0),
      cartTotalILS: () => ils(get().cartTotal()),

      filteredProducts: () => {
        const { products, filter, search } = get()
        let list = filter === 'All' ? products : products.filter(p => p.category === filter)
        if (search) {
          const q = search.toLowerCase()
          list = list.filter(p =>
            `${p.name} ${p.desc} ${p.category}`.toLowerCase().includes(q)
          )
        }
        return list
      },
    }),
    {
      name:    'mtflix-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        products: s.products,
        orders:   s.orders,
        cart:     s.cart,
        settings: s.settings,
      }),
    }
  )
)

// ═══════════════════════════════════════════════════════
//  ADMIN STORE  (never persisted — memory only)
// ═══════════════════════════════════════════════════════
export const useAdmin = create<AdminState>()((set, get) => ({
  session: null,

  setSession: (session) => set({ session }),

  isLoggedIn: () => {
    const { session } = get()
    return session !== null && Date.now() < session.expiresAt
  },

  getToken: () => {
    const { session } = get()
    return session !== null && Date.now() < session.expiresAt ? session.token : null
  },
}))
