import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'

function AdUnit({ id, code, enabled, position }) {
  // Only render if enabled and code is provided
  if (!enabled || !code || code.trim().length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full my-6"
      data-ad-slot={id}
      data-ad-position={position}
    >
      <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4 overflow-hidden">
        <div
          className="ad-content"
          dangerouslySetInnerHTML={{ __html: code }}
        />
      </Card>
    </motion.div>
  )
}

// Preview component for admin panel
export function AdUnitPreview({ code }) {
  if (!code || code.trim().length === 0) {
    return (
      <Card className="bg-gray-50 border-dashed border-2 p-8 text-center">
        <p className="text-gray-400 text-sm">
          No ad code provided. Add your ad network code above to see a preview.
        </p>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-50 p-4 overflow-hidden">
      <div className="text-xs text-gray-500 mb-2">Preview:</div>
      <div
        className="ad-preview bg-white p-4 rounded border"
        dangerouslySetInnerHTML={{ __html: code }}
      />
    </Card>
  )
}

export default AdUnit
