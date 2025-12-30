import { useEffect } from 'react'
import {
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Rss
} from 'lucide-react'
import { trackSocialLinkClick } from '@/utils/gaUtils'

const SOCIAL_PLATFORMS = {
  instagram: { icon: Instagram, label: 'Instagram', color: '#E4405F' },
  twitter: { icon: Twitter, label: 'Twitter', color: '#1DA1F2' },
  youtube: { icon: Youtube, label: 'YouTube', color: '#FF0000' },
  tiktok: { icon: Rss, label: 'TikTok', color: '#000000' },
  linkedin: { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
  facebook: { icon: Facebook, label: 'Facebook', color: '#1877F2' },
}

export function SocialLinks({ socialLinks = [], size = 'md', className = '' }) {
  useEffect(() => {
    // Track initial view of social links
    if (socialLinks.length > 0) {
      socialLinks.forEach(link => {
        if (link.url) {
          trackSocialLinkClick(link.platform, link.url)
        }
      })
    }
  }, [socialLinks])

  if (!socialLinks || socialLinks.length === 0) return null

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      {socialLinks.map((link, index) => {
        if (!link.url) return null

        const platform = SOCIAL_PLATFORMS[link.platform.toLowerCase()]
        if (!platform) return null

        const Icon = platform.icon

        return (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center rounded-full
              transition-all duration-200 hover:scale-110 hover:opacity-90
              ${sizeClasses[size]}
              ${platform.color ? '' : 'bg-gray-200'}
            `}
            style={{ backgroundColor: platform.color || undefined }}
            onClick={() => trackSocialLinkClick(link.platform, link.url)}
            aria-label={platform.label}
            title={platform.label}
          >
            <Icon size={iconSize[size]} className="text-white" />
          </a>
        )
      })}
    </div>
  )
}
