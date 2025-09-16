import { cn } from "../../lib/utils"
import { motion } from "framer-motion"

const Button = ({ 
  children, 
  variant = "primary", 
  size = "default",
  className,
  disabled,
  loading,
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gold/50"
  
  const variants = {
    primary: "bg-gold text-primary hover:bg-gold/90 hover:scale-105 hover:shadow-lg hover:shadow-gold/20",
    secondary: "border-2 border-gold text-gold hover:bg-gold hover:text-primary hover:scale-105",
    outline: "border border-white/20 text-white hover:bg-white/10 hover:border-gold/50",
    ghost: "text-gold hover:bg-gold/10 hover:text-gold"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  )
}

export default Button