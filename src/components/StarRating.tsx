interface StarRatingProps {
  rating: number
  reviews?: number
  size?: 'sm' | 'md'
}

export default function StarRating({ rating, reviews, size = 'sm' }: StarRatingProps) {
  const px = size === 'sm' ? 11 : 15
  const filled = Math.round(rating)

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width={px} height={px} viewBox="0 0 24 24" fill={i <= filled ? '#FF3B21' : '#E5E5E1'}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <span
        style={{ fontSize: size === 'sm' ? 11 : 13 }}
        className="text-ink-3 font-body leading-none"
      >
        {rating.toFixed(1)}
        {reviews !== undefined ? ` (${reviews.toLocaleString()})` : ''}
      </span>
    </div>
  )
}
