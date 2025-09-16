export const products = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 1199,
    category: 'smartphones',
    description: 'The ultimate iPhone with titanium design and advanced camera system.',
    specs: {
      display: '6.7" Super Retina XDR',
      storage: '256GB',
      camera: '48MP Main Camera',
      battery: 'Up to 29 hours video playback'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
    ],
    inStock: true,
    featured: true,
    rating: 4.8,
    reviews: 124
  },
  {
    id: '2',
    name: 'MacBook Pro 16"',
    price: 2499,
    category: 'laptops',
    description: 'Supercharged for professionals with M3 Pro chip.',
    specs: {
      processor: 'Apple M3 Pro',
      memory: '18GB Unified Memory',
      storage: '512GB SSD',
      display: '16.2" Liquid Retina XDR'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    ],
    inStock: true,
    featured: true,
    rating: 4.9,
    reviews: 89
  },
  {
    id: '3',
    name: 'AirPods Pro (2nd Gen)',
    price: 249,
    category: 'headphones',
    description: 'Up to 2x more Active Noise Cancellation.',
    specs: {
      battery: 'Up to 6 hours listening time',
      features: 'Adaptive Transparency, Personalized Spatial Audio',
      connectivity: 'Bluetooth 5.3',
      charging: 'MagSafe Charging Case'
    },
    images: [
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800',
    ],
    inStock: true,
    featured: true,
    rating: 4.7,
    reviews: 201
  },
  {
    id: '4',
    name: 'Apple Watch Ultra 2',
    price: 799,
    category: 'smartwatches',
    description: 'The most rugged and capable Apple Watch.',
    specs: {
      display: '49mm Always-On Retina',
      battery: 'Up to 36 hours',
      features: 'GPS + Cellular, Water resistant to 100 meters',
      health: 'Blood Oxygen, ECG, Temperature sensing'
    },
    images: [
      'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=800',
      'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800',
    ],
    inStock: true,
    featured: false,
    rating: 4.6,
    reviews: 76
  },
  {
    id: '5',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299,
    category: 'smartphones',
    description: 'Galaxy AI is here. Epic just got more epic.',
    specs: {
      display: '6.8" Dynamic AMOLED 2X',
      storage: '512GB',
      camera: '200MP Main Camera',
      battery: '5000mAh'
    },
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    ],
    inStock: true,
    featured: false,
    rating: 4.5,
    reviews: 143
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    price: 399,
    category: 'headphones',
    description: 'Industry-leading noise canceling headphones.',
    specs: {
      battery: '30 hours with NC ON',
      features: 'Hi-Res Audio, LDAC codec',
      connectivity: 'Bluetooth 5.2, NFC',
      weight: '250g'
    },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
    ],
    inStock: true,
    featured: false,
    rating: 4.8,
    reviews: 312
  },
  {
    id: '7',
    name: 'Dell XPS 13',
    price: 1199,
    category: 'laptops',
    description: 'Ultra-portable laptop with stunning InfinityEdge display.',
    specs: {
      processor: 'Intel Core i7-1355U',
      memory: '16GB LPDDR5',
      storage: '512GB PCIe NVMe SSD',
      display: '13.4" FHD+ InfinityEdge'
    },
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
    ],
    inStock: false,
    featured: false,
    rating: 4.4,
    reviews: 67
  },
  {
    id: '8',
    name: 'iPad Pro 12.9"',
    price: 1099,
    category: 'tablets',
    description: 'The ultimate iPad experience with M2 chip.',
    specs: {
      processor: 'Apple M2 chip',
      display: '12.9" Liquid Retina XDR',
      storage: '128GB',
      connectivity: 'Wi-Fi 6E, 5G capable'
    },
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800',
    ],
    inStock: true,
    featured: false,
    rating: 4.7,
    reviews: 98
  }
]

export const categories = [
  { id: 'smartphones', name: 'Smartphones', icon: 'Smartphone' },
  { id: 'laptops', name: 'Laptops', icon: 'Laptop' },
  { id: 'headphones', name: 'Headphones', icon: 'Headphones' },
  { id: 'smartwatches', name: 'Smartwatches', icon: 'Watch' },
  { id: 'tablets', name: 'Tablets', icon: 'Tablet' },
  { id: 'accessories', name: 'Accessories', icon: 'Cable' }
]

export const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Tech Executive",
    quote: "ArrowTech delivers premium quality tech that transforms how I work. Absolutely exceptional service.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    quote: "The attention to detail and premium experience is unmatched. My go-to for all tech needs.",
    rating: 5
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Creative Director",
    quote: "Beautiful products, seamless experience. ArrowTech understands what premium really means.",
    rating: 5
  }
]