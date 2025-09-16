// app/checkout/result/page.js - Payment Result Page
("use client");

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";
import Button from "../../../components/ui/Button";

const CheckoutResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const resultCode = searchParams?.get("resultCode");
  const pspReference = searchParams?.get("pspReference");
  const merchantReference = searchParams?.get("merchantReference");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
      </div>
    );
  }

  const getResultDisplay = () => {
    switch (resultCode) {
      case "Authorised":
        return {
          icon: CheckCircle,
          title: "Payment Successful!",
          message:
            "Thank you for your purchase. Your order has been confirmed.",
          color: "text-emerald-400",
          bgColor: "bg-emerald/10",
          borderColor: "border-emerald/30",
        };
      case "Received":
        return {
          icon: CheckCircle,
          title: "Payment Received!",
          message: "Your payment has been received and is being processed.",
          color: "text-emerald-400",
          bgColor: "bg-emerald/10",
          borderColor: "border-emerald/30",
        };
      case "Pending":
        return {
          icon: Clock,
          title: "Payment Pending",
          message:
            "Your payment is being processed. You will receive a confirmation email shortly.",
          color: "text-yellow-400",
          bgColor: "bg-yellow/10",
          borderColor: "border-yellow/30",
        };
      case "Refused":
      case "Cancelled":
      case "Error":
      default:
        return {
          icon: XCircle,
          title: "Payment Failed",
          message:
            "Your payment could not be processed. Please try again or use a different payment method.",
          color: "text-red-400",
          bgColor: "bg-red/10",
          borderColor: "border-red/30",
        };
    }
  };

  const result = getResultDisplay();
  const IconComponent = result.icon;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className={`inline-flex p-4 rounded-full mb-6 ${result.bgColor} ${result.borderColor} border`}
          >
            <IconComponent className={`w-12 h-12 ${result.color}`} />
          </div>

          <h1 className="font-cinzel font-bold text-white text-4xl mb-4">
            {result.title}
          </h1>

          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {result.message}
          </p>

          {(resultCode === "Authorised" || resultCode === "Received") && (
            <div className="bg-slate rounded-xl p-6 premium-glow mb-8">
              <h2 className="font-cinzel font-semibold text-white text-xl mb-4">
                Order Details
              </h2>
              <div className="space-y-2 text-left">
                {pspReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Reference:</span>
                    <span className="text-white font-mono text-sm">
                      {pspReference}
                    </span>
                  </div>
                )}
                {merchantReference && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Order:</span>
                    <span className="text-white font-mono text-sm">
                      {merchantReference}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`${result.color} font-semibold`}>
                    {resultCode}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/products")} className="group">
              Continue Shopping
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            {resultCode === "Authorised" || resultCode === "Received" ? (
              <Button
                variant="secondary"
                onClick={() => router.push("/orders")}
              >
                View Orders
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => router.push("/cart")}>
                Return to Cart
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutResultPage;
