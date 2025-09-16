import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, CreditCard, User, MapPin, Mail, Phone } from "lucide-react";
import { useCartStore } from "../store/cart";
import { formatPrice } from "../lib/utils";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

// Note: In a real implementation, you would install and configure Adyen properly
// This is a mock implementation for demonstration
const CheckoutPage = () => {
  const { items, total, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [shippingData, setShippingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const [billingData, setBillingData] = useState({
    sameAsShipping: true,
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (items.length === 0) {
      window.location.href = "/cart";
    }
  }, [items]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillingData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateStep = (step) => {
    if (step === 1) {
      const required = [
        "firstName",
        "lastName",
        "email",
        "address",
        "city",
        "state",
        "zipCode",
      ];
      return required.every((field) => shippingData[field].trim() !== "");
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitOrder = async () => {
    setLoading(true);

    try {
      // Mock Adyen payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, you would:
      // 1. Create payment session with Adyen
      // 2. Initialize AdyenCheckout
      // 3. Handle payment result
      // 4. Process or
      // der

      toast.success("Order placed successfully!");
      clearCart();

      // Redirect to success page
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Shipping Information", icon: MapPin },
    { id: 2, title: "Billing Information", icon: User },
    { id: 3, title: "Payment", icon: CreditCard },
  ];

  const orderTotal = total * 1.08; // Including tax

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-cinzel font-bold text-white mb-4">
            Secure Checkout
          </h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <Lock className="w-4 h-4" />
            <span>
              Your information is protected with 256-bit SSL encryption
            </span>
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.id
                      ? "bg-gold border-gold text-primary"
                      : "border-gray-400 text-gray-400"
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <span
                  className={`ml-2 font-semibold ${
                    currentStep >= step.id ? "text-gold" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-gold" : "bg-gray-600"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate rounded-xl p-6 premium-glow"
            >
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-cinzel font-semibold text-white mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={shippingData.email}
                          onChange={handleShippingChange}
                          className="w-full pl-10 pr-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={shippingData.phone}
                          onChange={handleShippingChange}
                          className="w-full pl-10 pr-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Billing Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-cinzel font-semibold text-white mb-6">
                    Billing Information
                  </h2>

                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      name="sameAsShipping"
                      checked={billingData.sameAsShipping}
                      onChange={handleBillingChange}
                      className="w-4 h-4 text-gold bg-primary border-gold/30 rounded focus:ring-gold focus:ring-2"
                    />
                    <label htmlFor="sameAsShipping" className="text-white">
                      Billing address is the same as shipping address
                    </label>
                  </div>

                  {!billingData.sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={billingData.firstName}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={billingData.lastName}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={billingData.address}
                          onChange={handleBillingChange}
                          className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={billingData.city}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="state"
                            value={billingData.state}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={billingData.zipCode}
                            onChange={handleBillingChange}
                            className="w-full px-4 py-3 bg-primary border border-gold/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-cinzel font-semibold text-white mb-6">
                    Payment Information
                  </h2>

                  <div className="bg-primary rounded-lg p-6 border border-gold/30">
                    <div className="flex items-center space-x-2 mb-4">
                      <Lock className="w-5 h-5 text-gold" />
                      <span className="text-white font-semibold">
                        Secure Payment powered by Adyen
                      </span>
                    </div>

                    <div className="text-center py-8 border-2 border-dashed border-gold/30 rounded-lg">
                      <CreditCard className="w-12 h-12 text-gold mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">
                        In a real implementation, the Adyen Drop-in component
                        would be mounted here
                      </p>
                      <p className="text-sm text-gray-500">
                        Supporting all major payment methods including:
                        <br />
                        Credit/Debit Cards, Apple Pay, Google Pay, PayPal, and
                        more
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-gold/20">
                {currentStep > 1 && (
                  <Button variant="secondary" onClick={handlePreviousStep}>
                    Previous
                  </Button>
                )}

                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep}>Next Step</Button>
                  ) : (
                    <Button
                      onClick={handleSubmitOrder}
                      loading={loading}
                      className="bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90"
                    >
                      Complete Order - {formatPrice(orderTotal)}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate rounded-xl p-6 premium-glow sticky top-8"
            >
              <h2 className="font-cinzel font-semibold text-white text-xl mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">
                        {item.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-gold font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <hr className="border-gold/20 mb-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-emerald">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white">
                    {formatPrice(total * 0.08)}
                  </span>
                </div>
                <hr className="border-gold/20" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-gold">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400 text-center">
                By completing your order, you agree to our Terms of Service and
                Privacy Policy.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
