import { ArrowRight, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-gold to-yellow-400 rounded-lg">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-cinzel font-bold gradient-text">ArrowTech</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Elevating your tech experience with premium devices and exceptional service. 
              Where innovation meets luxury.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cinzel font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-gold transition-colors">Home</a></li>
              <li><a href="/products" className="text-gray-300 hover:text-gold transition-colors">Products</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-gold transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-cinzel font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Shipping Info</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Returns</a></li>
              <li><a href="#" className="text-gray-300 hover:text-gold transition-colors">Warranty</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 ArrowTech. All rights reserved. Crafted with precision and passion.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer