"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShoppingBag, CheckCircle } from "lucide-react";
import {
  useCartStore,
  useCartItemsCount,
  useCartTotal,
} from "../../src/store/cart";
import { formatPrice } from "../../src/lib/utils";
import Button from "../../src/components/ui/Button";
import toast from "react-hot-toast";

// Disable prerendering for this page
export const dynamic = "force-dynamic";

const CheckoutPage = () => {
  console.log("CheckoutPage: Component rendering");
  const router = useRouter();
  const dropinRef = useRef(null);
  const checkoutRef = useRef(null);
  const sessionRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const { items, clearCart } = useCartStore();
  const total = useCartTotal();
  const itemsCount = useCartItemsCount();

  console.log("CheckoutPage: Initial state", {
    mounted,
    loading,
    paymentInProgress,
    showPaymentForm,
    paymentSuccess,
    itemsCount,
    total,
  });

  useEffect(() => {
    console.log("CheckoutPage: useEffect for mounting triggered");
    setMounted(true);
    console.log("CheckoutPage: Mounted set to true");
  }, []);

  useEffect(() => {
    console.log(
      "CheckoutPage: useEffect for payment initialization triggered",
      {
        mounted,
        paymentSuccess,
      }
    );

    if (!mounted) {
      console.log("CheckoutPage: Skipping initialization, not mounted");
      return;
    }

    if (items.length === 0 && !paymentSuccess) {
      console.log(
        "CheckoutPage: Cart is empty and no payment success, redirecting to /cart"
      );
      toast.error("Your cart is empty");
      router.push("/cart");
      return;
    }

    if (paymentSuccess) {
      console.log(
        "CheckoutPage: Payment already successful, skipping initialization"
      );
      return;
    }

    console.log("CheckoutPage: Setting showPaymentForm to true");
    setShowPaymentForm(true);
    console.log("CheckoutPage: Scheduling initPayment with 50ms delay");
    const timer = setTimeout(() => {
      console.log("CheckoutPage: Executing initPayment");
      initPayment();
    }, 50);

    return () => {
      console.log("CheckoutPage: Cleaning up useEffect, clearing timer");
      clearTimeout(timer);
    };
  }, [mounted, paymentSuccess, router, items.length]);

  const initPayment = async () => {
    console.log("initPayment: Starting payment initialization", {
      itemsCount,
      total,
      paymentSuccess,
    });

    if (items.length === 0 || paymentSuccess) {
      console.log(
        "initPayment: Skipping due to empty cart or payment already successful"
      );
      setLoading(false);
      console.log("initPayment: Set loading to false");
      return;
    }

    try {
      setLoading(true);
      console.log("initPayment: Set loading to true");

      console.log(
        "initPayment: Sending request to /api/checkout/create-session",
        {
          amount: Math.round(total * 100),
          currency: "GBP",
          returnUrl: `${window.location.origin}/checkout/result`,
          items: items.map((item) => ({
            id: item.id,
            description: item.name || "Unnamed Product",
            amountIncludingTax: Math.round(
              (item.price || 0) * (item.quantity || 0) * 100
            ),
            quantity: item.quantity || 0,
          })),
        }
      );

      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "GBP",
          returnUrl: `${window.location.origin}/checkout/result`,
          items: items.map((item) => ({
            id: item.id,
            description: item.name || "Unnamed Product",
            amountIncludingTax: Math.round(
              (item.price || 0) * (item.quantity || 0) * 100
            ),
            quantity: item.quantity || 0,
          })),
        }),
      });

      console.log("initPayment: Session API response received", {
        status: response.status,
      });

      const sessionData = await response.json();
      console.log("initPayment: Session API response data", sessionData);

      if (!response.ok || sessionData.error) {
        console.error("initPayment: Failed to create session", {
          status: response.status,
          error: sessionData.error,
        });
        throw new Error(
          sessionData.error ||
            `Failed to create payment session (Status: ${response.status})`
        );
      }

      if (!sessionData.id || !sessionData.sessionData) {
        console.error(
          "initPayment: Invalid session data structure",
          sessionData
        );
        throw new Error("Invalid session data received from server");
      }

      console.log("initPayment: Adyen session created successfully", {
        id: sessionData.id,
        sessionData: sessionData.sessionData ? "exists" : "missing",
      });

      sessionRef.current = sessionData;
      console.log("initPayment: Session ref updated", {
        sessionId: sessionData.id,
      });

      console.log("initPayment: Importing AdyenCheckout and CSS");
      const { default: AdyenCheckout } = await import("@adyen/adyen-web");
      await import("@adyen/adyen-web/dist/adyen.css");
      console.log("initPayment: AdyenCheckout and CSS imported");

      const configuration = {
        environment: process.env.NEXT_PUBLIC_ADYEN_ENV || "test",
        clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
        session: {
          id: sessionData.id,
          sessionData: sessionData.sessionData,
        },
        onPaymentCompleted: (result, component) => {
          console.log("initPayment: onPaymentCompleted triggered", { result });
          handlePaymentResult(result, component);
        },
        onError: (error, component) => {
          console.error("initPayment: Adyen error occurred", { error });
          handleError(error);
        },
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
      };

      console.log(
        "initPayment: Creating Adyen Checkout instance with configuration",
        {
          environment: configuration.environment,
          clientKey: configuration.clientKey,
          sessionId: configuration.session.id,
        }
      );

      const checkout = await AdyenCheckout(configuration);
      checkoutRef.current = checkout;
      console.log("initPayment: Adyen Checkout instance created");

      console.log("initPayment: Creating Drop-in component");
      const dropin = checkout.create("dropin", {
        onSubmit: (state, component) => {
          console.log("initPayment: Drop-in onSubmit triggered", {
            isValid: state.isValid,
          });
          handleSubmit(state, component);
        },
        onAdditionalDetails: (state, component) => {
          console.log("initPayment: Drop-in onAdditionalDetails triggered", {
            state,
          });
          handleAdditionalDetails(state, component);
        },
      });

      let attempts = 0;
      const maxAttempts = 15;

      const tryMount = () => {
        if (dropinRef.current) {
          console.log("initPayment: Mounting Drop-in component");
          dropin.mount(dropinRef.current);
          console.log("initPayment: Drop-in mounted successfully");

          setTimeout(() => {
            addCustomStyles();
          }, 100);
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(`initPayment: Mount attempt ${attempts}/${maxAttempts}`);
          setTimeout(tryMount, 100);
        } else {
          console.error(
            "initPayment: Drop-in container not found after max attempts"
          );
          throw new Error(
            "Drop-in container not found after multiple attempts"
          );
        }
      };

      console.log("initPayment: Starting Drop-in mount process");
      tryMount();
    } catch (error) {
      console.error("initPayment: Payment initialization error", {
        error: error.message,
      });
      if (!paymentSuccess) {
        toast.error(
          error.message || "Failed to initialize payment. Please try again."
        );
      }
      sessionRef.current = null;
      console.log("initPayment: Cleared session ref due to error");
    } finally {
      setLoading(false);
      console.log("initPayment: Set loading to false");
    }
  };

  const addCustomStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      .adyen-checkout__input,
      .adyen-checkout__input--focus,
      .adyen-checkout__input--valid,
      .adyen-checkout__input--invalid {
        color: white !important;
        background-color: transparent !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
      }
      .adyen-checkout__label__text,
      .adyen-checkout__label,
      .adyen-checkout__field__title {
        color: white !important;
      }
      .adyen-checkout__input::placeholder {
        color: rgba(255, 255, 255, 0.6) !important;
      }
      .adyen-checkout__input:focus {
        border-color: #D4AF37 !important;
        box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
      }
      .adyen-checkout__field--error .adyen-checkout__input {
        border-color: #ef4444 !important;
      }
      .adyen-checkout__field--valid .adyen-checkout__input {
        border-color: #10b981 !important;
      }
      .adyen-checkout__error-text {
        color: #ef4444 !important;
      }
      .adyen-checkout__card__form,
      .adyen-checkout__payment-method {
        background-color: transparent !important;
      }
      .adyen-checkout__button--pay {
        background-color: #D4AF37 !important;
        color: #000000 !important;
        border: none !important;
      }
      .adyen-checkout__button--pay:hover {
        background-color: #eab308 !important;
      }
      .adyen-checkout__spinner__wrapper {
        background-color: rgba(30, 41, 59, 0.9) !important;
      }
    `;
    document.head.appendChild(style);
  };

  const handleSubmit = async (state, component) => {
    console.log("handleSubmit: Starting payment submission", {
      isValid: state.isValid,
      paymentData: state.data,
    });

    try {
      const currentSession = sessionRef.current;
      console.log("handleSubmit: Current session from ref", {
        sessionId: currentSession?.id,
      });

      setPaymentInProgress(true);
      console.log("handleSubmit: Set paymentInProgress to true");

      if (!currentSession || !currentSession.id) {
        console.error("handleSubmit: Session not available", {
          currentSession,
        });
        toast.error("Payment session not ready. Please try again.");
        setPaymentInProgress(false);
        console.log(
          "handleSubmit: Set paymentInProgress to false due to missing session"
        );
        return;
      }

      if (!state.isValid) {
        console.log("handleSubmit: Invalid payment data, showing error toast");
        toast.error("Please fill in all required fields");
        setPaymentInProgress(false);
        console.log(
          "handleSubmit: Set paymentInProgress to false due to invalid data"
        );
        return;
      }

      console.log(
        "handleSubmit: Submitting payment to /api/checkout/submit-payment"
      );
      const response = await fetch("/api/checkout/submit-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession.id,
          paymentData: state.data,
          amount: currentSession.amount,
        }),
      });

      console.log("handleSubmit: Submit payment response received", {
        status: response.status,
      });

      const result = await response.json();
      console.log("handleSubmit: Submit payment response data", result);

      if (!response.ok) {
        console.error("handleSubmit: Payment submission failed", {
          status: response.status,
          error: result.error,
        });
        throw new Error(result.error || "Payment submission failed");
      }

      if (result.action) {
        console.log("handleSubmit: Handling Adyen action", {
          action: result.action,
        });
        component.handleAction(result.action);
      } else {
        console.log("handleSubmit: Handling payment result", { result });
        handlePaymentResult(result, component);
      }
    } catch (error) {
      console.error("handleSubmit: Payment submission error", {
        error: error.message,
      });
      toast.error(error.message || "Payment failed. Please try again.");
      setPaymentInProgress(false);
      console.log("handleSubmit: Set paymentInProgress to false due to error");
    }
  };

  const handleAdditionalDetails = async (state, component) => {
    console.log(
      "handleAdditionalDetails: Starting additional details submission",
      { state }
    );

    try {
      const currentSession = sessionRef.current;
      console.log("handleAdditionalDetails: Current session from ref", {
        sessionId: currentSession?.id,
      });

      if (!currentSession || !currentSession.id) {
        console.error("handleAdditionalDetails: Session not available", {
          currentSession,
        });
        toast.error("Payment session not ready. Please try again.");
        setPaymentInProgress(false);
        console.log(
          "handleAdditionalDetails: Set paymentInProgress to false due to missing session"
        );
        return;
      }

      console.log(
        "handleAdditionalDetails: Submitting details to /api/checkout/submit-details"
      );
      const response = await fetch("/api/checkout/submit-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession.id,
          details: state.data,
        }),
      });

      console.log("handleAdditionalDetails: Submit details response received", {
        status: response.status,
      });

      const result = await response.json();
      console.log(
        "handleAdditionalDetails: Submit details response data",
        result
      );

      if (!response.ok) {
        console.error(
          "handleAdditionalDetails: Additional details submission failed",
          {
            status: response.status,
          }
        );
        throw new Error("Additional details submission failed");
      }

      if (result.action) {
        console.log("handleAdditionalDetails: Handling Adyen action", {
          action: result.action,
        });
        component.handleAction(result.action);
      } else {
        console.log("handleAdditionalDetails: Handling payment result", {
          result,
        });
        handlePaymentResult(result, component);
      }
    } catch (error) {
      console.error("handleAdditionalDetails: Additional details error", {
        error: error.message,
      });
      toast.error("Payment verification failed. Please try again.");
      setPaymentInProgress(false);
      console.log(
        "handleAdditionalDetails: Set paymentInProgress to false due to error"
      );
    }
  };

  const handlePaymentResult = (result, component) => {
    console.log("handlePaymentResult: Processing payment result", {
      resultCode: result.resultCode,
      pspReference: result.pspReference,
      refusalReason: result.refusalReason,
    });

    const errorMessages = {
      "CVC Declined":
        "The CVC code you entered is incorrect. Please check and try again.",
      "Card Expired": "Your card has expired. Please use a different card.",
      "Issuer Declined":
        "Your card issuer declined the transaction. Please contact your bank or try another card.",
      Refused:
        "The payment was declined. Please verify your card details or try a different payment method.",
    };

    if (
      result.resultCode === "Authorised" ||
      result.resultCode === "Received"
    ) {
      console.log(
        "handlePaymentResult: Payment successful, clearing cart and setting success state"
      );
      clearCart();
      setPaymentSuccess(true);
      setPaymentDetails(result);
      toast.success("Payment successful!");
      console.log("handlePaymentResult: Updated state", {
        paymentSuccess: true,
        paymentDetails: { pspReference: result.pspReference },
      });
    } else if (result.resultCode === "Pending") {
      console.log(
        "handlePaymentResult: Payment pending, redirecting to result page"
      );
      toast.loading("Payment pending...");
      router.push(
        `/checkout/result?resultCode=${result.resultCode}&pspReference=${result.pspReference}`
      );
    } else {
      console.log("handlePaymentResult: Payment failed", {
        resultCode: result.resultCode,
        refusalReason: result.refusalReason,
      });
      const errorMessage =
        errorMessages[result.refusalReason] ||
        result.refusalReason ||
        "Payment failed. Please try again.";
      toast.error(errorMessage);
      setPaymentInProgress(false);
      console.log("handlePaymentResult: Set paymentInProgress to false");
      if (
        component &&
        (result.refusalReason === "CVC Declined" ||
          result.refusalReason === "Refused")
      ) {
        console.log("handlePaymentResult: Resetting Drop-in component");
        component.reset?.();
      }
    }
  };

  const handleError = (error) => {
    console.error("handleError: Adyen error occurred", {
      error: error.message,
    });
    toast.error("Payment error occurred. Please try again.");
    setPaymentInProgress(false);
    console.log("handleError: Set paymentInProgress to false");
  };

  const handleGoBack = () => {
    console.log("handleGoBack: Navigating back to /cart");
    router.push("/cart");
  };

  console.log("CheckoutPage: Rendering UI based on state", {
    mounted,
    paymentSuccess,
    itemsCount,
  });

  if (!mounted) {
    console.log("CheckoutPage: Rendering loading spinner (not mounted)");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (items.length === 0 && !paymentSuccess) {
    console.log("CheckoutPage: Rendering empty cart UI");
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

  if (paymentSuccess) {
    console.log("CheckoutPage: Rendering success UI", {
      pspReference: paymentDetails?.pspReference,
    });
    return (
      <div className="min-h-screen flex items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <div className="bg-slate rounded-xl p-8 premium-glow">
            <CheckCircle className="w-20 h-20 text-emerald mx-auto mb-6" />
            <h1 className="font-cinzel font-bold text-white text-4xl mb-4">
              Thank You!
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              Your payment was successful.
            </p>
            <p className="text-lg text-gray-400 mb-6">
              Transaction ID: {paymentDetails?.pspReference || "N/A"}
            </p>
            <p className="text-lg text-gray-400 mb-8">
              We've received your order and will send a confirmation email soon.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  console.log(
                    "CheckoutPage: Continue Shopping button clicked, navigating to /products"
                  );
                  router.push("/products");
                }}
                className="bg-gold text-black hover:bg-yellow-500"
              >
                Continue Shopping
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  console.log(
                    "CheckoutPage: View Orders button clicked, navigating to /orders"
                  );
                  router.push("/orders");
                }}
              >
                View Orders
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  console.log("CheckoutPage: Rendering checkout UI", {
    loading,
    showPaymentForm,
    paymentInProgress,
    sessionAvailable: !!sessionRef.current,
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            Complete your purchase of {itemsCount}{" "}
            {itemsCount === 1 ? "item" : "items"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={
                        item.images?.[0] || "/images/placeholder-product.jpg"
                      }
                      alt={item.name || "Product"}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        console.log("CheckoutPage: Image load error for item", {
                          itemId: item.id,
                        });
                        e.target.src = "/images/placeholder-product.jpg";
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium truncate">
                        {item.name || "Unnamed Product"}
                      </h4>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity || 0} ×{" "}
                        {typeof item.price === "number" && !isNaN(item.price)
                          ? formatPrice(item.price)
                          : "N/A"}
                      </p>
                    </div>
                    <p className="text-gold font-semibold">
                      {typeof item.price === "number" && !isNaN(item.price)
                        ? formatPrice((item.price || 0) * (item.quantity || 0))
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
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
                  <span className="text-gray-400">VAT (20%)</span>
                  <span className="text-white">{formatPrice(total * 0.2)}</span>
                </div>
                <hr className="border-gold/20" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-gold">{formatPrice(total * 1.2)}</span>
                </div>
              </div>
            </div>
          </motion.div>

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
                showPaymentForm && (
                  <div
                    ref={dropinRef}
                    className={`adyen-checkout-container ${
                      paymentInProgress || !sessionRef.current
                        ? "pointer-events-none opacity-50"
                        : ""
                    }`}
                  />
                )
              )}
              {!sessionRef.current && !loading && (
                <div className="mt-4 flex items-center justify-center text-gold">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold mr-2"></div>
                  Preparing payment session...
                </div>
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
