export const generateProductUrl = (productId, baseUrl = window.location.origin) => {
  return `${baseUrl}/product/${productId}`
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (err) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

export const shareViaTwitter = (text, url) => {
  const tweetText = encodeURIComponent(`${text} ${url}`)
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank', 'width=550,height=420')
}

export const shareViaFacebook = (url) => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=550,height=420')
}

export const shareViaWhatsApp = (text) => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank')
}

export const shareViaEmail = (subject, body) => {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoUrl
}

export const getShareData = (product) => {
  const productUrl = generateProductUrl(product.id)
  const shareText = `Check out this great product: ${product.title}`
  const emailSubject = `Great Product: ${product.title}`
  const emailBody = `I found this amazing product you might like:\n\n${product.title}\n${product.description}\n\nView it here: ${productUrl}`

  return {
    url: productUrl,
    text: shareText,
    emailSubject,
    emailBody,
  }
}
