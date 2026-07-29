import type { Product } from '../types'
import StarRating from './StarRating'

interface ProductCardProps {
  product: Product
  onPress: () => void
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <button
      onClick={onPress}
      className="bg-surface rounded-2xl overflow-hidden border border-rule text-left w-full transition-transform duration-150 active:scale-95"
    >
      <div className="relative aspect-square bg-canvas">
        <img
          src={`https://images.unsplash.com/${product.imageId}?w=400&h=400&fit=crop&auto=format`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span
            className={`absolute top-2 left-2 text-white text-[10px] font-display font-semibold px-2 py-0.5 rounded-md tracking-wide ${
              product.badge === 'Sale' ? 'bg-brand' : 'bg-badge-blue'
            }`}
          >
            {product.badge === 'Sale' && discount ? `−${discount}%` : product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-ink-3 text-[10px] font-body uppercase tracking-widest mb-1 leading-none">
          {product.category}
        </p>
        <p className="text-ink font-display font-medium text-sm leading-snug line-clamp-2 mb-1.5">
          {product.name}
        </p>
        <StarRating rating={product.rating} />
        <div className="flex items-baseline gap-1.5 mt-2">
          <span className="text-ink font-display font-bold text-base">${product.price}</span>
          {product.originalPrice && (
            <span className="text-ink-3 font-body text-xs line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </button>
  )
}
