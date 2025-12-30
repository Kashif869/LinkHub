let GA_INITIALIZED = false
let GA_TRACKING_ID = null

export const initGA = (trackingId) => {
  if (GA_INITIALIZED || !trackingId) return

  GA_TRACKING_ID = trackingId

  // Load Google Analytics 4
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', trackingId)

  GA_INITIALIZED = true
}

export const trackPageView = (title, path) => {
  if (!GA_INITIALIZED || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: window.location.href,
    page_path: path || window.location.pathname,
  })
}

export const trackEvent = (eventName, params = {}) => {
  if (!GA_INITIALIZED || !window.gtag) return

  window.gtag('event', eventName, params)
}

export const trackProductView = (productName, category) => {
  trackEvent('view_item', {
    item_name: productName,
    item_category: category,
  })
}

export const trackAffiliateLinkClick = (productName, affiliateUrl) => {
  trackEvent('select_content', {
    content_type: 'product',
    item_name: productName,
    link_url: affiliateUrl,
  })
}

export const trackSearch = (searchTerm) => {
  trackEvent('search', {
    search_term: searchTerm,
  })
}

export const trackCategoryFilter = (categoryName) => {
  trackEvent('select_content', {
    content_type: 'category',
    item_name: categoryName,
  })
}

export const trackAdView = (adPosition) => {
  trackEvent('view_promotion', {
    creative_slot: adPosition,
    promotion_name: adPosition,
  })
}

export const trackSocialLinkClick = (platform, linkUrl) => {
  trackEvent('select_content', {
    content_type: 'social_link',
    item_name: platform,
    link_url: linkUrl,
  })
}

export const trackLinkClick = (linkTitle, linkUrl) => {
  trackEvent('select_content', {
    content_type: 'link',
    item_name: linkTitle,
    link_url: linkUrl,
  })
}

export const trackTopFindClick = (linkTitle, linkUrl) => {
  trackEvent('select_content', {
    content_type: 'top_find',
    item_name: linkTitle,
    link_url: linkUrl,
  })
}

export const trackAnnouncementClick = (announcementText, linkUrl) => {
  trackEvent('select_content', {
    content_type: 'announcement',
    item_name: announcementText,
    link_url: linkUrl,
  })
}

export const trackFeatureClick = (featureName) => {
  trackEvent('select_content', {
    content_type: 'feature',
    item_name: featureName,
  })
}
