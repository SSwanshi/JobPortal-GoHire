import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import paymentService from '../../services/paymentService';
import { useToast } from '../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ amount, plan, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret, paymentIntentId } = await paymentService.createPaymentIntent(amount, plan);

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        showToast(error.message, 'error');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Process payment on backend
        const result = await paymentService.processPayment(paymentIntentId, plan, amount);
        
        if (result.success) {
          showToast('Payment successful! You are now a premium member!', 'success');
          if (onSuccess) onSuccess(result);
          setTimeout(() => navigate('/profile'), 2000);
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      showToast(error.response?.data?.error || 'Payment failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="bg-white p-4 rounded border border-gray-300">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${
          processing || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {processing ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your payment is secured by Stripe. We don't store your card details.
      </p>
    </form>
  );
};

export default CheckoutForm;
