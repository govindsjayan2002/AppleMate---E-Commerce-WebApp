import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './checkout.css';
import RetailSidebar from '../../components/RetailSidebar';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = location.state || { cartItems: [] };

  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingDetails, setShippingDetails] = useState({
    name: '',
    address: '',
    phone: ''
  });

  const totalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.displayPrice) * item.quantity), 0);

  // Get CSRF token from cookies
  const getCsrfToken = () => {
    const name = 'csrftoken=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  };

  useEffect(() => {
    // Load PayPal SDK
    if (paymentMethod === 'online') {
      const script = document.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AYSPaD0UZ2K6tn9nt5vXK21psAbWFsnVDw7_g4rT5b9pCqnwV-w4tfoq_kqCrfgYw1rW8MnPd3r6Tlhp';
      script.onload = () => console.log('PayPal SDK loaded');
      document.body.appendChild(script);
    }
  }, [paymentMethod]);

  const handlePlaceOrder = async () => {
    if (!paymentMethod || !shippingDetails.name || !shippingDetails.address || !shippingDetails.phone) {
      alert('Please fill in all details');
      return;
    }

    try {
      const orderData = {
        cart_items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_name: shippingDetails.name,
        shipping_address: shippingDetails.address,
        shipping_phone: shippingDetails.phone,
        payment_method: paymentMethod
      };

      const response = await axios.post('/api/placeOrders/', orderData, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });

      console.log('Order response:', response.data);

      if (paymentMethod === 'online') {
        // PayPal payment handling
        window.paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: totalPrice.toFixed(2) // Use total price as the amount
                }
              }]
            });
          },
          onApprove: async (data, actions) => {
            const details = await actions.order.capture();
            console.log('Payment details:', details);
            alert('Payment Successful');
            // Clear cart and navigate to orders
            localStorage.removeItem('persistent_cart');
            navigate('/orders');
          },
          onError: (err) => {
            console.error('PayPal Error:', err);
            alert('Payment failed');
          }
        }).render('#paypal-button-container');
      } else {
        alert('Order Placed Successfully');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Error placing order:', error.response?.data);
      alert(`Failed to place order: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="checkout-container">
      <Navbar />
      <div className="checkout">
        <RetailSidebar />
        <div className='checkout-content'>
          <h1>Checkout</h1>
          <div className="checkout-grid">
            <div className="order-summary">
              <h2>Order Summary</h2>
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <span>{item.name}</span>
                  <span>Qty: {item.quantity}</span>
                  <span>₹{(parseFloat(item.displayPrice) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
            </div>
            <div className="details-section">
              <div className="shipping-details">
                <h2>Shipping Details</h2>
                <input type="text" placeholder="Full Name" value={shippingDetails.name} onChange={(e) => setShippingDetails({ ...shippingDetails, name: e.target.value })} />
                <input type="text" placeholder="Address" value={shippingDetails.address} onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })} />
                <input type="tel" placeholder="Phone Number" value={shippingDetails.phone} onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })} />
              </div>
              <div className="payment-method">
                <h2>Payment Method</h2>
                <div className='options'>
                  <div>
                    <input type="radio" id="cod" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                    <label htmlFor="cod">Cash on Delivery</label>
                  </div>
                  <div>
                    <input type="radio" id="online" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                    <label htmlFor="online">Online Payment</label>
                  </div>
                </div>
              </div>
              {paymentMethod === 'online' && <div id="paypal-button-container"></div>}
              <button className="place-order" onClick={handlePlaceOrder}>Place Order</button>
            </div>
          </div>
        </div>
      </div>
      <img className="van-animation" src="\Images\delivery-vehicle-unscreen.gif" alt="Delivery Van" />
    </div>
  );
}

export default Checkout;
