/**
 * Utility functions for fetching Amazon product metadata
 * Provides both automatic URL parsing and manual input options
 */

/**
 * Extract ASIN from Amazon URL
 * @param {string} url - Amazon product URL
 * @returns {string|null} - ASIN or null if not found
 */
export function extractASIN(url) {
  if (!url) return null
  
  // Common Amazon URL patterns
  const patterns = [
    /\/dp\/([A-Z0-9]{10})/,
    /\/product\/([A-Z0-9]{10})/,
    /\/gp\/product\/([A-Z0-9]{10})/,
    /\/exec\/obidos\/ASIN\/([A-Z0-9]{10})/,
    /amazon\.com\/([A-Z0-9]{10})/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Validate if URL is an Amazon URL
 * @param {string} url 
 * @returns {boolean}
 */
export function isAmazonUrl(url) {
  if (!url) return false
  
  const amazonDomains = [
    'amazon.com',
    'amazon.co.uk',
    'amazon.ca',
    'amazon.de',
    'amazon.fr',
    'amazon.it',
    'amazon.es',
    'amazon.in',
    'amazon.co.jp',
    'amzn.to',
    'amzn.eu'
  ]
  
  try {
    const urlObj = new URL(url)
    return amazonDomains.some(domain => urlObj.hostname.includes(domain))
  } catch {
    return false
  }
}

/**
 * Extract product metadata from Amazon URL
 * For now, this is a placeholder that would integrate with an API
 * In production, you'd use Keepa API, RapidAPI Amazon Product API, or similar
 * 
 * @param {string} url - Amazon product URL
 * @returns {Promise<Object>} - Product metadata
 */
export async function fetchProductMetadata(url) {
  const asin = extractASIN(url)
  
  if (!asin) {
    throw new Error('Invalid Amazon URL - could not extract ASIN')
  }
  
  // In a real implementation, you would call an API here
  // Example with a hypothetical API:
  // const response = await fetch(`https://api.keepa.com/product?key=YOUR_KEY&asin=${asin}`)
  // const data = await response.json()
  
  // For now, return a placeholder structure
  // Users can manually fill in the details
  return {
    asin,
    title: 'Product Title (Auto-detect coming soon)',
    description: 'Please add a description',
    imageUrl: '',
    price: '',
    success: false,
    message: 'Auto-detection not yet implemented. Please enter details manually.'
  }
}

/**
 * Clean and format Amazon affiliate URL
 * Adds affiliate tag if not present
 * @param {string} url - Amazon product URL
 * @param {string} affiliateTag - Your Amazon affiliate tag
 * @returns {string} - Formatted affiliate URL
 */
export function formatAffiliateUrl(url, affiliateTag = '') {
  if (!url || !isAmazonUrl(url)) return url
  
  try {
    const urlObj = new URL(url)
    
    // Remove existing tag if present
    urlObj.searchParams.delete('tag')
    
    // Add affiliate tag if provided
    if (affiliateTag) {
      urlObj.searchParams.set('tag', affiliateTag)
    }
    
    return urlObj.toString()
  } catch {
    return url
  }
}

/**
 * Create a product object from manual input
 * @param {Object} data - Manual product data
 * @returns {Object} - Formatted product object
 */
export function createProductFromManualInput(data) {
  return {
    id: Date.now(),
    title: data.title || '',
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    affiliateUrl: data.affiliateUrl || '',
    price: data.price || '',
    category: data.category || 'General',
    featured: data.featured || false,
    clicks: 0,
    visible: true,
    asin: extractASIN(data.affiliateUrl)
  }
}

/**
 * Validate product data
 * @param {Object} product 
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateProduct(product) {
  const errors = []
  
  if (!product.title || product.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!product.affiliateUrl || product.affiliateUrl.trim().length === 0) {
    errors.push('Affiliate URL is required')
  } else if (!isAmazonUrl(product.affiliateUrl)) {
    errors.push('URL must be a valid Amazon link')
  }
  
  if (product.imageUrl && product.imageUrl.trim().length > 0) {
    try {
      new URL(product.imageUrl)
    } catch {
      errors.push('Image URL must be a valid URL')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
