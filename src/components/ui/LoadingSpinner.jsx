import { ArrowRight } from "lucide-react"

const LoadingSpinner = ({ size = "default" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12"
  }

  return (
    <div className="flex items-center justify-center">
      <ArrowRight className={`${sizeClasses[size]} text-gold animate-spin-slow`} />
    </div>
  )
}

export default LoadingSpinner