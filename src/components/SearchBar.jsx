import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'
import { motion } from 'framer-motion'

function SearchBar({ onSearch, onFilterChange, categories = [], selectedCategories = [] }) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    if (onSearch) {
      onSearch('')
    }
  }

  const handleCategoryToggle = (category) => {
    if (onFilterChange) {
      onFilterChange(category)
    }
  }

  const isCategorySelected = (category) => {
    return selectedCategories.includes(category)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4 mb-6"
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10 pr-10 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/50 focus:bg-white/25 transition-all"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-white/70 text-sm self-center mr-2">Filter:</span>
          {categories.map((category) => {
            const isSelected = isCategorySelected(category)
            return (
              <Badge
                key={category}
                variant={isSelected ? 'default' : 'outline'}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                    : 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                }`}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </Badge>
            )
          })}
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange && onFilterChange(null)}
              className="text-white/70 hover:text-white hover:bg-white/10 h-6 px-2 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {(searchTerm || selectedCategories.length > 0) && (
        <div className="text-white/60 text-sm">
          {searchTerm && `Searching for "${searchTerm}"`}
          {searchTerm && selectedCategories.length > 0 && ' • '}
          {selectedCategories.length > 0 && `Filtered by: ${selectedCategories.join(', ')}`}
        </div>
      )}
    </motion.div>
  )
}

export default SearchBar
