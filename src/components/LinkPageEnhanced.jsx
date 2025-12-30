import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Globe, Instagram, Twitter, Youtube, Mail, Phone, ExternalLink, Star } from 'lucide-react'
import AnnouncementBar from './AnnouncementBar'
import SearchBar from './SearchBar'
import ProductGrid from './ProductGrid'
import AdUnit from './AdUnit'
import FeaturesSection from './FeaturesSection'
import BackToTop from './BackToTop'

const iconMap = {
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  mail: Mail,
  phone: Phone,
  external: ExternalLink
}

function LinkPageEnhanced({ userData }) {
  const [clickCounts, setClickCounts] = useState({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [productClickCounts, setProductClickCounts] = useState({})

  useEffect(() => {
    const savedCounts = localStorage.getItem('linkClickCounts')
    if (savedCounts) {
      setClickCounts(JSON.parse(savedCounts))
    }

    const savedProductCounts = localStorage.getItem('productClickCounts')
    if (savedProductCounts) {
      setProductClickCounts(JSON.parse(savedProductCounts))
    }
  }, [])

  const handleLinkClick = (linkId, url) => {
    const newCounts = {
      ...clickCounts,
      [linkId]: (clickCounts[linkId] || 0) + 1
    }
    setClickCounts(newCounts)
    localStorage.setItem('linkClickCounts', JSON.stringify(newCounts))
    
    // Track with Google Analytics if enabled
    if (userData.analytics?.enabled && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Link',
        event_label: url,
        value: 1
      })
    }
    
    window.open(url, '_blank')
  }

  const handleProductClick = (product) => {
    const newCounts = {
      ...productClickCounts,
      [product.id]: (productClickCounts[product.id] || 0) + 1
    }
    setProductClickCounts(newCounts)
    localStorage.setItem('productClickCounts', JSON.stringify(newCounts))

    // Track with Google Analytics if enabled
    if (userData.analytics?.enabled && window.gtag) {
      window.gtag('event', 'product_click', {
        event_category: 'Product',
        event_label: product.title,
        value: 1
      })
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleFilterChange = (category) => {
    if (category === null) {
      // Clear all filters
      setSelectedCategories([])
    } else if (selectedCategories.includes(category)) {
      // Remove category
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    } else {
      // Add category
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const getBackgroundStyle = () => {
    if (userData.profile.backgroundType === 'color') {
      return { backgroundColor: userData.profile.backgroundColor }
    } else if (userData.profile.backgroundType === 'image' && userData.profile.backgroundImage) {
      return {
        backgroundImage: `url(${userData.profile.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    } else {
      // Default gradient
      return {
        background: `linear-gradient(135deg, ${userData.profile.backgroundColor || '#667eea'}, #764ba2)`
      }
    }
  }

  // Get Top Finds (either marked as top finds or from Top Finds category)
  const getTopFinds = () => {
    const topFindsCategory = userData.categories?.find(cat => cat.isTopFinds)
    if (topFindsCategory) {
      return userData.links
        .filter(link => link.visible && (link.categoryId === topFindsCategory.id || link.isTopFind))
        .slice(0, 3) // Limit to 3 top finds
    }
    return userData.links?.filter(link => link.visible && link.isTopFind).slice(0, 3) || []
  }

  // Get links by category (excluding top finds)
  const getLinksByCategory = () => {
    const topFindsCategory = userData.categories?.find(cat => cat.isTopFinds)
    const categorizedLinks = {}
    
    userData.categories?.forEach(category => {
      if (!category.isTopFinds && category.visible) {
        categorizedLinks[category.id] = {
          category,
          links: userData.links?.filter(link => 
            link.visible && 
            link.categoryId === category.id && 
            !link.isTopFind
          ) || []
        }
      }
    })

    // Add uncategorized links
    const uncategorizedLinks = userData.links?.filter(link => 
      link.visible && 
      !link.categoryId && 
      !link.isTopFind &&
      (!topFindsCategory || link.categoryId !== topFindsCategory.id)
    ) || []

    if (uncategorizedLinks.length > 0) {
      categorizedLinks['uncategorized'] = {
        category: { name: 'Other Links', color: '#6b7280' },
        links: uncategorizedLinks
      }
    }

    return categorizedLinks
  }

  // Filter and search products
  const getFilteredProducts = () => {
    let filtered = userData.products?.filter(p => p.visible) || []
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term)
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product =>
        selectedCategories.includes(product.category)
      )
    }
    
    // Add click counts to products
    return filtered.map(product => ({
      ...product,
      clicks: productClickCounts[product.id] || 0
    }))
  }

  // Get unique product categories
  const getProductCategories = () => {
    const categories = new Set()
    userData.products?.forEach(product => {
      if (product.category && product.visible) {
        categories.add(product.category)
      }
    })
    return Array.from(categories)
  }

  // Get ad unit by position
  const getAdUnit = (position) => {
    return userData.ads?.units?.find(unit => unit.position === position)
  }

  const renderLink = (link, isTopFind = false) => {
    const IconComponent = iconMap[link.icon] || ExternalLink
    
    return (
      <Button
        key={link.id}
        variant="secondary"
        className={`w-full h-auto p-4 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 transition-all duration-200 group ${
          isTopFind ? 'ring-2 ring-yellow-400/50' : ''
        }`}
        onClick={() => handleLinkClick(link.id, link.url)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3">
            {link.imageUrl ? (
              <img 
                src={link.imageUrl} 
                alt={link.title}
                className="w-8 h-8 rounded object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
            ) : null}
            <IconComponent 
              className={`w-5 h-5 text-white ${link.imageUrl ? 'hidden' : ''}`} 
            />
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{link.title}</span>
                {isTopFind && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
              </div>
              {link.description && (
                <div className="text-white/70 text-xs">
                  {link.description}
                </div>
              )}
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
        </div>
      </Button>
    )
  }

  const topFinds = getTopFinds()
  const categorizedLinks = getLinksByCategory()
  const filteredProducts = getFilteredProducts()
  const productCategories = getProductCategories()
  const hasProducts = userData.products && userData.products.length > 0
  const topAd = getAdUnit('top')
  const middleAd = getAdUnit('middle')
  const bottomAd = getAdUnit('bottom')

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar announcement={userData.announcement} />

      <div 
        className="min-h-screen flex flex-col items-center p-4 pt-6"
        style={getBackgroundStyle()}
      >
        <div className="w-full max-w-6xl mx-auto">
          {/* Top Ad Placement */}
          {topAd && <AdUnit {...topAd} />}
          
          {/* Profile Section */}
          <div className="max-w-md mx-auto mb-8">
            <Card className="bg-white/20 backdrop-blur-md border-white/30 p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={userData.profile.avatar} alt={userData.profile.name} />
                <AvatarFallback className="text-2xl bg-white/30">
                  {userData.profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <h1 className="text-2xl font-bold text-white mb-2">
                {userData.profile.name}
              </h1>
              
              <p className="text-white/90 text-sm">
                {userData.profile.bio}
              </p>
            </Card>
          </div>

          {/* Top Finds Section */}
          {topFinds.length > 0 && (
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-center mb-4">
                <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-3 py-1">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Top Finds
                </Badge>
              </div>
              <div className="space-y-3">
                {topFinds.map(link => renderLink(link, true))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {hasProducts && (
            <div className="mb-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Featured Products
                </h2>
                <p className="text-white/70">
                  Check out our curated selection of Amazon products
                </p>
              </div>

              <SearchBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                categories={productCategories}
                selectedCategories={selectedCategories}
              />

              <ProductGrid
                products={filteredProducts}
                onProductClick={handleProductClick}
              />
            </div>
          )}

          {/* Middle Ad Placement */}
          {middleAd && <AdUnit {...middleAd} />}

          {/* Categorized Links */}
          {Object.keys(categorizedLinks).length > 0 && (
            <div className="max-w-md mx-auto mb-8">
              {Object.entries(categorizedLinks).map(([categoryId, { category, links }]) => {
                if (links.length === 0) return null
                
                return (
                  <div key={categoryId} className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                      <Badge 
                        className="px-3 py-1 border-white/30"
                        style={{ 
                          backgroundColor: `${category.color}20`,
                          color: 'white',
                          borderColor: `${category.color}50`
                        }}
                      >
                        {category.name}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {links.map(link => renderLink(link))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Bottom Ad Placement */}
          {bottomAd && <AdUnit {...bottomAd} />}

          {/* Features Section */}
          {hasProducts && <FeaturesSection />}
          
          {/* Admin Link */}
          <div className="mt-8 mb-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white text-xs"
              onClick={() => window.location.href = '/admin'}
            >
              Admin Panel
            </Button>
          </div>
        </div>

        {/* Back to Top Button */}
        <BackToTop />

        {/* Google Analytics */}
        {userData.analytics?.enabled && userData.analytics.googleAnalyticsId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${userData.analytics.googleAnalyticsId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${userData.analytics.googleAnalyticsId}');
                `
              }}
            />
          </>
        )}
      </div>
    </>
  )
}

export default LinkPageEnhanced
