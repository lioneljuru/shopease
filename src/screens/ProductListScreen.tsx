import { useState } from 'react'
import { products } from '../data/products'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard'

interface ProductListScreenProps {
  category: string
  isSearchMode: boolean
  initialQuery?: string
  onProductSelect: (product: Product) => void
  onBack: () => void
}

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating'

export default function ProductListScreen({
  category,
  isSearchMode,
  initialQuery = '',
  onProductSelect,
  onBack,
}: ProductListScreenProps) {
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<SortOption>('popular')
  const [inputRef] = useState(() => ({ current: null as HTMLInputElement | null }))

  let filtered = [...products]

  if (!isSearchMode && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category)
  }

  if (query.trim()) {
    const q = query.toLowerCase()
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    )
  }

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price)
  else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating)
  else filtered.sort((a, b) => b.reviews - a.reviews)

  const sortLabels: Record<SortOption, string> = {
    popular: 'Popular',
    'price-asc': 'Price ↑',
    'price-desc': 'Price ↓',
    rating: 'Top Rated',
  }

  return (
    <div className="h-full flex flex-col bg-canvas">
      {/* Header */}
      <div className="shrink-0 bg-surface border-b border-rule px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border border-rule"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-display font-bold text-xl text-ink flex-1 truncate">
            {isSearchMode ? 'Search' : category}
          </h1>
          <span className="text-ink-3 font-body text-xs shrink-0">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {isSearchMode && (
          <div
            className="flex items-center gap-3 bg-canvas border border-rule rounded-xl px-4 py-3 mb-3"
            style={{ borderColor: query ? '#0F0F0F' : undefined }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={(el) => { inputRef.current = el }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands..."
              autoFocus
              className="flex-1 bg-transparent text-ink font-body text-sm outline-none placeholder:text-ink-3"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-ink-3 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Sort chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {(Object.keys(sortLabels) as SortOption[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full border text-xs font-body font-medium transition-all duration-150 ${
                sort === s ? 'bg-ink text-white border-ink' : 'bg-canvas text-ink-2 border-rule'
              }`}
            >
              {sortLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto hide-scrollbar p-5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9A9A96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <div className="text-center">
              <p className="font-display font-semibold text-ink text-base">No results</p>
              <p className="text-ink-3 font-body text-sm mt-1">
                Try a different search term
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => onProductSelect(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
