import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'

function AnnouncementBar({ announcement }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (!announcement || !announcement.enabled || !announcement.text) {
      setIsVisible(false)
      return
    }

    // Check if announcement was dismissed
    const dismissedData = localStorage.getItem('announcement_dismissed')
    if (dismissedData) {
      try {
        const { dismissedAt, text } = JSON.parse(dismissedData)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
        
        // If same announcement and dismissed within 7 days, keep it dismissed
        if (text === announcement.text && dismissedAt > sevenDaysAgo) {
          setIsDismissed(true)
          setIsVisible(false)
          return
        }
      } catch (e) {
        // Invalid data, clear it
        localStorage.removeItem('announcement_dismissed')
      }
    }

    // Show announcement after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [announcement])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    
    // Store dismissal in localStorage
    localStorage.setItem('announcement_dismissed', JSON.stringify({
      dismissedAt: Date.now(),
      text: announcement.text
    }))
  }

  const handleLinkClick = (e) => {
    if (announcement.link) {
      e.preventDefault()
      window.open(announcement.link, '_blank', 'noopener,noreferrer')
    }
  }

  if (!announcement || !announcement.enabled || !announcement.text || isDismissed) {
    return null
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 shadow-lg"
          style={{ 
            backgroundColor: announcement.backgroundColor || '#fbbf24',
          }}
        >
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 flex items-center justify-center gap-2">
              <p 
                className="text-sm md:text-base font-medium text-center"
                style={{ color: announcement.color || '#000000' }}
              >
                {announcement.text}
              </p>
              {announcement.link && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLinkClick}
                  className="shrink-0 hover:bg-black/10"
                  style={{ color: announcement.color || '#000000' }}
                >
                  Learn More
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              )}
            </div>
            
            <button
              onClick={handleDismiss}
              className="shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Dismiss announcement"
              style={{ color: announcement.color || '#000000' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnnouncementBar
