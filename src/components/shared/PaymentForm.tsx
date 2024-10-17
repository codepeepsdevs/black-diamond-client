// src/Payment.js

import React, { FormEventHandler, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("your-publishable-key");

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    // Fetch payment intent from backend
    const response = await fetch(
      "http://localhost:3000/stripe/create-payment-intent",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }), // Example amount (e.g., $50.00)
      }
    );

    const { clientSecret } = await response.json();

    // Confirm card payment
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (result.error) {
      console.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      console.log("Payment succeeded!");
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

const Payment = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default Payment;
