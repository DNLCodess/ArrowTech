// app/api/checkout/submit-payment/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { sessionId, paymentData, amount } = await request.json();

    if (!sessionId || !paymentData || !amount) {
      return NextResponse.json(
        { error: "Session ID, payment data, and amount are required" },
        { status: 400 }
      );
    }

    // For Sessions flow, construct the payment request
    const paymentRequest = {
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      amount: amount, // Use the amount from the request body (supports GBP)
      reference: `payment-${Date.now()}`,
      paymentMethod: paymentData.paymentMethod,
      countryCode: "GB",
      returnUrl:
        paymentData.returnUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/result`,
      sessionId: sessionId, // Include the session ID
    };

    const response = await fetch(
      `https://checkout-test.adyen.com/${
        process.env.ADYEN_API_VERSION || "v71"
      }/payments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.ADYEN_API_KEY,
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Adyen payment failed:", data);
      return NextResponse.json(
        { error: "Payment failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
