import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedCard, setSelectedCard] = useState('visa');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, [navigate]);

  const increaseQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const decreaseQty = (id) => {
    const updated = cartItems.map(item =>
      item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const handleCheckout = () => {
    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all card details!');
      return;
    }
    localStorage.removeItem('cart');
    setOrderPlaced(true);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  if (orderPlaced) {
    return (
      <div className="order-success">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping with StyleCart!</p>
          <p className="order-id">Order ID: #SC{Math.floor(Math.random() * 90000) + 10000}</p>
          <p className="delivery-msg">
            Your order will be delivered in <strong>3-5 business days</strong>
          </p>
          <div className="success-buttons">
            <button onClick={() => navigate('/products')} className="continue-btn">
              Continue Shopping
            </button>
            <button onClick={() => navigate('/profile')} className="profile-btn">
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">

      {/* Navbar */}
      <nav className="cart-navbar">
        <div className="cart-brand" onClick={() => navigate('/')}>
          STYLECART
        </div>
        <div className="cart-nav-links">
          <span onClick={() => navigate('/')}>🏠 Home</span>
          <span onClick={() => navigate('/products')}>🛍️ Products</span>
          <span onClick={() => navigate('/profile')}>👤 Profile</span>
        </div>
        <div className="cart-nav-user" onClick={() => navigate('/profile')}>
          <div className="cart-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span>{user.name.split(' ')[0]}</span>
        </div>
      </nav>

      {/* Back Button */}
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate('/products')}>
          ← Continue Shopping
        </button>
        <h2>Shopping Cart</h2>
        <span className="cart-items-count">{cartItems.length} items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span>🛒</span>
          <h3>Your cart is empty!</h3>
          <p>Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/products')}>
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="cart-body">

          {/* Cart Items */}
          <div className="cart-left">
            <h3>My Cart</h3>
            <p className="cart-count-text">
              You have {cartItems.length} item{cartItems.length > 1 ? 's' : ''} in your cart
            </p>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details">
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-desc">{item.desc}</p>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>
                <div className="qty-controls">
                  <button
                    className="qty-btn"
                    onClick={() => decreaseQty(item.id)}
                  >
                    −
                  </button>
                  <span className="qty-num">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => increaseQty(item.id)}
                  >
                    +
                  </button>
                </div>
                <p className="cart-item-price">
                  ₹{item.price * item.qty}
                </p>
              </div>
            ))}

            {/* Price Summary */}
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Shipping {subtotal > 999 ? '🎉 Free!' : ''}</span>
                <span>₹{shipping}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-price">₹{total}</span>
              </div>
              {subtotal > 0 && subtotal < 999 && (
                <p className="free-shipping-msg">
                  🚚 Add ₹{999 - subtotal} more for FREE shipping!
                </p>
              )}
            </div>
          </div>

          {/* Payment Panel */}
          <div className="cart-right">
            <h3>Payment Details</h3>

            {/* Card Type Selection */}
            <div className="card-types-section">
              <p>Select Card Type</p>
              <div className="card-types">
                <button
                  className={`card-type ${selectedCard === 'mastercard' ? 'active' : ''}`}
                  onClick={() => setSelectedCard('mastercard')}
                >
                  <span>💳</span> MC
                </button>
                <button
                  className={`card-type ${selectedCard === 'visa' ? 'active' : ''}`}
                  onClick={() => setSelectedCard('visa')}
                >
                  <span>💳</span> VISA
                </button>
                <button
                  className={`card-type ${selectedCard === 'rupay' ? 'active' : ''}`}
                  onClick={() => setSelectedCard('rupay')}
                >
                  <span>💳</span> RuPay
                </button>
                <button
                  className={`card-type ${selectedCard === 'upi' ? 'active' : ''}`}
                  onClick={() => setSelectedCard('upi')}
                >
                  <span>📱</span> UPI
                </button>
              </div>
            </div>

            {/* Card Form */}
            <div className="payment-form">
              <div className="form-group">
                <label>Name on Card</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1111 2222 3333 4444"
                  value={cardNumber}
                  maxLength={19}
                  onChange={(e) => {
                    const val = e.target.value
                      .replace(/\D/g, '')
                      .replace(/(.{4})/g, '$1 ')
                      .trim();
                    setCardNumber(val);
                  }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    maxLength={5}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2);
                      }
                      setExpiry(val);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    maxLength={3}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="payment-summary">
              <div className="pay-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="pay-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="pay-row">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              <span>Pay ₹{total}</span>
              <span>Checkout →</span>
            </button>

            <div className="secure-badge">
              🔒 100% Secure Payment
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;