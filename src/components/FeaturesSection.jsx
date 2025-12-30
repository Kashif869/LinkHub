import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star, Share2, DollarSign } from 'lucide-react'

function FeaturesSection() {
  const features = [
    {
      icon: Star,
      title: 'Curated Products',
      description: 'Hand-picked Amazon products that we love and recommend to our community.',
      color: 'text-yellow-400'
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your favorite finds with friends and followers in one convenient place.',
      color: 'text-blue-400'
    },
    {
      icon: DollarSign,
      title: 'Support Us',
      description: 'When you shop through our links, we earn a small commission at no extra cost to you.',
      color: 'text-green-400'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  }

  return (
    <section className="w-full py-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
      >
        <motion.h2
          variants={itemVariants}
          className="text-2xl md:text-3xl font-bold text-white text-center mb-8"
        >
          Why Shop With Us?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-3 rounded-full bg-white/10">
                        <Icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}

export default FeaturesSection
