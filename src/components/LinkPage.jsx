import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Globe, Instagram, Twitter, Youtube, Mail, Phone, ExternalLink } from 'lucide-react'

const iconMap = {
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  mail: Mail,
  phone: Phone,
  external: ExternalLink
}

function LinkPage({ userData }) {
  const [clickCounts, setClickCounts] = useState({})

  useEffect(() => {
    const savedCounts = localStorage.getItem('linkClickCounts')
    if (savedCounts) {
      setClickCounts(JSON.parse(savedCounts))
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
    if (userData.analytics.enabled && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Link',
        event_label: url,
        value: 1
      })
    }
    
    window.open(url, '_blank')
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

  const AdComponent = ({ placement }) => {
    if (!userData.ads.enabled || !userData.ads.adCode || userData.ads.placement !== placement) {
      return null
    }

    return (
      <div className="w-full max-w-md mx-auto my-4">
        <div 
          className="bg-white/10 backdrop-blur-sm rounded-lg p-2"
          dangerouslySetInnerHTML={{ __html: userData.ads.adCode }}
        />
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={getBackgroundStyle()}
    >
      <div className="w-full max-w-md mx-auto">
        {/* Top Ad Placement */}
        <AdComponent placement="top" />
        
        {/* Profile Section */}
        <Card className="bg-white/20 backdrop-blur-md border-white/30 p-6 mb-6 text-center">
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

        {/* Middle Ad Placement */}
        <AdComponent placement="middle" />

        {/* Links Section */}
        <div className="space-y-3">
          {userData.links
            .filter(link => link.visible)
            .map((link) => {
              const IconComponent = iconMap[link.icon] || ExternalLink
              
              return (
                <Button
                  key={link.id}
                  variant="secondary"
                  className="w-full h-auto p-4 bg-white/20 backdrop-blur-md border-white/30 hover:bg-white/30 transition-all duration-200 group"
                  onClick={() => handleLinkClick(link.id, link.url)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 text-white" />
                      <div className="text-left">
                        <div className="text-white font-medium">
                          {link.title}
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
            })}
        </div>

        {/* Bottom Ad Placement */}
        <AdComponent placement="bottom" />
        
        {/* Test Ad - Always visible when ads enabled */}
        {userData.ads.enabled && (
          <div className="w-full max-w-md mx-auto my-4">
            <div className="bg-gradient-to-r from-pink-500 to-blue-500 p-4 rounded-lg text-center text-white">
              <h3 className="font-bold text-lg mb-2">Sample Advertisement</h3>
              <p className="text-sm">This is where your ad network code would display ads</p>
              <small className="opacity-80">Replace with actual ad code from Google AdSense, Media.net, etc.</small>
            </div>
          </div>
        )}

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white text-xs"
            onClick={() => window.location.href = '/admin'}
          >
            Admin Panel
          </Button>
        </div>

        {/* Debug: Show ad status */}
        {userData.ads.enabled && (
          <div className="mt-4 text-center text-white/50 text-xs">
            Ads enabled: {userData.ads.placement} placement
          </div>
        )}
      </div>

      {/* Google Analytics */}
      {userData.analytics.enabled && userData.analytics.googleAnalyticsId && (
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
  )
}

export default LinkPage
