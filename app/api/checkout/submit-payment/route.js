// app/api/checkout/submit-payment/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { sessionId, paymentData } = await request.json();

    if (!sessionId || !paymentData) {
      return NextResponse.json(
        { error: "Session ID and payment data are required" },
        { status: 400 }
      );
    }

    // For session flow, we typically don't need to make additional /payments calls
    // as the session handles the payment processing
    // This endpoint can be used for advanced flows or additional processing

    const response = await fetch(
      "https://checkout-test.adyen.com/v71/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ADYEN_API_KEY,
        },
        body: JSON.stringify({
          merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount,
          reference: `payment-${Date.now()}`,
          returnUrl:
            paymentData.returnUrl ||
            `${request.nextUrl.origin}/checkout/result`,
          channel: "Web",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Adyen payment submission failed:", data);
      return NextResponse.json(
        { error: "Payment submission failed", details: data },
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
