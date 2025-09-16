import { create } from 'zustand'
import { products as mockProducts } from '../data/products'

export const useProductStore = create((set, get) => ({
  products: mockProducts,
  filteredProducts: mockProducts,
  selectedCategory: 'all',
  sortBy: 'featured',
  searchQuery: '',
  loading: false,
  
  setLoading: (loading) => set({ loading }),
  
  setProducts: (products) => set({ products, filteredProducts: products }),
  
  setCategory: (category) => {
    set({ selectedCategory: category })
    get().applyFilters()
  },
  
  setSortBy: (sortBy) => {
    set({ sortBy })
    get().applyFilters()
  },
  
  setSearchQuery: (query) => {
    set({ searchQuery: query })
    get().applyFilters()
  },
  
  applyFilters: () => {
    const { products, selectedCategory, sortBy, searchQuery } = get()
    let filtered = [...products]
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        break
    }
    
    set({ filteredProducts: filtered })
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id)
  },
  
  getFeaturedProducts: () => {
    return get().products.filter(product => product.featured)
  }
}))