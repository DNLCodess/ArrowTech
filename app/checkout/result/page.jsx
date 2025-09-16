"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Mail,
  CreditCard,
  Package,
} from "lucide-react";
import Button from "../../../src/components/ui/Button";

function CheckoutResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const resultCode = searchParams?.get("resultCode");
  const pspReference = searchParams?.get("pspReference");
  const merchantReference = searchParams?.get("merchantReference");
  const amount = searchParams?.get("amount");
  const currency = searchParams?.get("currency") || "USD";

  useEffect(() => {
    setMounted(true);
    // Show confetti animation for successful payments
    if (resultCode === "Authorised" || resultCode === "Received") {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [resultCode]);

  if (!mounted) {
    return <CheckoutResultLoading />;
  }

  const getResultDisplay = () => {
    switch (resultCode) {
      case "Authorised":
        return {
          icon: CheckCircle,
          title: "Payment Successful!",
          message:
            "Thank you for your purchase. Your order has been confirmed and is being prepared for shipment.",
          color: "text-emerald-400",
          bgColor: "bg-emerald/10",
          borderColor: "border-emerald/30",
          status: "success",
        };
      case "Received":
        return {
          icon: CheckCircle,
          title: "Payment Received!",
          message:
            "Your payment has been received and is being processed. We'll send you a confirmation email shortly.",
          color: "text-emerald-400",
          bgColor: "bg-emerald/10",
          borderColor: "border-emerald/30",
          status: "success",
        };
      case "Pending":
        return {
          icon: Clock,
          title: "Payment Pending",
          message:
            "Your payment is being processed. This may take a few minutes. You'll receive an email confirmation once completed.",
          color: "text-yellow-400",
          bgColor: "bg-yellow/10",
          borderColor: "border-yellow/30",
          status: "pending",
        };
      case "Refused":
        return {
          icon: XCircle,
          title: "Payment Declined",
          message:
            "Your payment was declined by your bank. Please check your payment details or try a different payment method.",
          color: "text-red-400",
          bgColor: "bg-red/10",
          borderColor: "border-red/30",
          status: "failed",
        };
      case "Cancelled":
        return {
          icon: XCircle,
          title: "Payment Cancelled",
          message:
            "Your payment was cancelled. Your items are still in your cart if you'd like to try again.",
          color: "text-orange-400",
          bgColor: "bg-orange/10",
          borderColor: "border-orange/30",
          status: "cancelled",
        };
      case "Error":
        return {
          icon: XCircle,
          title: "Payment Error",
          message:
            "An error occurred while processing your payment. Please try again or contact support if the problem persists.",
          color: "text-red-400",
          bgColor: "bg-red/10",
          borderColor: "border-red/30",
          status: "error",
        };
      default:
        return {
          icon: XCircle,
          title: "Unknown Status",
          message:
            "We couldn't determine your payment status. Please contact support for assistance.",
          color: "text-gray-400",
          bgColor: "bg-gray/10",
          borderColor: "border-gray/30",
          status: "unknown",
        };
    }
  };

  const result = getResultDisplay();
  const IconComponent = result.icon;
  const isSuccess = result.status === "success";
  const isPending = result.status === "pending";
  const isFailed = result.status === "failed" || result.status === "error";

  return (
    <div className="min-h-screen py-8 relative">
      {/* Confetti Effect for Success */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gold rounded animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Status Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`inline-flex p-4 rounded-full mb-6 ${result.bgColor} ${result.borderColor} border`}
          >
            <IconComponent className={`w-12 h-12 ${result.color}`} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-cinzel font-bold text-white text-4xl mb-4"
          >
            {result.title}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto"
          >
            {result.message}
          </motion.p>

          {/* Order Details for Successful Payments */}
          {(isSuccess || isPending) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate rounded-xl p-6 premium-glow mb-8"
            >
              <h2 className="font-cinzel font-semibold text-white text-xl mb-4 flex items-center justify-center">
                <Package className="w-5 h-5 mr-2" />
                Order Details
              </h2>
              <div className="space-y-3 text-left">
                {pspReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Transaction ID:</span>
                    <span className="text-white font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                      {pspReference}
                    </span>
                  </div>
                )}
                {merchantReference && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Order Number:</span>
                    <span className="text-white font-mono text-sm bg-slate-800 px-2 py-1 rounded">
                      {merchantReference}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <span className={`${result.color} font-semibold`}>
                    {resultCode}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Next Steps for Successful Orders */}
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate rounded-xl p-6 premium-glow mb-8"
            >
              <h3 className="font-cinzel font-semibold text-white text-lg mb-4">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      Email Confirmation
                    </p>
                    <p className="text-gray-400 text-xs">
                      You'll receive a confirmation email within 5 minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm">
                      Order Processing
                    </p>
                    <p className="text-gray-400 text-xs">
                      Your items will be prepared for shipment
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {isSuccess ? (
              <>
                <Button
                  onClick={() => router.push("/products")}
                  className="group"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // In a real app, this would generate and download a receipt
                    alert("Receipt download would be implemented here");
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
              </>
            ) : isPending ? (
              <>
                <Button
                  onClick={() => router.push("/products")}
                  className="group"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    // Refresh the page to check status
                    window.location.reload();
                  }}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => router.push("/cart")} className="group">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => router.push("/products")}
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </>
            )}
          </motion.div>

          {/* Support Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-4 border border-gold/20 rounded-lg"
          >
            <p className="text-gray-400 text-sm mb-2">
              Need help with your order?
            </p>
            <p className="text-gold text-sm">
              Contact our support team at support@arrowtech.com or call
              1-800-ARROW-TECH
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced Loading Component
function CheckoutResultLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your order status...</p>
      </motion.div>
    </div>
  );
}

// Main component with Suspense wrapper
const CheckoutResultPage = () => {
  return (
    <Suspense fallback={<CheckoutResultLoading />}>
      <CheckoutResultContent />
    </Suspense>
  );
};

export default CheckoutResultPage;
