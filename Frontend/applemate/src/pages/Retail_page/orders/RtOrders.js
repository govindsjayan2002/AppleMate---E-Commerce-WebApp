import React, { useState, useEffect } from 'react';
import './rt_orders.css';
import Navbar from '../../../components/Navbar';
import RetailSidebar from '../../../components/RetailSidebar';
import axios from 'axios';

const RtOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/ordersList/', {
          headers: {
            'X-CSRFToken': getCsrfToken(),
            'Content-Type': 'application/json'
            
          }
        });
        console.log('API response:', response.data);
        // Check if data is an array before setting state
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (response.data && typeof response.data === 'object') {
          // If it's an object with a results property (common in Django REST Framework)
          if (Array.isArray(response.data.results)) {
            setOrders(response.data.results);
          } else {
            // Convert object to array if needed
            const ordersArray = Object.values(response.data);
            setOrders(ordersArray);
          }
        } else {
          // Handle unexpected data
          console.error('Unexpected data format:', response.data);
          setError('Received unexpected data format from server');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err.response?.data || err.message);
        setError('Failed to load orders. Please try again later.');
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <section className='rtOrder-container'>
        <div className='nav-sec'>
          <Navbar/>
        </div>
        <div className='order-body'>
          <div className='sidebar-sec'>
            <RetailSidebar/>
          </div>
          <div className='OrderContent'>
            <h1>Your Orders</h1>
            
            {loading ? (
              <div className="loading-spinner">Loading orders...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : orders.length === 0 ? (
              <div className="no-orders">
                <p>You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="orders-list">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Products</th>
                      <th>Total Price</th>
                      <th>Order Date</th>
                      <th>Status</th>
                      <th>Shipping Address</th>
                      <th>Payment Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="order-row">
                        <td>{order.id}</td>
                        <td>
                          {order.items.map(item => (
                            <div key={item.product_id}>
                              {item.product_name} (x{item.quantity}) - ₹{item.item_price.toFixed(2)}
                            </div>
                          ))}
                        </td>
                        <td>₹{order.total_price.toFixed(2)}</td>
                        <td>{formatDate(order.order_date)}</td>
                        <td>
                          <span className={`status-badge ${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="address-details">
                            <p>{order.shipping_name}</p>
                            <p>{order.shipping_address}</p>
                            <p>{order.shipping_phone}</p>
                          </div>
                        </td>
                        <td>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default RtOrders;