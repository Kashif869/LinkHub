import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ExternalLink, Star } from 'lucide-react'
import { trackAffiliateLinkClick } from '@/utils/gaUtils'

function ProductCard({ product, onProductClick, enableProductPages = true }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAffiliateClick = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Track click in localStorage
    const clickCounts = JSON.parse(localStorage.getItem('productClickCounts') || '{}')
    clickCounts[product.id] = (clickCounts[product.id] || 0) + 1
    localStorage.setItem('productClickCounts', JSON.stringify(clickCounts))

    // Track in Google Analytics (will be picked up if enabled)
    trackAffiliateLinkClick(product.title, product.affiliateUrl)

    if (onProductClick) {
      onProductClick(product)
    }

    // Open affiliate link in new tab
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')
  }

  const cardContent = (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/20 backdrop-blur-md border-white/30">
      <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-white/10">
            {!imageLoaded && !imageError && (
              <Skeleton className="w-full h-full" />
            )}
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="text-center p-4">
                  <ExternalLink className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Image unavailable</p>
                </div>
              </div>
            ) : (
              <img
                src={product.imageUrl}
                alt={product.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true)
                }}
              />
            )}
            
            {/* Featured Badge */}
            {product.featured && (
              <Badge className="absolute top-2 right-2 bg-yellow-500/90 text-white border-0">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </Badge>
            )}

            {/* Category Badge */}
            {product.category && (
              <Badge className="absolute top-2 left-2 bg-black/50 text-white border-0 backdrop-blur-sm">
                {product.category}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.title}
            </h3>
            
            {product.description && (
              <p className="text-white/70 text-xs line-clamp-2 mb-3">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-2">
              {product.price && (
                <span className="text-white font-bold text-lg">
                  {product.price}
                </span>
              )}
              
              <Button
                onClick={handleClick}
                size="sm"
                className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                View on Amazon
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Click Counter */}
            {product.clicks > 0 && (
              <div className="mt-2 text-center">
                <span className="text-white/50 text-xs">
                  {product.clicks} {product.clicks === 1 ? 'click' : 'clicks'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      {enableProductPages ? (
        <Link to={`/product/${product.id}`}>
          {cardContent}
        </Link>
      ) : (
        <div onClick={handleAffiliateClick} className="cursor-pointer">
          {cardContent}
        </div>
      )}
    </motion.div>
  )
}

export default ProductCard
