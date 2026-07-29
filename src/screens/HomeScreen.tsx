import { useState } from 'react'
import { products, categories } from '../data/products'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'
import { useShop } from '../store/ShopContext'

interface HomeScreenProps {
  onProductSelect: (product: Product) => void
  onCategorySelect: (category: string) => void
  onSearch: () => void
}

const FEATURED_IMAGE = 'photo-1483985988355-763728e1935b'

export default function HomeScreen({ onProductSelect, onCategorySelect, onSearch }: HomeScreenProps) {
  const { user } = useShop()
  const [activeCategory, setActiveCategory] = useState('All')
  const firstName = user?.name?.split(/\s+/)[0] || 'there'

  const trending = products
    .filter((p) => p.reviews > 700 || p.badge === 'New')
    .slice(0, 6)

  const onSale = products.filter((p) => p.badge === 'Sale')

  const handleCategory = (cat: string) => {
    setActiveCategory(cat)
    if (cat !== 'All') onCategorySelect(cat)
    else onCategorySelect('All')
  }

  return (
    <div className="bg-canvas">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-ink-3 font-body text-sm mb-0.5">Good morning,</p>
            <h1 className="font-display font-bold text-2xl text-ink leading-none">{firstName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-surface rounded-full border border-rule flex items-center justify-center relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand rounded-full" />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <button
          onClick={onSearch}
          className="w-full bg-surface border border-rule rounded-2xl px-4 py-3.5 flex items-center gap-3"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-ink-3 font-body text-sm">Search products, brands...</span>
        </button>
      </div>

      {/* Category chips */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full border text-sm font-body font-medium transition-all duration-150 ${
                activeCategory === cat
                  ? 'bg-ink text-white border-ink'
                  : 'bg-surface text-ink-2 border-rule'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured banner */}
      <div className="px-5 mb-7">
        <button
          onClick={() => onProductSelect(products[6])}
          className="w-full rounded-3xl overflow-hidden relative h-52 bg-ink block"
        >
          <img
            src={`https://images.unsplash.com/${FEATURED_IMAGE}?w=800&h=450&fit=crop&auto=format`}
            alt="New season arrivals"
            className="w-full h-full object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <span className="text-white/60 text-[10px] font-body uppercase tracking-[0.2em] mb-1.5">
              Featured collection
            </span>
            <h2 className="text-white font-display font-extrabold text-2xl leading-tight mb-3">
              New Season<br />Arrivals
            </h2>
            <span className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-display font-bold px-4 py-2 rounded-full self-start">
              Shop Now
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </div>
        </button>
      </div>

      {/* Trending section */}
      <div className="px-5 mb-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-ink">Trending Now</h2>
          <button
            onClick={() => onCategorySelect('All')}
            className="text-brand font-body font-medium text-sm"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} onPress={() => onProductSelect(product)} />
          ))}
        </div>
      </div>

      {/* On Sale section */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-ink">On Sale</h2>
          <button
            onClick={() => onCategorySelect('All')}
            className="text-brand font-body font-medium text-sm"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {onSale.map((product) => (
            <ProductCard key={product.id} product={product} onPress={() => onProductSelect(product)} />
          ))}
        </div>
      </div>
    </div>
  )
}
