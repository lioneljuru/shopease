import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CartItem } from '../types'
import { useShop } from '../store/ShopContext'

type Step = 'address' | 'payment'

export default function CheckoutScreen({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate()
  const { cart, placeOrder, user } = useShop()
  const [step, setStep] = useState<Step>('address')
  const [focused, setFocused] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [address, setAddress] = useState({
    name: user?.name ?? '',
    line1: '',
    city: '',
    postal: '',
    phone: '',
  })
  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: user?.name ?? '',
  })
  const [payMethod, setPayMethod] = useState<'card' | 'pod'>('card')

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 4.99
  const total = subtotal + shipping

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
  }

  const steps: Step[] = ['address', 'payment']
  const stepLabels: Record<Step, string> = { address: 'Shipping', payment: 'Payment' }

  const validateAddress = () => {
    const next: Record<string, string> = {}
    if (!address.name.trim()) next.name = 'Full name is required'
    if (!address.line1.trim()) next.line1 = 'Street address is required'
    if (!address.city.trim()) next.city = 'City is required'
    if (!address.postal.trim()) next.postal = 'Postal code is required'
    if (!address.phone.trim()) next.phone = 'Phone number is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const validatePayment = () => {
    if (payMethod === 'pod') {
      setErrors({})
      return true
    }
    const next: Record<string, string> = {}
    const digits = payment.cardNumber.replace(/\s/g, '')
    if (digits.length < 16) next.cardNumber = 'Enter a valid 16-digit card number'
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) next.expiry = 'Use MM/YY'
    if (payment.cvv.length < 3) next.cvv = 'Enter CVV'
    if (!payment.name.trim()) next.cname = 'Name on card is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleCta = async () => {
    if (step === 'address') {
      if (!validateAddress()) return
      setStep('payment')
      return
    }
    if (!validatePayment()) return
    if (cart.length === 0) {
      navigate('/cart')
      return
    }

    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    const id = placeOrder()
    setSubmitting(false)
    navigate(`/order-confirm?id=${encodeURIComponent(id)}`, { replace: true })
  }

  const inputClass = (key: string) =>
    `w-full bg-surface border rounded-xl px-4 py-3.5 font-body text-sm text-ink outline-none placeholder:text-ink-3 transition-all ${
      errors[key] ? 'border-red-500' : focused === key ? 'border-ink' : 'border-rule'
    }`

  if (cart.length === 0 && step === 'address') {
    return (
      <div className="h-full flex flex-col items-center justify-center px-8 text-center bg-canvas">
        <h2 className="font-display font-bold text-xl text-ink mb-2">Nothing to checkout</h2>
        <p className="text-ink-3 font-body text-sm mb-6">Add items to your bag first.</p>
        <button
          onClick={onBack}
          className="bg-brand text-white font-display font-bold px-6 py-3 rounded-xl"
        >
          Back to Cart
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-canvas">
      <div className="shrink-0 bg-surface border-b border-rule px-5 pt-12 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => {
              if (step === 'payment') {
                setStep('address')
                setErrors({})
              } else onBack()
            }}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-rule shrink-0"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-display font-bold text-xl text-ink flex-1">Checkout</h1>
        </div>

        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-display font-bold transition-all ${
                    step === s
                      ? 'bg-brand text-white'
                      : steps.indexOf(step) > i
                        ? 'bg-success text-white'
                        : 'bg-rule text-ink-3'
                  }`}
                >
                  {steps.indexOf(step) > i ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`font-body font-medium text-sm ${
                    step === s ? 'text-ink' : 'text-ink-3'
                  }`}
                >
                  {stepLabels[s]}
                </span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-rule" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar px-5 py-6">
        {step === 'address' && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display font-semibold text-base text-ink">Delivery Address</h2>

            {(
              [
                { key: 'name', label: 'Full Name', placeholder: 'Aline Uwase', type: 'text' },
                { key: 'line1', label: 'Street Address', placeholder: 'KG 11 Ave, Kacyiru', type: 'text' },
                { key: 'city', label: 'City', placeholder: 'Kigali', type: 'text' },
                { key: 'postal', label: 'Postal Code', placeholder: '00000', type: 'text' },
                { key: 'phone', label: 'Phone Number', placeholder: '+250 7XX XXX XXX', type: 'tel' },
              ] as const
            ).map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block font-body font-medium text-xs text-ink uppercase tracking-widest mb-2">
                  {label}
                </label>
                <input
                  type={type}
                  value={address[key]}
                  onChange={(e) => setAddress((a) => ({ ...a, [key]: e.target.value }))}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  placeholder={placeholder}
                  className={inputClass(key)}
                />
                {errors[key] && (
                  <p className="mt-1.5 font-body text-xs text-red-500">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {step === 'payment' && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display font-semibold text-base text-ink">Payment Method</h2>

            <div className="flex gap-3">
              {(
                [
                  { id: 'card' as const, label: 'Credit / Debit Card' },
                  { id: 'pod' as const, label: 'Pay on Delivery' },
                ]
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setPayMethod(id)
                    setErrors({})
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border text-sm font-body font-medium transition-all ${
                    payMethod === id ? 'border-ink bg-ink text-white' : 'border-rule bg-surface text-ink-2'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {payMethod === 'card' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block font-body font-medium text-xs text-ink uppercase tracking-widest mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={payment.cardNumber}
                    onChange={(e) =>
                      setPayment((p) => ({ ...p, cardNumber: formatCard(e.target.value) }))
                    }
                    onFocus={() => setFocused('card')}
                    onBlur={() => setFocused(null)}
                    placeholder="1234 5678 9012 3456"
                    className={inputClass('cardNumber')}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1.5 font-body text-xs text-red-500">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-body font-medium text-xs text-ink uppercase tracking-widest mb-2">
                      Expiry
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={payment.expiry}
                      onChange={(e) =>
                        setPayment((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))
                      }
                      onFocus={() => setFocused('expiry')}
                      onBlur={() => setFocused(null)}
                      placeholder="MM/YY"
                      className={inputClass('expiry')}
                    />
                    {errors.expiry && (
                      <p className="mt-1.5 font-body text-xs text-red-500">{errors.expiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-body font-medium text-xs text-ink uppercase tracking-widest mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={payment.cvv}
                      onChange={(e) =>
                        setPayment((p) => ({
                          ...p,
                          cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                        }))
                      }
                      onFocus={() => setFocused('cvv')}
                      onBlur={() => setFocused(null)}
                      placeholder="•••"
                      className={inputClass('cvv')}
                    />
                    {errors.cvv && (
                      <p className="mt-1.5 font-body text-xs text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-body font-medium text-xs text-ink uppercase tracking-widest mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={payment.name}
                    onChange={(e) => setPayment((p) => ({ ...p, name: e.target.value }))}
                    onFocus={() => setFocused('cname')}
                    onBlur={() => setFocused(null)}
                    placeholder="Aline Uwase"
                    className={inputClass('cname')}
                  />
                  {errors.cname && (
                    <p className="mt-1.5 font-body text-xs text-red-500">{errors.cname}</p>
                  )}
                </div>
                <p className="font-body text-xs text-ink-3">
                  Demo mode — no real charge will be made.
                </p>
              </div>
            )}

            {payMethod === 'pod' && (
              <div className="bg-surface border border-rule rounded-2xl p-5">
                <p className="font-body text-ink-2 text-sm leading-relaxed">
                  You will pay the delivery agent when your order arrives. Additional handling fee may
                  apply.
                </p>
              </div>
            )}

            <OrderSummary cart={cart} total={total} />

            <div className="flex items-center gap-2 px-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <p className="text-ink-3 font-body text-xs">Your payment info is encrypted and secure</p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 bg-surface border-t border-rule px-5 py-4">
        <button
          type="button"
          disabled={submitting}
          onClick={handleCta}
          className="w-full min-h-11 bg-brand text-white font-display font-bold text-base py-4 rounded-xl transition-all active:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
        >
          {submitting
            ? 'Placing order…'
            : step === 'address'
              ? 'Continue to Payment'
              : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

function OrderSummary({ cart, total }: { cart: CartItem[]; total: number }) {
  return (
    <div className="bg-surface border border-rule rounded-2xl p-5">
      <h3 className="font-display font-semibold text-sm text-ink mb-4">Order Summary</h3>
      {cart.map((item) => (
        <div
          key={`${item.product.id}-${item.selectedSize ?? ''}`}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-canvas shrink-0">
              <img
                src={`https://images.unsplash.com/${item.product.imageId}?w=80&h=80&fit=crop&auto=format`}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm text-ink truncate">{item.product.name}</p>
              <p className="font-body text-xs text-ink-3">Qty: {item.quantity}</p>
            </div>
          </div>
          <span className="font-display font-semibold text-sm text-ink ml-3">
            ${(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}
      <div className="h-px bg-rule my-3" />
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-base text-ink">Total</span>
        <span className="font-display font-extrabold text-xl text-ink">${total.toFixed(2)}</span>
      </div>
    </div>
  )
}
