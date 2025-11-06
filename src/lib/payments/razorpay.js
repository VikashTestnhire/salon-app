import Razorpay from 'razorpay';

// Server-side Razorpay instance (for API routes)
let razorpayInstance = null;

if (typeof window === 'undefined') {
  // Only create instance on server-side
  if (process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
}

export const razorpay = razorpayInstance;

// Client-side payment utilities
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount, currency = 'INR', receipt = null) => {
  if (!razorpay) {
    throw new Error('Razorpay not configured');
  }

  const options = {
    amount: amount * 100, // Amount in paise
    currency,
    receipt: receipt || `order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(`Failed to create Razorpay order: ${error.message}`);
  }
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return expectedSignature === signature;
};

// Payment options for client-side
export const getPaymentOptions = ({
  orderId,
  amount,
  currency = 'INR',
  name = 'SalonBook',
  description = 'Salon booking payment',
  prefill = {},
  onSuccess,
  onFailure,
  onDismiss
}) => {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency,
    name,
    description,
    order_id: orderId,
    handler: onSuccess,
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || ''
    },
    theme: {
      color: '#3B82F6'
    },
    modal: {
      ondismiss: onDismiss || (() => {})
    },
    retry: {
      enabled: true,
      max_count: 3
    }
  };
};

// Webhook verification
export const verifyWebhookSignature = (body, signature) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};

// Payment status constants
export const PAYMENT_STATUS = {
  CREATED: 'created',
  AUTHORIZED: 'authorized',
  CAPTURED: 'captured',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

// Error codes
export const RAZORPAY_ERROR_CODES = {
  PAYMENT_FAILED: 'PAYMENT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  BAD_REQUEST_ERROR: 'BAD_REQUEST_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  GATEWAY_ERROR: 'GATEWAY_ERROR'
};

export default {
  razorpay,
  loadRazorpayScript,
  createRazorpayOrder,
  verifyRazorpaySignature,
  getPaymentOptions,
  verifyWebhookSignature,
  PAYMENT_STATUS,
  RAZORPAY_ERROR_CODES
};
