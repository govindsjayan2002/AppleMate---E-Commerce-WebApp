import React, { useState, useEffect } from "react";
import { useAuth } from "../../AuthenticationContext";
import "./products.css";
import Navbar from "../../components/Navbar";

// Consistent localStorage key
const CART_STORAGE_KEY = 'persistent_cart';

function Products() {
  const { isAuthenticated, userType } = useAuth();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [productQuantities, setProductQuantities] = useState({});
  
  // Initialize cart from localStorage with robust error handling
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart && savedCart !== "undefined" ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error parsing cart data:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart && cart.length >= 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      console.log("Cart saved to localStorage in Products.js:", cart);
      
      // Dispatch a custom event to notify other components
      const cartUpdateEvent = new CustomEvent('cartUpdated', { detail: cart });
      window.dispatchEvent(cartUpdateEvent);
    }
  }, [cart]);

  // Fetch products from the Django backend
  useEffect(() => {
    fetch("/api/products/", {
      headers: {
        'Authorization': isAuthenticated ? `Token ${localStorage.getItem('authToken')}` : '',
      }
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const productList = Array.isArray(data) ? data : (data.products || []);
      setProducts(productList);
    })
    .catch((error) => console.error("Error fetching products:", error));
  }, [isAuthenticated]);

  // Function to get the correct price based on user type
  const getDisplayPrice = (product) => {
    if (isAuthenticated && (userType === "retail_seller" || userType === "retail") && product.retail_price) {
      return product.retail_price;
    }

    if (isAuthenticated && (userType === "wholesale_dealer" || userType === "wholesale") && product.wholesale_price) {
      return product.wholesale_price;
    }

    return product.normal_price;
  };

  // Function to check if user can add to cart
  const canAddToCart = () => {
    return isAuthenticated &&
      (userType === "retail_seller" ||
      userType === "retail" ||
      userType === "wholesale_dealer" ||
      userType === "wholesale");
  };

  // Function to update product quantity
  const updateProductQuantity = (productId, change) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + change)
    }));
  };

  // Function to add product to cart with improved localStorage handling
  const addToCart = (product) => {
    const quantity = productQuantities[product.id] || 0;
    if (quantity === 0) {
      alert("Please select a quantity greater than 0");
      return;
    }

    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      let updatedCart;

      if (existingProductIndex > -1) {
        updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: quantity,
        };
      } else {
        updatedCart = [...prevCart, {
          ...product,
          quantity,
          displayPrice: getDisplayPrice(product)
        }];
      }

      return updatedCart;
    });

    setProductQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  // Filter products based on the search term
  const filteredProducts = (Array.isArray(products) ? products : []).filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <div className="headline">
          <div className="headline-left">See our products</div>
          <div className="headline-right">
            <div className="right-items">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Product List Section */}
      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            // Get current quantity for this product
            const currentQuantity = productQuantities[product.id] || 0;

            return (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/Images/placeholder.png";
                  }}
                />
                <h2 className="product-name">{product.name}</h2>
                <p className="product-category">Category: {product.category_name}</p>
                <p className="product-price">
                  Price: ₹{getDisplayPrice(product)}
                </p>

                {/* Conditional rendering for Add to Cart */}
                {canAddToCart() && (
                  <div className="product-cart-actions">
                    <div className="prdt-quantity-control">
                      <button
                        className="prdt-quantity-btn"
                        onClick={() => updateProductQuantity(product.id, -1)}
                        disabled={currentQuantity === 0}
                      >
                        -
                      </button>
                      <span className="quantity-display">{currentQuantity}</span>
                      <button
                        className="prdt-quantity-btn"
                        onClick={() => updateProductQuantity(product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={currentQuantity === 0}
                    >
                      ADD TO CART
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </>
  );
}

export default Products;