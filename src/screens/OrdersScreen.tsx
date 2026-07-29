import type { Order } from '../types'
import { useShop } from '../store/ShopContext'

const STATUS_COLORS: Record<Order['status'], string> = {
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-badge-blue/10 text-badge-blue',
  Delivered: 'bg-success/10 text-success',
}

const TIMELINE: Record<Order['status'], string[]> = {
  Processing: ['Order Confirmed', 'Preparing', 'Shipped', 'Delivered'],
  Shipped: ['Order Confirmed', 'Prepared', 'Shipped', 'Delivered'],
  Delivered: ['Order Confirmed', 'Prepared', 'Shipped', 'Delivered'],
}

const TIMELINE_DONE: Record<Order['status'], number> = {
  Processing: 1,
  Shipped: 3,
  Delivered: 4,
}

export default function OrdersScreen() {
  const { orders, user } = useShop()
  const visible = orders.filter(
    (o) => !o.userEmail || !user?.email || o.userEmail === user.email
  )

  if (visible.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-5 pt-14 pb-5 shrink-0">
          <h1 className="font-display font-bold text-2xl text-ink">My Orders</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-20 h-20 bg-surface border border-rule rounded-full flex items-center justify-center mb-6">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <h2 className="font-display font-bold text-xl text-ink mb-2">No orders yet</h2>
          <p className="text-ink-3 font-body text-sm leading-relaxed">
            When you place an order it will appear here with full tracking details.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-canvas">
      <div className="shrink-0 px-5 pt-14 pb-5">
        <h1 className="font-display font-bold text-2xl text-ink">My Orders</h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 pb-6">
        <div className="flex flex-col gap-4">
          {visible.map((order) => {
            const doneCount = TIMELINE_DONE[order.status]
            const steps = TIMELINE[order.status]

            return (
              <div key={order.id} className="bg-surface border border-rule rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-rule">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-display font-bold text-base text-ink">{order.id}</p>
                      <p className="text-ink-3 font-body text-xs mt-0.5">{order.date}</p>
                    </div>
                    <span
                      className={`text-xs font-display font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-ink-2 font-body text-sm mt-2">
                    Est. delivery:{' '}
                    <span className="font-medium text-ink">{order.estimatedDelivery}</span>
                  </p>
                </div>

                <div className="px-5 py-4 border-b border-rule">
                  <div className="flex gap-2 mb-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedSize ?? ''}`}
                        className="w-12 h-12 rounded-xl overflow-hidden bg-canvas border border-rule"
                      >
                        <img
                          src={`https://images.unsplash.com/${item.product.imageId}?w=96&h=96&fit=crop&auto=format`}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-xl bg-canvas border border-rule flex items-center justify-center">
                        <span className="font-display font-bold text-xs text-ink-3">
                          +{order.items.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-3 font-body text-xs">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="font-display font-bold text-base text-ink">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="flex items-center gap-0">
                    {steps.map((label, i) => {
                      const done = i < doneCount
                      const active = i === doneCount - 1

                      return (
                        <div key={label} className="flex items-center flex-1">
                          <div className="flex flex-col items-center gap-1">
                            <div
                              className={`w-3 h-3 rounded-full border-2 ${
                                done
                                  ? active && order.status !== 'Delivered'
                                    ? 'border-brand bg-brand'
                                    : 'border-success bg-success'
                                  : 'border-rule bg-surface'
                              }`}
                            />
                            <span
                              style={{ fontSize: 9 }}
                              className={`font-body text-center leading-tight max-w-[50px] ${
                                done ? 'text-ink-2 font-medium' : 'text-ink-3'
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={`flex-1 h-0.5 mb-4 ${i < doneCount - 1 ? 'bg-success' : 'bg-rule'}`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
