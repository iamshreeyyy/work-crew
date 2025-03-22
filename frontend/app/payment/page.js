'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    try {
      // Create a PaymentIntent (here using immediate capture; change endpoint for escrow)
      const { data } = await axios.post('http://localhost:5000/api/payments/create-payment-intent', {
        amount: 5000, // amount in cents ($50)
        currency: 'usd',
        milestoneId: 'SOME_MILESTONE_ID', // replace as needed
        metadata: {}
      });
      const clientSecret = data.clientSecret;

      // Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        setSuccess('Payment successful!');
      }
    } catch (err) {
      setError('Payment failed, please try again.');
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <CardElement options={{ hidePostalCode: true }} />
      <button type="submit" disabled={!stripe || processing} style={{ marginTop: '1rem' }}>
        {processing ? 'Processing...' : 'Pay $50'}
      </button>
      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: '1rem' }}>{success}</div>}
    </form>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem' }}>
        <h1>Payment Page</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </ProtectedRoute>
  );
}
