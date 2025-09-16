/ app/api/checkout/submit-details/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { sessionId, details } = await request.json();

    if (!details) {
      return NextResponse.json(
        { error: "Payment details are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://checkout-test.adyen.com/v71/payments/details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ADYEN_API_KEY,
        },
        body: JSON.stringify({
          details: details,
          paymentData: details.paymentData,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Adyen details submission failed:", data);
      return NextResponse.json(
        { error: "Details submission failed", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Details submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
