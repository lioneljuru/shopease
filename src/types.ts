export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  imageId: string
  badge?: 'Sale' | 'New'
  description: string
  sizes?: string[]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  date: string
  status: 'Processing' | 'Shipped' | 'Delivered'
  estimatedDelivery: string
  userEmail?: string
}

export interface User {
  name: string
  email: string
}

/** Demo-only stored account (plain password — not for production). */
export interface StoredAccount {
  name: string
  email: string
  password: string
}

export type NavTab = 'home' | 'search' | 'cart' | 'orders' | 'profile'
