import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import { products } from './data/products'
import { useShop } from './store/ShopContext'
import type { NavTab } from './types'

import LoginScreen from './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import ProductListScreen from './screens/ProductListScreen'
import ProductDetailScreen from './screens/ProductDetailScreen'
import CartScreen from './screens/CartScreen'
import CheckoutScreen from './screens/CheckoutScreen'
import OrderConfirmScreen from './screens/OrderConfirmScreen'
import OrdersScreen from './screens/OrdersScreen'
import ProfileScreen from './screens/ProfileScreen'

const NAV_PATHS = ['/home', '/browse', '/search', '/cart', '/orders', '/profile']

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useShop()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

function RootRedirect() {
  const { user } = useShop()
  return <Navigate to={user ? '/home' : '/login'} replace />
}

function ProductDetailRoute() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useShop()
  const product = products.find((p) => p.id === id)

  if (!product) {
    return <Navigate to="/home" replace />
  }

  return (
    <ProductDetailScreen
      product={product}
      onBack={() => navigate(-1)}
      onAddToCart={addToCart}
      onGoToCart={() => navigate('/cart')}
    />
  )
}

function BrowseRoute() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const category = params.get('category') || 'All'

  return (
    <ProductListScreen
      category={category}
      isSearchMode={false}
      onProductSelect={(p) => navigate(`/product/${p.id}`)}
      onBack={() => navigate('/home')}
    />
  )
}

function SearchRoute() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialQuery = params.get('q') || ''

  return (
    <ProductListScreen
      category="All"
      isSearchMode
      initialQuery={initialQuery}
      onProductSelect={(p) => navigate(`/product/${p.id}`)}
      onBack={() => navigate('/home')}
    />
  )
}

function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount, toast, user } = useShop()

  const showNav = NAV_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  ) && location.pathname !== '/login'

  const activeTab: NavTab = (() => {
    const path = location.pathname
    if (path.startsWith('/search')) return 'search'
    if (path.startsWith('/browse')) return 'home'
    if (path.startsWith('/cart')) return 'cart'
    if (path.startsWith('/orders')) return 'orders'
    if (path.startsWith('/profile')) return 'profile'
    return 'home'
  })()

  const handleNavTab = (tab: NavTab) => {
    if (tab === 'home') navigate('/home')
    else if (tab === 'search') navigate('/search')
    else if (tab === 'cart') navigate('/cart')
    else if (tab === 'orders') navigate('/orders')
    else if (tab === 'profile') navigate('/profile')
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-0">
      <div
        className="relative flex flex-col bg-canvas overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 430,
          minHeight: '100vh',
          height: '100dvh',
        }}
      >
        <div className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/home" replace /> : <LoginScreen />}
            />
            <Route
              path="/home"
              element={
                <RequireAuth>
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    <HomeScreen
                      onProductSelect={(p) => navigate(`/product/${p.id}`)}
                      onCategorySelect={(cat) =>
                        navigate(`/browse?category=${encodeURIComponent(cat)}`)
                      }
                      onSearch={() => navigate('/search')}
                    />
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/browse"
              element={
                <RequireAuth>
                  <BrowseRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/search"
              element={
                <RequireAuth>
                  <SearchRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/product/:id"
              element={
                <RequireAuth>
                  <ProductDetailRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/cart"
              element={
                <RequireAuth>
                  <CartScreen
                    onCheckout={() => navigate('/checkout')}
                    onProductSelect={(id) => navigate(`/product/${id}`)}
                  />
                </RequireAuth>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireAuth>
                  <CheckoutScreen onBack={() => navigate('/cart')} />
                </RequireAuth>
              }
            />
            <Route
              path="/order-confirm"
              element={
                <RequireAuth>
                  <OrderConfirmRoute />
                </RequireAuth>
              }
            />
            <Route
              path="/orders"
              element={
                <RequireAuth>
                  <div className="h-full overflow-y-auto hide-scrollbar">
                    <OrdersScreen />
                  </div>
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfileScreen onViewOrders={() => navigate('/orders')} />
                </RequireAuth>
              }
            />
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </div>

        {showNav && (
          <BottomNav activeTab={activeTab} onTabChange={handleNavTab} cartCount={cartCount} />
        )}

        {toast && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="bg-ink text-white font-body text-sm font-medium px-5 py-3 rounded-full shadow-lg whitespace-nowrap">
              {toast}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function OrderConfirmRoute() {
  const navigate = useNavigate()
  const { latestOrderId, clearLatestOrderId } = useShop()
  const [params] = useSearchParams()
  const orderNumber = latestOrderId || params.get('id') || ''

  if (!orderNumber) {
    return <Navigate to="/orders" replace />
  }

  return (
    <OrderConfirmScreen
      orderNumber={orderNumber}
      onTrackOrder={() => {
        clearLatestOrderId()
        navigate('/orders')
      }}
      onContinueShopping={() => {
        clearLatestOrderId()
        navigate('/home')
      }}
    />
  )
}

export default function App() {
  return <AppShell />
}
