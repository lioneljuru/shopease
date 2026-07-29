import { useState } from 'react'
import type { Product } from '../types'
import StarRating from '../components/StarRating'

interface ProductDetailScreenProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, quantity: number, selectedSize?: string) => void
  onGoToCart: () => void
}

const REVIEWS = [
  { name: 'Sarah M.', rating: 5, text: 'Absolutely love it. Quality is outstanding and it arrived faster than expected.' },
  { name: 'James K.', rating: 4, text: 'Great product, exactly as described. Packaging was excellent too.' },
  { name: 'Priya N.', rating: 5, text: 'Exceeded my expectations. Will definitely be ordering again.' },
]

export default function ProductDetailScreen({
  product,
  onBack,
  onAddToCart,
  onGoToCart,
}: ProductDetailScreenProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[1] ?? undefined)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <div className="h-full flex flex-col bg-canvas">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* Product image */}
        <div className="relative bg-surface" style={{ aspectRatio: '1 / 1' }}>
          <img
            src={`https://images.unsplash.com/${product.imageId}?w=800&h=800&fit=crop&auto=format`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {/* Top actions */}
          <div className="absolute top-12 left-5 right-5 flex items-center justify-between">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-sm"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setWishlisted((w) => !w)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/50 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? '#FF3B21' : 'none'} stroke={wishlisted ? '#FF3B21' : '#0F0F0F'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>
          {/* Badge */}
          {product.badge && (
            <div
              className={`absolute bottom-4 left-5 px-3 py-1 rounded-full text-white text-xs font-display font-bold ${
                product.badge === 'Sale' ? 'bg-brand' : 'bg-badge-blue'
              }`}
            >
              {product.badge === 'Sale' && discount ? `−${discount}% off` : product.badge}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="bg-canvas -mt-4 rounded-t-3xl relative z-10 px-5 pt-6 pb-6">
          <p className="text-ink-3 font-body text-[10px] uppercase tracking-[0.2em] mb-2">
            {product.category}
          </p>
          <h1 className="font-display font-bold text-2xl text-ink leading-tight mb-3">
            {product.name}
          </h1>
          <StarRating rating={product.rating} reviews={product.reviews} size="md" />

          <div className="flex items-baseline gap-3 mt-4 mb-6">
            <span className="font-display font-extrabold text-3xl text-ink">${product.price}</span>
            {product.originalPrice && (
              <span className="font-body text-lg text-ink-3 line-through">${product.originalPrice}</span>
            )}
          </div>

          {/* Size selector */}
          {product.sizes && (
            <div className="mb-6">
              <p className="font-body font-medium text-sm text-ink mb-3">
                Size
                {selectedSize && (
                  <span className="text-ink-3 ml-2">— {selectedSize}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border text-sm font-body font-medium transition-all duration-150 ${
                      selectedSize === size
                        ? 'bg-ink text-white border-ink'
                        : 'bg-surface text-ink border-rule hover:border-ink-2'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-display font-semibold text-base text-ink mb-3">About this product</h3>
            <p className="font-body text-ink-2 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Delivery info */}
          <div className="flex gap-3 mb-6">
            {[
              { icon: 'M5 12h14M12 5l7 7-7 7', label: 'Free delivery over $50' },
              { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: '30-day returns' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex-1 bg-surface border border-rule rounded-2xl p-3 flex flex-col items-center gap-2 text-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                <span className="text-ink-2 font-body text-xs leading-tight">{label}</span>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base text-ink">Reviews</h3>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-2xl text-ink">{product.rating}</span>
                <StarRating rating={product.rating} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {REVIEWS.map((r) => (
                <div key={r.name} className="bg-surface border border-rule rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-semibold text-sm text-ink">{r.name}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="font-body text-ink-2 text-sm leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="shrink-0 bg-surface/95 backdrop-blur-sm border-t border-rule px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-canvas border border-rule rounded-xl px-3 py-2.5 shrink-0">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 flex items-center justify-center text-ink font-display font-bold text-lg"
            >
              −
            </button>
            <span className="font-display font-semibold text-ink text-sm w-5 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-7 h-7 flex items-center justify-center text-ink font-display font-bold text-lg"
            >
              +
            </button>
          </div>
          <button
            onClick={added ? onGoToCart : handleAddToCart}
            className={`flex-1 py-3.5 rounded-xl font-display font-bold text-sm transition-all duration-200 ${
              added
                ? 'bg-success text-white'
                : 'bg-brand text-white active:bg-brand-hover active:scale-[0.98]'
            }`}
          >
            {added
              ? 'Added to Cart  →'
              : `Add to Cart — $${(product.price * quantity)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
