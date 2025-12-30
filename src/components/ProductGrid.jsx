import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import { Package } from 'lucide-react'

function ProductGrid({ products = [], onProductClick }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 mx-auto max-w-md"
        >
          <Package className="w-16 h-16 mx-auto text-white/50 mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">
            No Products Yet
          </h3>
          <p className="text-white/70 text-sm">
            Add your first Amazon affiliate product from the admin panel!
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} onProductClick={onProductClick} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ProductGrid
