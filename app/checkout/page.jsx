"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../src/store/cart";
import { formatPrice } from "../../src/lib/utils";
import Button from "../../src/components/ui/Button";
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const router = useRouter();
  const dropinRef = useRef(null);
  const checkoutRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalFn = useCartStore((state) => state.total);
  const itemsCountFn = useCartStore((state) => state.itemsCount);

  const total = totalFn();
  const itemsCount = itemsCountFn();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Redirect to cart if empty
    if (items.length === 0 || total <= 0) {
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    initPayment();
  }, [mounted, items, total]);

  const initPayment = async () => {
    try {
      setLoading(true);

      // Create payment session
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 108), // Include tax, convert to cents
          currency: "USD",
          returnUrl: `${window.location.origin}/checkout/result`,
          items: items.map((item) => ({
            id: item.id,
            description: item.name,
            amountIncludingTax: Math.round(item.price * item.quantity * 108),
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment session");
      }

      const data = await response.json();
      setSession(data);

      // Initialize Adyen Checkout
      const AdyenCheckout = (await import("@adyen/adyen-web")).default;
      await import("@adyen/adyen-web/dist/adyen.css");

      const checkout = await AdyenCheckout({
        environment: process.env.NEXT_PUBLIC_ADYEN_ENV || "test",
        clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
        session: {
          id: data.id,
          sessionData: data.sessionData,
        },
        onSubmit: handleSubmit,
        onAdditionalDetails: handleAdditionalDetails,
        onPaymentCompleted: handlePaymentCompleted,
        onError: handleError,
        // Premium styling
        paymentMethodsConfiguration: {
          card: {
            hasHolderName: true,
            holderNameRequired: true,
            billingAddressRequired: false,
            styles: {
              base: {
                color: "#ffffff",
                fontSize: "16px",
                fontFamily: '"Inter", sans-serif',
              },
              error: {
                color: "#ff6b6b",
              },
              validated: {
                color: "#51cf66",
              },
              placeholder: {
                color: "#9ca3af",
              },
            },
          },
        },
      });

      checkoutRef.current = checkout;

      // Mount Drop-in
      const dropin = checkout.create("dropin").mount(dropinRef.current);
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (state, component) => {
    try {
      setPaymentInProgress(true);

      if (!state.isValid) {
        toast.error("Please fill in all required fields");
        return;
      }

      const response = await fetch("/api/checkout/submit-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          paymentData: state.data,
        }),
      });

      const result = await response.json();

      if (result.action) {
        component.handleAction(result.action);
      } else {
        handlePaymentResult(result);
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      toast.error("Payment failed. Please try again.");
      setPaymentInProgress(false);
    }
  };

  const handleAdditionalDetails = async (state, component) => {
    try {
      const response = await fetch("/api/checkout/submit-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          details: state.data,
        }),
      });

      const result = await response.json();

      if (result.action) {
        component.handleAction(result.action);
      } else {
        handlePaymentResult(result);
      }
    } catch (error) {
      console.error("Additional details error:", error);
      toast.error("Payment verification failed. Please try again.");
      setPaymentInProgress(false);
    }
  };

  const handlePaymentCompleted = (result, component) => {
    handlePaymentResult(result);
  };

  const handlePaymentResult = (result) => {
    if (
      result.resultCode === "Authorised" ||
      result.resultCode === "Received"
    ) {
      // Payment successful
      clearCart();
      toast.success("Payment successful!");
      router.push(
        `/checkout/result?resultCode=${result.resultCode}&pspReference=${result.pspReference}`
      );
    } else if (result.resultCode === "Pending") {
      toast.loading("Payment pending...");
      router.push(
        `/checkout/result?resultCode=${result.resultCode}&pspReference=${result.pspReference}`
      );
    } else {
      // Payment failed
      toast.error("Payment failed. Please try again.");
      setPaymentInProgress(false);
    }
  };

  const handleError = (error) => {
    console.error("Adyen error:", error);
    toast.error("Payment error occurred. Please try again.");
    setPaymentInProgress(false);
  };

  const handleGoBack = () => {
    router.push("/cart");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h1 className="font-cinzel font-bold text-white text-4xl mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Button onClick={() => router.push("/products")}>
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center mb-4">
            <Button variant="secondary" onClick={handleGoBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Cart
            </Button>
          </div>
          <h1 className="font-cinzel font-bold text-white text-4xl mb-2">
            Secure Checkout
          </h1>
          <p className="text-xl text-gray-400">
            Complete your purchase of {itemsCount} items
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-2 lg:order-1"
          >
            <div className="bg-slate rounded-xl p-6 premium-glow sticky top-8">
              <h2 className="font-cinzel font-semibold text-white text-xl mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={
                        item.images?.[0] || "/images/placeholder-product.jpg"
                      }
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="text-gold font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gold/20">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-emerald">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (8%)</span>
                  <span className="text-white">
                    {formatPrice(total * 0.08)}
                  </span>
                </div>
                <hr className="border-gold/20" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-gold">{formatPrice(total * 1.08)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="order-1 lg:order-2"
          >
            <div className="bg-slate rounded-xl p-6 premium-glow">
              <h2 className="font-cinzel font-semibold text-white text-xl mb-6">
                Payment Information
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mr-3"></div>
                  <span className="text-gray-400">
                    Loading payment methods...
                  </span>
                </div>
              ) : (
                <div
                  ref={dropinRef}
                  className={`adyen-checkout-container ${
                    paymentInProgress ? "pointer-events-none opacity-50" : ""
                  }`}
                />
              )}

              {paymentInProgress && (
                <div className="mt-4 flex items-center justify-center text-gold">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold mr-2"></div>
                  Processing payment...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
