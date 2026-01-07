import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { shops } from "../../data/shopsData";
import "./ShopPage.css"; 
const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  const shop = shops.find(s => s.id === parseInt(id));

  useEffect(() => {
    if (shop) {
      document.title = `${shop.name} | POS Marketplace`;
    }
  }, [shop]);

  if (!shop) {
    return (
      <div className="shop-not-found">
        <div className="not-found-content">
          <h2>🚫 Shop Not Found</h2>
          <p>The shop you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/")} 
            className="back-home-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setQuantities({
        ...quantities,
        [product.id]: (quantities[product.id] || 1) + 1
      });
    } else {
      setCart([...cart, product]);
      setQuantities({
        ...quantities,
        [product.id]: 1
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    const newQuantities = { ...quantities };
    delete newQuantities[productId];
    setQuantities(newQuantities);
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }
    setQuantities({
      ...quantities,
      [productId]: newQty
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.price * (quantities[item.id] || 1));
    }, 0).toFixed(2);
  };

  const getCartCount = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  };

  const productCategories = [...new Set(shop.products.map(p => p.category))];
  const filteredProducts = activeTab === "all" 
    ? shop.products 
    : shop.products.filter(p => p.category === activeTab);

  const clearCart = () => {
    setCart([]);
    setQuantities({});
  };

  return (
    <div className="shop-page">
      {/* Header */}
      <header className="shop-header">
        <button 
          onClick={() => navigate("/")} 
          className="back-to-dashboard"
        >
          ← Back to Shops
        </button>
        
        <div className="shop-header-content">
          <div className="shop-header-image">
            <img src={shop.image} alt={shop.name} />
            <div className="shop-rating-badge">
              ⭐ {shop.rating} • {shop.deliveryTime}
            </div>
          </div>
          
          <div className="shop-header-info">
            <h1>{shop.name}</h1>
            <p className="shop-description">{shop.description}</p>
            <div className="shop-meta">
              <span className="meta-item">
                <span className="meta-icon">🏷️</span>
                <span className="meta-text">{shop.category}</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">{shop.deliveryTime}</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">⭐</span>
                <span className="meta-text">{shop.rating} Rating</span>
              </span>
              <span className="meta-item">
                <span className="meta-icon">📦</span>
                <span className="meta-text">{shop.products.length} Items</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="shop-main-content">
        {/* Products Section */}
        <div className="products-section">
          <div className="products-header">
            <h2>Our Products</h2>
            <div className="category-tabs">
              <button
                className={`category-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All ({shop.products.length})
              </button>
              {productCategories.map(category => (
                <button
                  key={category}
                  className={`category-tab ${activeTab === category ? "active" : ""}`}
                  onClick={() => setActiveTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <div className="product-price-row">
                    <span className="product-price">${product.price}</span>
                    {quantities[product.id] && (
                      <span className="in-cart-badge">
                        {quantities[product.id]} in cart
                      </span>
                    )}
                  </div>
                </div>
                <div className="product-actions">
                  <button
                    onClick={() => addToCart(product)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                  {quantities[product.id] && (
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(product.id, quantities[product.id] - 1)}
                        className="quantity-btn minus"
                      >
                        –
                      </button>
                      <span className="quantity-display">{quantities[product.id]}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantities[product.id] + 1)}
                        className="quantity-btn plus"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <div className="cart-stats">
              <span className="cart-count">{getCartCount()} items</span>
              {cart.length > 0 && (
                <button onClick={clearCart} className="clear-cart-btn">
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="cart-content">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p className="cart-item-category">{item.category}</p>
                        <p className="cart-item-price">${item.price} each</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="cart-quantity">
                          <button
                            onClick={() => updateQuantity(item.id, quantities[item.id] - 1)}
                            className="cart-quantity-btn"
                          >
                            –
                          </button>
                          <span className="cart-quantity-display">
                            {quantities[item.id]}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, quantities[item.id] + 1)}
                            className="cart-quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <div className="cart-item-total">
                          ${(item.price * quantities[item.id]).toFixed(2)}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="remove-item-btn"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${getCartTotal()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span>$2.99</span>
                  </div>
                  <div className="summary-row">
                    <span>Service Fee</span>
                    <span>$1.49</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${(parseFloat(getCartTotal()) + 2.99 + 1.49).toFixed(2)}</span>
                  </div>

                  <div className="cart-actions">
                    <button className="checkout-btn">
                      🛒 Proceed to Checkout (${(parseFloat(getCartTotal()) + 2.99 + 1.49).toFixed(2)})
                    </button>
                    <p className="delivery-estimate">
                      Estimated delivery: {shop.deliveryTime}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Related Shops */}
      <div className="related-shops">
        <h2>More shops you might like</h2>
        <div className="related-shops-grid">
          {shops
            .filter(s => s.id !== shop.id && s.category === shop.category)
            .slice(0, 3)
            .map(relatedShop => (
              <div 
                key={relatedShop.id} 
                className="related-shop-card"
                onClick={() => navigate(`/shop/${relatedShop.id}`)}
              >
                <img src={relatedShop.image} alt={relatedShop.name} />
                <h4>{relatedShop.name}</h4>
                <p>⭐ {relatedShop.rating} • ⏱️ {relatedShop.deliveryTime}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;