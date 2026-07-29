import { useState } from 'react'
import { useShop } from '../store/ShopContext'

interface CartScreenProps {
  onCheckout: () => void
  onProductSelect: (productId: string) => void
}

export default function CartScreen({ onCheckout, onProductSelect }: CartScreenProps) {
  const { cart, updateCartQty } = useShop()
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const shipping = subtotal - discount > 50 || subtotal === 0 ? 0 : 4.99
  const total = subtotal - discount + shipping

  const applyPromo = () => {
    if (promo.trim().toUpperCase() === 'SHOPEASE10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoApplied(false)
      setPromoError('Invalid code. Try SHOPEASE10')
    }
  }

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-canvas px-8 text-center">
        <div className="w-20 h-20 bg-surface border border-rule rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-xl text-ink mb-2">Your bag is empty</h2>
        <p className="text-ink-3 font-body text-sm leading-relaxed">
          Add items to your cart and they will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-canvas">
      <div className="shrink-0 px-5 pt-14 pb-5 bg-canvas">
        <h1 className="font-display font-bold text-2xl text-ink">
          Your Bag{' '}
          <span className="text-ink-3 font-normal text-lg">
            ({cart.reduce((s, i) => s + i.quantity, 0)})
          </span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5">
        <div className="flex flex-col gap-3 pb-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedSize ?? ''}`}
              className="bg-surface border border-rule rounded-2xl p-4 flex gap-4"
            >
              <button
                type="button"
                onClick={() => onProductSelect(item.product.id)}
                className="shrink-0"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-canvas">
                  <img
                    src={`https://images.unsplash.com/${item.product.imageId}?w=160&h=160&fit=crop&auto=format`}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-ink-3 text-[10px] font-body uppercase tracking-widest mb-0.5">
                  {item.product.category}
                </p>
                <p className="font-display font-semibold text-ink text-sm leading-tight mb-1 truncate">
                  {item.product.name}
                </p>
                {item.selectedSize && (
                  <p className="text-ink-3 font-body text-xs mb-2">Size: {item.selectedSize}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-base text-ink">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                  <div className="flex items-center gap-1 bg-canvas border border-rule rounded-lg px-2 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQty(item.product.id, item.quantity - 1, item.selectedSize)
                      }
                      className="w-6 h-6 flex items-center justify-center text-ink font-bold"
                    >
                      −
                    </button>
                    <span className="font-display font-semibold text-ink text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQty(item.product.id, item.quantity + 1, item.selectedSize)
                      }
                      className="w-6 h-6 flex items-center justify-center text-ink font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-rule rounded-2xl p-5 mb-4">
          <h3 className="font-display font-semibold text-sm text-ink mb-4">Order Summary</h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-ink-2">Subtotal</span>
              <span className="font-display font-semibold text-sm text-ink">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            {promoApplied && (
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-ink-2">Promo (10%)</span>
                <span className="font-display font-semibold text-sm text-success">
                  −${discount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="font-body text-sm text-ink-2">Shipping</span>
              <span
                className={`font-display font-semibold text-sm ${shipping === 0 ? 'text-success' : 'text-ink'}`}
              >
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {shipping === 0 && (
              <p className="text-ink-3 font-body text-xs">Free shipping on orders over $50</p>
            )}
            <div className="h-px bg-rule" />
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-base text-ink">Total</span>
              <span className="font-display font-extrabold text-xl text-ink">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              placeholder="Promo code"
              aria-label="Promo code"
              className="flex-1 bg-surface border border-rule rounded-xl px-4 py-3 font-body text-sm text-ink outline-none placeholder:text-ink-3"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="px-4 py-3 border border-ink rounded-xl font-display font-semibold text-sm text-ink"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="mt-2 font-body text-xs text-red-500">{promoError}</p>
          )}
          {promoApplied && (
            <p className="mt-2 font-body text-xs text-success">SHOPEASE10 applied — 10% off</p>
          )}
        </div>
      </div>

      <div className="shrink-0 bg-surface border-t border-rule px-5 py-4">
        <button
          type="button"
          onClick={onCheckout}
          className="w-full min-h-11 bg-brand text-white font-display font-bold text-base py-4 rounded-xl transition-all active:bg-brand-hover active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Proceed to Checkout — ${total.toFixed(2)}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
