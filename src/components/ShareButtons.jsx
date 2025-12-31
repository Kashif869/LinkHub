import { useState } from 'react'
import {
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Link2,
  Check,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  copyToClipboard,
  shareViaTwitter,
  shareViaFacebook,
  shareViaWhatsApp,
  shareViaEmail
} from '@/utils/shareUtils'

export function ShareButtons({ product, className = '' }) {
  const [copied, setCopied] = useState(false)

  const shareData = {
    url: typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : '',
    text: `Check out this great product: ${product.title}`,
    emailSubject: `Great Product: ${product.title}`,
    emailBody: `I found this amazing product you might like:\n\n${product.title}\n${product.description}\n\nView it here: ${typeof window !== 'undefined' ? `${window.location.origin}/product/${product.id}` : ''}`,
  }

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareData.url)
    if (success) {
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Failed to copy link')
    }
  }

  const handleTwitterShare = () => {
    shareViaTwitter(shareData.text, shareData.url)
  }

  const handleFacebookShare = () => {
    shareViaFacebook(shareData.url)
  }

  const handleWhatsAppShare = () => {
    shareViaWhatsApp(`${shareData.text}\n${shareData.url}`)
  }

  const handleEmailShare = () => {
    shareViaEmail(shareData.emailSubject, shareData.emailBody)
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center gap-2"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span>Copy Link</span>
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleTwitterShare}
        className="flex items-center gap-2"
      >
        <Twitter className="w-4 h-4 text-[#1DA1F2]" />
        <span>Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleFacebookShare}
        className="flex items-center gap-2"
      >
        <Facebook className="w-4 h-4 text-[#1877F2]" />
        <span>Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4 text-[#25D366]" />
        <span>WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleEmailShare}
        className="flex items-center gap-2"
      >
        <Mail className="w-4 h-4" />
        <span>Email</span>
      </Button>
    </div>
  )
}

export function ShareButton({ product, className = '' }) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>

      {showOptions && (
        <div className="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg p-2 z-10">
          <ShareButtons product={product} />
        </div>
      )}
    </div>
  )
}
