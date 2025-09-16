// app/api/checkout/create-session/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, currency, returnUrl, items } = await request.json();

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      );
    }

    const sessionData = {
      amount: {
        value: Math.round(amount), // Already in cents from frontend
        currency: currency,
      },
      reference: `order-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      returnUrl: returnUrl,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      countryCode: "US",
      shopperLocale: "en_US",
      channel: "Web",
      lineItems:
        items?.map((item) => ({
          id: item.id,
          description: item.description,
          amountIncludingTax: item.amountIncludingTax,
          quantity: item.quantity,
        })) || [],
    };

    const response = await fetch(
      "https://checkout-test.adyen.com/v71/sessions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ADYEN_API_KEY,
        },
        body: JSON.stringify(sessionData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Adyen session creation failed:", data);
      return NextResponse.json(
        { error: "Failed to create payment session", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
