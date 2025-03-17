import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './rt_cart.css';
import Navbar from '../../../components/Navbar';
import RetailSidebar from '../../../components/RetailSidebar';

// Consistent localStorage key - must match the one in Products.js
const CART_STORAGE_KEY = 'persistent_cart';

function RtCart() {
  const navigate = useNavigate();
  
  // Initialize cart with robust error handling
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart data in RtCart:", error);
      return [];
    }
  });

  // Load cart from localStorage and listen for updates
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        console.log("Cart retrieved from localStorage in RtCart.js:", savedCart);
        
        if (savedCart && savedCart !== "undefined") {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            setCart(parsedCart);
          } else {
            console.warn("Parsed cart is not an array:", parsedCart);
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    };

    // Load cart initially
    loadCartFromStorage();
    
    // Custom event listener for cart updates
    const handleCartUpdate = (event) => {
      console.log("Cart update event received in RtCart:", event.detail);
      setCart(event.detail);
    };
    
    // Listen for both storage events and custom cart update events
    window.addEventListener('storage', loadCartFromStorage);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', loadCartFromStorage);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  // Save cart changes back to localStorage
  useEffect(() => {
    if (cart && cart.length >= 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log("Cart saved to localStorage in RtCart.js:", cart);
    }
  }, [cart]);

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => 
    total + (parseFloat(item.displayPrice) * item.quantity), 0);

  // Update cart item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? {...item, quantity: newQuantity}
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Proceed to checkout
  const proceedToCheckout = () => {
    navigate('/checkout', { state: { cartItems: cart, totalPrice } });
  };

  return (
    <>
      <section className="cart-section">
        <div className="nav-section">
          <Navbar/>
        </div>
        <div className="cart-content-section">
          <div className="sidebar-section">
            <RetailSidebar/>
          </div>
          <div className="cart-contents">
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-header">
                  <span className="product-name-header">Product</span>
                  <span className="quantity-header">Quantity</span>
                  <span className="price-header">Price</span>
                  <span className="actions-header">Actions</span>
                </div>
                {cart.map(item => (
                  <div key={item.id} className="cart-item">
                    <span className="product-name">{item.name}</span>
                    <div className="quantity-control">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <span className="item-price">₹{(parseFloat(item.displayPrice) * item.quantity).toFixed(2)}</span>
                    <button className="remove-btn" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                ))}
                <div className="cart-summary">
                  <h2>Total: ₹{totalPrice.toFixed(2)}</h2>
                  <button className="checkout-btn" onClick={proceedToCheckout}>Proceed to Checkout</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default RtCart;