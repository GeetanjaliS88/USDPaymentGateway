import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [currency, setCurrency] = useState('');
  const [showPayPal, setShowPayPal] = useState(false);

  const loadPayPalScript = (currency: string): void => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=Ab65F3ZAd4WDGuT6V9zuIt_muNfvTIPROq0UIiXEV6j_EN-D3PefiuXj-RMmmW5duWkKivzSYJeQS6kB&currency=${currency}`;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        window.paypal
          .Buttons({
            createOrder: (_data: unknown, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: '50.00', // Example amount
                    },
                  },
                ],
              });
            },
            onApprove: (_data: unknown, actions: any) => {
              return actions.order.capture().then((details: any) => {
                alert(`Transaction completed by ${details.payer.name.given_name}`);
              });
            },
            onError: (err: any) => {
              console.error('PayPal Checkout error:', err);
              alert('An error occurred during the transaction. Please try again.');
            },
          })
          .render('#paypal-button-container');
      } else {
        console.error('PayPal Buttons are not available.');
      }
    };

    script.onerror = () => {
      console.error('Failed to load PayPal script. Ensure your client ID is correct.');
      alert('Failed to load PayPal. Please check your network connection or client ID.');
    };

    document.body.appendChild(script);
  };

  const handleCurrencyClick = (currency: string) => {
    setCurrency(currency);
    setShowPayPal(true); // Show PayPal buttons
  };

  const handleGoBack = () => {
    setShowPayPal(false); // Hide PayPal buttons and show currency buttons again
  };

  useEffect(() => {
    if (showPayPal && currency) {
      loadPayPalScript(currency);
    }
  }, [showPayPal, currency]); // This effect runs when either showPayPal or currency changes

  return (
    <div>
      <h1>Payment Gateway App</h1>
      
      {/* Show currency buttons before PayPal */}
      {!showPayPal && (
        <div>
          <button onClick={() => handleCurrencyClick('USD')}>USD</button>
          <button onClick={() => handleCurrencyClick('EUR')}>EURO</button>
        </div>
      )}

      {/* Show Go Back button when PayPal buttons are displayed */}
      {showPayPal && (
        <div>
          <button onClick={handleGoBack}>Go Back</button>
          <div id="paypal-button-container"></div>
        </div>
      )}
    </div>
  );
};

// Render React app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
