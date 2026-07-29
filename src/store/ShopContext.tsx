import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { loadJSON, saveJSON, removeKey } from '../lib/storage'
import type { CartItem, Order, Product, StoredAccount, User } from '../types'

interface ShopContextValue {
  user: User | null
  cart: CartItem[]
  orders: Order[]
  latestOrderId: string
  cartCount: number
  toast: string | null
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  register: (
    name: string,
    email: string,
    password: string
  ) => { ok: true } | { ok: false; error: string }
  loginAsGuest: (name: string, email: string) => void
  logout: () => void
  addToCart: (product: Product, quantity: number, selectedSize?: string) => void
  updateCartQty: (productId: string, qty: number, selectedSize?: string) => void
  placeOrder: () => string
  clearLatestOrderId: () => void
  showToast: (message: string) => void
}

const ShopContext = createContext<ShopContextValue | null>(null)

function generateOrderId() {
  return `SE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
}

function sameLine(a: CartItem, productId: string, selectedSize?: string) {
  return a.product.id === productId && a.selectedSize === selectedSize
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadJSON<User | null>('session', null))
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON<CartItem[]>('cart', []))
  const [orders, setOrders] = useState<Order[]>(() => loadJSON<Order[]>('orders', []))
  const [latestOrderId, setLatestOrderId] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    saveJSON('session', user)
  }, [user])

  useEffect(() => {
    saveJSON('cart', cart)
  }, [cart])

  useEffect(() => {
    saveJSON('orders', orders)
  }, [orders])

  const showToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    const accounts = loadJSON<StoredAccount[]>('user', [])
    const account = accounts.find((a) => a.email.toLowerCase() === normalized)

    if (account) {
      if (account.password !== password) {
        return { ok: false as const, error: 'Incorrect email or password' }
      }
      setUser({ name: account.name, email: account.email })
      return { ok: true as const }
    }

    // First-time demo login: accept any valid email and create a session
    const nameFromEmail = normalized.split('@')[0]?.replace(/[._]/g, ' ') ?? 'Shopper'
    const displayName = nameFromEmail
      .split(' ')
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Aline Uwase'

    setUser({ name: displayName, email: normalized })
    return { ok: true as const }
  }, [])

  const register = useCallback((name: string, email: string, password: string) => {
    const normalized = email.trim().toLowerCase()
    const accounts = loadJSON<StoredAccount[]>('user', [])
    if (accounts.some((a) => a.email.toLowerCase() === normalized)) {
      return { ok: false as const, error: 'An account with this email already exists' }
    }
    const next: StoredAccount = {
      name: name.trim(),
      email: normalized,
      password,
    }
    saveJSON('user', [...accounts, next])
    setUser({ name: next.name, email: next.email })
    return { ok: true as const }
  }, [])

  const loginAsGuest = useCallback((name: string, email: string) => {
    setUser({ name, email: email.toLowerCase() })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCart([])
    removeKey('session')
    saveJSON('cart', [])
  }, [])

  const addToCart = useCallback(
    (product: Product, quantity: number, selectedSize?: string) => {
      setCart((prev) => {
        const idx = prev.findIndex((item) => sameLine(item, product.id, selectedSize))
        if (idx >= 0) {
          return prev.map((item, i) =>
            i === idx ? { ...item, quantity: item.quantity + quantity } : item
          )
        }
        return [...prev, { product, quantity, selectedSize }]
      })
      showToast('Added to cart')
    },
    [showToast]
  )

  const updateCartQty = useCallback(
    (productId: string, qty: number, selectedSize?: string) => {
      if (qty <= 0) {
        setCart((prev) => prev.filter((item) => !sameLine(item, productId, selectedSize)))
      } else {
        setCart((prev) =>
          prev.map((item) =>
            sameLine(item, productId, selectedSize) ? { ...item, quantity: qty } : item
          )
        )
      }
    },
    []
  )

  const placeOrder = useCallback(() => {
    const id = generateOrderId()
    const eta = new Date()
    eta.setDate(eta.getDate() + 4)
    const etaStr = eta.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })

    const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = subtotal > 50 ? 0 : 4.99

    const order: Order = {
      id,
      items: [...cart],
      total: subtotal + shipping,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Processing',
      estimatedDelivery: etaStr,
      userEmail: user?.email,
    }

    setOrders((prev) => [order, ...prev])
    setLatestOrderId(id)
    setCart([])
    return id
  }, [cart, user?.email])

  const clearLatestOrderId = useCallback(() => setLatestOrderId(''), [])

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  )

  const value = useMemo(
    () => ({
      user,
      cart,
      orders,
      latestOrderId,
      cartCount,
      toast,
      login,
      register,
      loginAsGuest,
      logout,
      addToCart,
      updateCartQty,
      placeOrder,
      clearLatestOrderId,
      showToast,
    }),
    [
      user,
      cart,
      orders,
      latestOrderId,
      cartCount,
      toast,
      login,
      register,
      loginAsGuest,
      logout,
      addToCart,
      updateCartQty,
      placeOrder,
      clearLatestOrderId,
      showToast,
    ]
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
