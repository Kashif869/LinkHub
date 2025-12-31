import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Share2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AdUnitPreview } from './AdUnit'
import { ShareButtons } from './ShareButtons'
import { trackAffiliateLinkClick, trackProductView } from '@/utils/gaUtils'
import { toast } from 'sonner'

export function ProductPage({ userData }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData?.products) {
      const foundProduct = userData.products.find(p => p.id === parseInt(productId))
      setProduct(foundProduct)
      setLoading(false)

      if (foundProduct && userData.analytics?.enabled) {
        trackProductView(foundProduct.title, foundProduct.category)
      }
    }
  }, [productId, userData])

  useEffect(() => {
    // Update page title and meta tags
    if (product) {
      document.title = `${product.title} - ${userData?.profile?.name || 'LinkHub'}`

      // Update or create meta tags
      const updateMetaTag = (property, content) => {
        let tag = document.querySelector(`meta[property="${property}"]`)
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute('property', property)
          document.head.appendChild(tag)
        }
        tag.setAttribute('content', content)
      }

      updateMetaTag('og:title', product.title)
      updateMetaTag('og:description', product.description || `Check out this great product`)
      updateMetaTag('og:image', product.imageUrl || '')
      updateMetaTag('og:url', window.location.href)
      updateMetaTag('og:type', 'product')

      // Twitter card
      const twitterTag = document.querySelector(`meta[name="twitter:card"]`)
      if (!twitterTag) {
        const tag = document.createElement('meta')
        tag.setAttribute('name', 'twitter:card')
        tag.setAttribute('content', 'summary_large_image')
        document.head.appendChild(tag)
      }
    }
  }, [product, userData])

  const handleAffiliateClick = () => {
    if (product) {
      // Track click in localStorage
      const clickCounts = JSON.parse(localStorage.getItem('productClickCounts') || '{}')
      clickCounts[product.id] = (clickCounts[product.id] || 0) + 1
      localStorage.setItem('productClickCounts', JSON.stringify(clickCounts))

      // Track in Google Analytics if enabled
      if (userData?.analytics?.enabled) {
        trackAffiliateLinkClick(product.title, product.affiliateUrl)
      }

      toast.success('Opening product on Amazon...')
      window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Product not found</p>
            <Button onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Ad Unit */}
      {userData?.ads?.units?.find(u => u.id === 'top')?.enabled && (
        <div className="container mx-auto px-4 py-4">
          <AdUnitPreview
            code={userData.ads.units.find(u => u.id === 'top').code}
            position="top"
          />
        </div>
      )}

      {/* Product Content */}
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Products
        </Button>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingCart class="w-16 h-16" />
                        </div>
                      `
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-24 h-24 text-gray-300" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  {product.category && (
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                      {product.category}
                    </span>
                  )}
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.title}
                  </h1>
                  {product.price && (
                    <p className="text-3xl font-bold text-green-600">
                      {product.price}
                    </p>
                  )}
                </div>

                {product.description && (
                  <div>
                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Affiliate Button */}
                <Button
                  onClick={handleAffiliateClick}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View on Amazon
                  <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-xs">
                    Affiliate
                  </span>
                </Button>

                {/* Share Buttons */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Share this product</h2>
                  <ShareButtons product={product} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Ad Unit */}
      {userData?.ads?.units?.find(u => u.id === 'middle')?.enabled && (
        <div className="container mx-auto px-4 py-4">
          <AdUnitPreview
            code={userData.ads.units.find(u => u.id === 'middle').code}
            position="middle"
          />
        </div>
      )}

      {/* Additional Info */}
      {product.featured && (
        <div className="container mx-auto px-4 py-6">
          <Card className="max-w-4xl mx-auto bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-yellow-800 font-medium">
                ⭐ This is a featured product hand-picked by {userData?.profile?.name || 'us'}!
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Ad Unit */}
      {userData?.ads?.units?.find(u => u.id === 'bottom')?.enabled && (
        <div className="container mx-auto px-4 py-4">
          <AdUnitPreview
            code={userData.ads.units.find(u => u.id === 'bottom').code}
            position="bottom"
          />
        </div>
      )}

      {/* Footer CTA */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Discover More Products</h2>
            <p className="text-gray-600 mb-4">
              Check out our curated collection of recommended items
            </p>
            <Button onClick={handleBack} size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Browse All Products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
