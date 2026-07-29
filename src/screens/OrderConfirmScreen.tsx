interface OrderConfirmScreenProps {
  orderNumber: string
  onTrackOrder: () => void
  onContinueShopping: () => void
}

export default function OrderConfirmScreen({
  orderNumber,
  onTrackOrder,
  onContinueShopping,
}: OrderConfirmScreenProps) {
  const eta = new Date()
  eta.setDate(eta.getDate() + 4)
  const etaStr = eta.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="h-full flex flex-col bg-canvas">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-20 h-20 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-6">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-display font-extrabold text-3xl text-ink mb-2">Order placed!</h1>
        <p className="font-body text-ink-2 text-sm leading-relaxed mb-8 max-w-xs">
          Thanks for shopping with ShopEase. We&apos;re getting your order ready.
        </p>

        <div className="w-full bg-surface border border-rule rounded-2xl p-5 mb-4 text-left">
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-ink-3 mb-2">
            Order number
          </p>
          <p className="font-display font-bold text-xl text-ink mb-4">{orderNumber}</p>
          <div className="h-px bg-rule mb-4" />
          <p className="font-body text-sm text-ink-2">
            Estimated delivery:{' '}
            <span className="font-medium text-ink">{etaStr}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-ink-3 mb-8">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A9A96"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <p className="font-body text-xs">A confirmation was saved to your orders</p>
        </div>
      </div>

      <div className="shrink-0 bg-surface border-t border-rule px-5 py-4 flex flex-col gap-3">
        <button
          onClick={onTrackOrder}
          className="w-full bg-brand text-white font-display font-bold text-base py-4 rounded-xl transition-all active:bg-brand-hover active:scale-[0.98]"
        >
          Track Order
        </button>
        <button
          onClick={onContinueShopping}
          className="w-full border border-rule bg-surface text-ink font-display font-semibold text-base py-4 rounded-xl transition-all active:bg-canvas"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
