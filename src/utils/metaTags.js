export const setMetaTags = ({ title, description, image, url, type = 'website' }) => {
  if (typeof document === 'undefined') return

  // Set page title
  if (title) {
    document.title = title
  }

  const setMeta = (name, content) => {
    let meta = document.querySelector(`meta[name="${name}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', name)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  const setProperty = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('property', property)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', content)
  }

  // Set basic meta tags
  if (description) {
    setMeta('description', description)
    setProperty('og:description', description)
  }

  // Set Open Graph tags
  if (title) {
    setProperty('og:title', title)
  }

  if (type) {
    setProperty('og:type', type)
  }

  if (url) {
    setProperty('og:url', url)
  }

  if (image) {
    setProperty('og:image', image)
    setMeta('twitter:image', image)
  }

  // Set Twitter Card tags
  setMeta('twitter:card', 'summary_large_image')

  if (title) {
    setMeta('twitter:title', title)
  }

  if (description) {
    setMeta('twitter:description', description)
  }
}

export const setProductMetaTags = (product, userData) => {
  const siteName = userData?.profile?.name || 'LinkHub'
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const productUrl = typeof window !== 'undefined' ? window.location.href : ''

  setMetaTags({
    title: `${product.title} - ${siteName}`,
    description: product.description || `Check out ${product.title} on ${siteName}`,
    image: product.imageUrl || '',
    url: productUrl,
    type: 'product'
  })

  // Product-specific Open Graph tags
  if (product.price) {
    const setProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    setProperty('product:price:amount', product.price.replace(/[^0-9.]/g, ''))
    setProperty('product:price:currency', 'USD')
    setProperty('product:availability', 'in stock')
  }
}

export const resetMetaTags = (userData) => {
  const siteName = userData?.profile?.name || 'LinkHub'
  const siteDescription = userData?.profile?.bio || 'Check out my curated links and products'

  setMetaTags({
    title: siteName,
    description: siteDescription,
    image: userData?.profile?.avatar || '',
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'website'
  })
}
