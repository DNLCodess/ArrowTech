// app/api/checkout/create-session/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, currency, returnUrl, items } = await request.json();

    if (!amount || !currency || !returnUrl) {
      return NextResponse.json(
        { error: "Amount, currency, and returnUrl are required" },
        { status: 400 }
      );
    }

    // According to Adyen docs, the session request should include:
    const sessionRequest = {
      amount: {
        value: amount, // Amount in minor units (pence for GBP)
        currency: currency, // Now supports GBP
      },
      reference: `order-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      returnUrl: returnUrl,
      merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
      countryCode: "GB", // Changed to GB for UK
      shopperLocale: "en-GB", // Changed to en-GB for UK locale
      channel: "Web",
      // Add optional metadata
      metadata: {
        integrationType: "nextjs_dropin",
      },
    };

    // Add lineItems only if provided (optional according to docs)
    if (items && items.length > 0) {
      sessionRequest.lineItems = items.map((item) => ({
        id: item.id.substring(0, 50), // Max 50 chars
        description: item.description.substring(0, 256), // Max 256 chars
        amountIncludingTax: item.amountIncludingTax,
        quantity: item.quantity,
      }));
    }

    console.log("Creating Adyen session with:", sessionRequest);

    const response = await fetch(
      `https://checkout-test.adyen.com/${
        process.env.ADYEN_API_VERSION || "v71"
      }/sessions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.ADYEN_API_KEY,
        },
        body: JSON.stringify(sessionRequest),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Adyen session creation failed:", data);
      return NextResponse.json(
        {
          error: "Failed to create payment session",
          details: data,
          status: response.status,
        },
        { status: response.status }
      );
    }

    // Return the session data exactly as Adyen provides it
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
