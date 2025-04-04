import React, { useEffect, useRef } from 'react';

const PaymentComponent = () => {
    const paypalRef = useRef(null);

    useEffect(() => {
        // Clean up the existing buttons to avoid duplicates
        if (paypalRef.current) {
            paypalRef.current.innerHTML = '';
        }

        // Load the PayPal script dynamically
        const script = document.createElement('script');
        script.src = 'https://www.paypalobjects.com/api/checkout.js';
        script.onload = () => {
            window.paypal.Button.render(
                {
                    env: 'sandbox', // Use 'production' for live
                    client: {
                        sandbox: 'AYSPaD0UZ2K6tn9nt5vXK21psAbWFsnVDw7_g4rT5b9pCqnwV-w4tfoq_kqCrfgYw1rW8MnPd3r6Tlhp',
                        production: 'YOUR_PRODUCTION_CLIENT_ID'
                    },
                    style: {
                        color: 'gold',
                        shape: 'rect',
                        label: 'paypal'
                    },
                    payment: function (data, actions) {
                        return actions.payment.create({
                            transactions: [{
                                amount: { total: '10.00', currency: 'USD' }
                            }]
                        });
                    },
                    onAuthorize: function (data, actions) {
                        return actions.payment.execute().then(function () {
                            alert('Payment Successful!');
                        });
                    },
                    onCancel: function (data) {
                        alert('Payment Cancelled');
                    },
                    onError: function (err) {
                        console.error('Payment Error:', err);
                        alert('Payment Error');
                    }
                },
                paypalRef.current
            );
        };
        document.body.appendChild(script);
    }, []);

    const handlePlaceOrder = () => {
        alert('Order Placed');
    };

    return (
        <div className="payment-container">
            <h2>Payment Method</h2>
            <div>
                <label>
                    <input type="radio" name="payment" value="cod" /> Cash on Delivery
                </label>
                <label style={{ marginLeft: '20px' }}>
                    <input type="radio" name="payment" value="online" defaultChecked /> Online Payment
                </label>
            </div>

            {/* PayPal Button Container */}
            <div ref={paypalRef} style={{ margin: '20px 0' }}></div>

            <button onClick={handlePlaceOrder} className="place-order-btn">Place Order</button>
        </div>
    );
};

export default PaymentComponent;
