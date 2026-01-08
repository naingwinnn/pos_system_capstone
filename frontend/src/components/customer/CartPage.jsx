import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { shops } from '../../data/shopsData';
import './CartPage.css';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, clearShopCart, getCartStats } = useCart();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('cart');

  const cartStats = getCartStats();
  const shopIds = Object.keys(cart);
  
  // Calculate totals for each shop
  const calculateShopTotal = (shopId) => {
    const shopCart = cart[shopId];
    if (!shopCart) return 0;
    
    let total = 0;
    Object.entries(shopCart.items).forEach(([productId, quantity]) => {
      const shop = shops.find(s => s.id === parseInt(shopId));
      if (shop) {
        const product = shop.products.find(p => p.id === parseInt(productId));
        if (product) {
          total += product.price * quantity;
        }
      }
    });
    return total;
  };

  // Calculate total across all shops
  const calculateGrandTotal = () => {
    let grandTotal = 0;
    shopIds.forEach(shopId => {
      grandTotal += calculateShopTotal(shopId);
    });
    return grandTotal;
  };

  // Calculate delivery fees
  const calculateDeliveryFees = () => {
    const deliveryFeePerShop = 2.99;
    return shopIds.length * deliveryFeePerShop;
  };

  // Get product info
  const getProductInfo = (shopId, productId) => {
    const shop = shops.find(s => s.id === parseInt(shopId));
    if (!shop) return null;
    
    const product = shop.products.find(p => p.id === parseInt(productId));
    return product;
  };

  // Get shop info
  const getShopInfo = (shopId) => {
    return shops.find(s => s.id === parseInt(shopId));
  };

  const handleCheckout = () => {
    if (cartStats.isEmpty) {
      alert('Your cart is empty!');
      return;
    }
    setCheckoutStep('checkout');
  };

  const handlePlaceOrder = () => {
    alert(`Order placed successfully! Total: $${(calculateGrandTotal() + calculateDeliveryFees() + 1.49).toFixed(2)}`);
    clearCart();
    navigate('/profile');
  };

  if (cartStats.isEmpty) {
    return (
      <div className="empty-cart-page">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious items from our shops to get started!</p>
          <button onClick={() => navigate('/')} className="start-shopping-btn">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← Continue Shopping
        </button>
        <h1>Your Shopping Cart</h1>
        <div className="cart-summary-badge">
          {cartStats.totalItems} items from {cartStats.shopCount} {cartStats.shopCount === 1 ? 'shop' : 'shops'}
        </div>
      </div>

      <div className="cart-content">
        {/* Left Column - Cart Items */}
        <div className="cart-items-section">
          <div className="section-header">
            <h2>Items in Cart</h2>
            <button onClick={clearCart} className="clear-all-btn">
              Clear All
            </button>
          </div>

          {shopIds.map(shopId => {
            const shopInfo = getShopInfo(shopId);
            const shopCart = cart[shopId];
            const shopTotal = calculateShopTotal(shopId);

            if (!shopInfo || !shopCart) return null;

            return (
              <div key={shopId} className="shop-cart-section">
                <div className="shop-cart-header">
                  <div className="shop-info">
                    <img src={shopInfo.image} alt={shopInfo.name} className="shop-cart-image" />
                    <div>
                      <h3>{shopInfo.name}</h3>
                      <p className="shop-delivery">Delivery: {shopInfo.deliveryTime}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => clearShopCart(shopId)} 
                    className="remove-shop-btn"
                  >
                    Remove Shop
                  </button>
                </div>

                <div className="shop-items-list">
                  {Object.entries(shopCart.items).map(([productId, quantity]) => {
                    const product = getProductInfo(shopId, productId);
                    if (!product) return null;

                    return (
                      <div key={productId} className="cart-item">
                        <div className="item-info">
                          <h4>{product.name}</h4>
                          <p className="item-category">{product.category}</p>
                          <p className="item-price">${product.price} each</p>
                        </div>
                        
                        <div className="item-controls">
                          <div className="quantity-control">
                            <button
                              onClick={() => updateQuantity(shopId, parseInt(productId), quantity - 1)}
                              className="quantity-btn minus"
                            >
                              –
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                              onClick={() => updateQuantity(shopId, parseInt(productId), quantity + 1)}
                              className="quantity-btn plus"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="item-total">
                            ${(product.price * quantity).toFixed(2)}
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(shopId, parseInt(productId))}
                            className="remove-item-btn"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="shop-total">
                  <div className="shop-subtotal">
                    <span>Shop Subtotal:</span>
                    <span>${shopTotal.toFixed(2)}</span>
                  </div>
                  <div className="shop-delivery-fee">
                    <span>Delivery Fee:</span>
                    <span>$2.99</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column - Order Summary */}
        <div className="order-summary-section">
          <div className="summary-card">
            <h2>Order Summary</h2>
            
            <div className="summary-details">
              <div className="summary-row">
                <span>Items ({cartStats.totalItems})</span>
                <span>${calculateGrandTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery ({shopIds.length} shops)</span>
                <span>${calculateDeliveryFees().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Service Fee</span>
                <span>$1.49</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${(calculateGrandTotal() + calculateDeliveryFees() + 1.49).toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-notes">
              <div className="note">
                <span className="note-icon">⏰</span>
                <span>Delivery estimate varies per shop</span>
              </div>
              <div className="note">
                <span className="note-icon">💳</span>
                <span>Secure payment with multiple options</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>

            <Link to="/profile" className="view-profile-link">
              View Profile & Order History →
            </Link>
          </div>

          {/* Suggested Items */}
          <div className="suggested-items">
            <h3>You might also like</h3>
            <div className="suggested-grid">
              {shops.slice(0, 2).map(shop => (
                <div 
                  key={shop.id} 
                  className="suggested-shop"
                  onClick={() => navigate(`/shop/${shop.id}`)}
                >
                  <img src={shop.image} alt={shop.name} />
                  <div className="suggested-info">
                    <h4>{shop.name}</h4>
                    <p>⭐ {shop.rating} • ⏱️ {shop.deliveryTime}</p>
                    <button className="quick-view-btn">
                      View Shop
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutStep === 'checkout' && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal">
            <div className="modal-header">
              <h2>Complete Your Order</h2>
              <button onClick={() => setCheckoutStep('cart')} className="close-modal">
                ✕
              </button>
            </div>
            
            <div className="modal-content">
              <div className="order-review">
                <h3>Order Review</h3>
                {shopIds.map(shopId => {
                  const shopInfo = getShopInfo(shopId);
                  const shopTotal = calculateShopTotal(shopId);
                  
                  return (
                    <div key={shopId} className="review-shop">
                      <h4>{shopInfo?.name}</h4>
                      <div className="review-items">
                        {Object.entries(cart[shopId]?.items || {}).map(([productId, quantity]) => {
                          const product = getProductInfo(shopId, productId);
                          return (
                            <div key={productId} className="review-item">
                              <span>{product?.name} × {quantity}</span>
                              <span>${(product?.price * quantity).toFixed(2)}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="review-shop-total">
                        <span>Shop Total:</span>
                        <span>${(shopTotal + 2.99).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="review-grand-total">
                  <span>Grand Total:</span>
                  <span>${(calculateGrandTotal() + calculateDeliveryFees() + 1.49).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="payment-section">
                <h3>Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <span className="payment-label">💳 Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span className="payment-label">📱 Mobile Wallet</span>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <span className="payment-label">💵 Cash on Delivery</span>
                  </label>
                </div>
                
                <button onClick={handlePlaceOrder} className="place-order-btn">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;