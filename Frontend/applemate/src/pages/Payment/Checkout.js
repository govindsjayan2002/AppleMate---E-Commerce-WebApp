import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import axios from 'axios';
import './checkout.css';

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

  // Function to get CSRF token from cookies
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
  
      // Clear the cart in localStorage after successful order placement
      localStorage.removeItem('persistent_cart');
  
      // Dispatch a custom event to notify other components that cart has been cleared
      const cartUpdateEvent = new CustomEvent('cartUpdated', { detail: [] });
      window.dispatchEvent(cartUpdateEvent);
  
      alert('Order Placed Successfully');
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error.response?.data);
      alert(`Failed to place order: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };

  console.log('cart items:', cartItems);
  
  return (
    <div className="checkout-container">
      <Navbar/>
      <div className="checkout-content">
        <h1>Checkout</h1>
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.map(item => (
            <div key={item.id} className="order-item">
              <span>{item.name}</span>
              <span>Quantity: {item.quantity}</span>
              <span>₹{(parseFloat(item.displayPrice) * item.quantity)}</span>
            </div>
          ))}
          <h3>Total: ₹{totalPrice.toFixed(2)}</h3>
        </div>
        <div className="shipping-details">
          <h2>Shipping Details</h2>
          <input type="text" placeholder="Full Name" value={shippingDetails.name} onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})} />
          <input type="text" placeholder="Address" value={shippingDetails.address} onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})} />
          <input type="tel" placeholder="Phone Number" value={shippingDetails.phone} onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value})} />
        </div>
        <div className="payment-method">
          <h2>Payment Method</h2>
          <div>
            <input type="radio" id="cod" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
            <label htmlFor="cod">Cash on Delivery</label>
          </div>
          <div>
            <input type="radio" id="online" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
            <label htmlFor="online">Online Payment</label>
          </div>
        </div>
        <button className='place-order' onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
}

export default Checkout;