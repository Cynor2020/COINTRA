// Mock Razorpay service - in a real implementation, this would integrate with the actual Razorpay API
const RAZORPAY_KEY = 'Rh40BnyC7V7nB';

export const createRazorpayOrder = async (amount, planName) => {
  // In a real implementation, this would call the Razorpay API to create an order
  // For now, we'll return mock data
  return {
    id: `order_${Date.now()}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: 'USD',
    receipt: `receipt_${Date.now()}`,
    planName: planName,
  };
};

export const openRazorpayCheckout = (orderDetails, planName, onSuccess, onError) => {
  // Load Razorpay SDK if not already loaded
  if (!window.Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      initializePayment();
    };
    script.onerror = () => {
      onError('Failed to load payment gateway');
    };
    document.head.appendChild(script);
  } else {
    initializePayment();
  }

  function initializePayment() {
    const options = {
      key: RAZORPAY_KEY,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'COINTRA',
      description: `${planName} Subscription`,
      order_id: orderDetails.id,
      handler: function (response) {
        // Save subscription to localStorage
        const subscription = {
          plan: planName,
          amount: orderDetails.amount,
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          date: new Date().toISOString(),
        };
        
        localStorage.setItem('cointra_subscription', JSON.stringify(subscription));
        onSuccess(response, planName);
      },
      prefill: {
        name: 'Sarthak Anant Gadakh',
        email: 'sarthak@example.com',
      },
      theme: {
        color: '#f7931a',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      onError(response.error.description || 'Payment failed');
    });
    
    rzp.open();
  }
};

export const getUserSubscription = () => {
  try {
    const subscription = localStorage.getItem('cointra_subscription');
    return subscription ? JSON.parse(subscription) : null;
  } catch (error) {
    return null;
  }
};

export const isPremiumUser = () => {
  const subscription = getUserSubscription();
  return !!subscription;
};