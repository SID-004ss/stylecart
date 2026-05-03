import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const user = JSON.parse(localStorage.getItem('user')) || {
    name: 'Guest User',
    email: 'guest@stylecart.com'
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Load cart items
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);

    // Load orders
    const savedOrders = JSON.parse(localStorage.getItem('orders')) || [
      {
        id: '#SC10234',
        item: 'Classic Polo Shirt — Purple & White Stripes',
        date: '28 Apr 2026',
        status: 'Delivered',
        price: 299,
        image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=100&q=80'
      },
      {
        id: '#SC10198',
        item: 'Slim Fit Jeans — Classic Black Denim',
        date: '20 Apr 2026',
        status: 'In Transit',
        price: 599,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&q=80'
      },
      {
        id: '#SC10145',
        item: 'Oversized Hoodie — Olive Green',
        date: '10 Apr 2026',
        status: 'Processing',
        price: 499,
        image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=100&q=80'
      }
    ];
    setOrders(savedOrders);

    // Load wishlist
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [
      {
        id: 1,
        name: 'Linen Shirt',
        desc: 'Beige Old Money Look',
        price: 799,
        brand: 'Ralph Lauren',
        image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=100&q=80'
      },
      {
        id: 2,
        name: 'Graphic Tee',
        desc: 'Black Street Style',
        price: 249,
        brand: 'Zara',
        image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=100&q=80'
      },
      {
        id: 3,
        name: 'Zip Up Hoodie',
        desc: 'Charcoal Grey',
        price: 449,
        brand: 'Nike',
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&q=80'
      }
    ];
    setWishlist(savedWishlist);
  }, [navigate]);

  const coupons = [
    { code: 'STYLE10', desc: '10% off on orders above ₹999', expiry: '30 May 2026', color: '#ff1493' },
    { code: 'NEWUSER20', desc: '20% off on your first order', expiry: '15 Jun 2026', color: '#5c6bc0' },
    { code: 'FREESHIP', desc: 'Free shipping on any order', expiry: '31 May 2026', color: '#2ecc71' },
  ];

  const addresses = [
    {
      id: 1,
      type: 'Home',
      name: user.name,
      address: '123, Anna Nagar, Chennai, Tamil Nadu - 600040',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      type: 'College',
      name: user.name,
      address: 'SRM Institute, Kattankulathur, Chennai - 603203',
      phone: '+91 91234 56789'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  const addToCartFromWishlist = (item) => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const exists = existingCart.find(c => c.id === item.id);
    if (!exists) {
      const updated = [...existingCart, { ...item, qty: 1 }];
      localStorage.setItem('cart', JSON.stringify(updated));
      setCartItems(updated);
    }
    navigate('/cart');
  };

  const getStatusColor = (status) => {
    if (status === 'Delivered') return '#2ecc71';
    if (status === 'In Transit') return '#f39c12';
    if (status === 'Processing') return '#3498db';
    return '#999';
  };

  const getStatusIcon = (status) => {
    if (status === 'Delivered') return '✅';
    if (status === 'In Transit') return '🚚';
    if (status === 'Processing') return '⏳';
    return '📦';
  };

  return (
    <div className="profile-container">

      {/* Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className="member-badge">⭐ StyleCart Member</span>
        </div>

        <div className="sidebar-menu">
          <button
            className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <span>👤</span> My Profile
          </button>
          <button
            className={`menu-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <span>📦</span> My Orders
            {orders.length > 0 && (
              <span className="badge">{orders.length}</span>
            )}
          </button>
          <button
            className={`menu-item ${activeSection === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveSection('wishlist')}
          >
            <span>🤍</span> Wishlist
            {wishlist.length > 0 && (
              <span className="badge">{wishlist.length}</span>
            )}
          </button>
          <button
            className="menu-item"
            onClick={() => navigate('/cart')}
          >
            <span>🛒</span> My Cart
            {cartItems.length > 0 && (
              <span className="badge">{cartItems.length}</span>
            )}
          </button>
          <button
            className={`menu-item ${activeSection === 'coupons' ? 'active' : ''}`}
            onClick={() => setActiveSection('coupons')}
          >
            <span>🎟️</span> Coupons
          </button>
          <button
            className={`menu-item ${activeSection === 'address' ? 'active' : ''}`}
            onClick={() => setActiveSection('address')}
          >
            <span>📍</span> Addresses
          </button>
          <button
            className="menu-item logout-btn"
            onClick={handleLogout}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">

        {/* Navbar */}
        <div className="profile-navbar">
          <h2 className="brand" onClick={() => navigate('/')}>
            STYLECART
          </h2>
          <div className="nav-actions">
            <span onClick={() => navigate('/')}>🏠 Home</span>
            <span onClick={() => navigate('/products')}>🛍️ Products</span>
            <span onClick={() => navigate('/cart')}>
              🛒 Cart {cartItems.length > 0 && `(${cartItems.length})`}
            </span>
          </div>
        </div>

        {/* OVERVIEW SECTION */}
        {activeSection === 'overview' && (
          <div className="section">
            <div className="section-header">
              <h2>My Profile</h2>
            </div>

            <div className="stats-grid">
              <div className="stat-card" onClick={() => setActiveSection('orders')}>
                <span className="stat-icon">📦</span>
                <h3>{orders.length}</h3>
                <p>Total Orders</p>
              </div>
              <div className="stat-card" onClick={() => setActiveSection('wishlist')}>
                <span className="stat-icon">🤍</span>
                <h3>{wishlist.length}</h3>
                <p>Wishlist Items</p>
              </div>
              <div className="stat-card" onClick={() => navigate('/cart')}>
                <span className="stat-icon">🛒</span>
                <h3>{cartItems.length}</h3>
                <p>Cart Items</p>
              </div>
              <div className="stat-card" onClick={() => setActiveSection('coupons')}>
                <span className="stat-icon">🎟️</span>
                <h3>{coupons.length}</h3>
                <p>Active Coupons</p>
              </div>
            </div>

            <div className="info-card">
              <h3>Personal Information</h3>
              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">May 2026</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Status</span>
                <span className="info-value status-active">● Active</span>
              </div>
              <div className="info-row">
                <span className="info-label">Total Spent</span>
                <span className="info-value price-highlight">
                  ₹{orders.reduce((sum, o) => sum + o.price, 0)}
                </span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            {orders.length > 0 && (
              <div className="info-card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                  <h3>Recent Orders</h3>
                  <button
                    className="view-all-btn"
                    onClick={() => setActiveSection('orders')}
                  >
                    View All →
                  </button>
                </div>
                {orders.slice(0, 2).map(order => (
                  <div key={order.id} className="mini-order">
                    <img src={order.image} alt={order.item} />
                    <div className="mini-order-details">
                      <p className="mini-order-name">{order.item}</p>
                      <p className="mini-order-date">{order.date}</p>
                    </div>
                    <span
                      className="mini-status"
                      style={{ color: getStatusColor(order.status) }}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDERS SECTION */}
        {activeSection === 'orders' && (
          <div className="section">
            <div className="section-header">
              <h2>My Orders</h2>
              <p>{orders.length} orders placed</p>
            </div>
            {orders.length === 0 ? (
              <div className="empty-section">
                <span>📦</span>
                <p>No orders yet!</p>
                <button onClick={() => navigate('/products')}>
                  Start Shopping →
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-image">
                    <img src={order.image} alt={order.item} />
                  </div>
                  <div className="order-details">
                    <p className="order-id-text">{order.id}</p>
                    <p className="order-item-name">{order.item}</p>
                    <p className="order-date">Ordered on {order.date}</p>
                  </div>
                  <div className="order-right">
                    <span
                      className="order-status-badge"
                      style={{
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <p className="order-price">₹{order.price}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* WISHLIST SECTION */}
        {activeSection === 'wishlist' && (
          <div className="section">
            <div className="section-header">
              <h2>My Wishlist</h2>
              <p>{wishlist.length} items saved</p>
            </div>
            {wishlist.length === 0 ? (
              <div className="empty-section">
                <span>🤍</span>
                <p>Your wishlist is empty!</p>
                <button onClick={() => navigate('/products')}>
                  Explore Products →
                </button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map(item => (
                  <div key={item.id} className="wishlist-card">
                    <div className="wishlist-img">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="wishlist-info">
                      <p className="wishlist-brand">{item.brand}</p>
                      <h4>{item.name}</h4>
                      <p>{item.desc}</p>
                      <span className="wishlist-price">₹{item.price}</span>
                    </div>
                    <div className="wishlist-actions">
                      <button
                        className="add-to-cart-btn"
                        onClick={() => addToCartFromWishlist(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="remove-wish-btn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COUPONS SECTION */}
        {activeSection === 'coupons' && (
          <div className="section">
            <div className="section-header">
              <h2>My Coupons</h2>
              <p>{coupons.length} active coupons</p>
            </div>
            <div className="coupons-grid">
              {coupons.map((coupon, index) => (
                <div
                  key={index}
                  className="coupon-card"
                  style={{ borderLeftColor: coupon.color }}
                >
                  <div className="coupon-left">
                    <h3 style={{ color: coupon.color }}>{coupon.code}</h3>
                    <p>{coupon.desc}</p>
                    <span>Expires: {coupon.expiry}</span>
                  </div>
                  <button
                    className="copy-btn"
                    style={{ background: coupon.color }}
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.code);
                      alert(`Coupon code ${coupon.code} copied!`);
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADDRESS SECTION */}
        {activeSection === 'address' && (
          <div className="section">
            <div className="section-header">
              <h2>Delivery Addresses</h2>
              <p>{addresses.length} saved addresses</p>
            </div>
            <div className="address-grid">
              {addresses.map(addr => (
                <div key={addr.id} className="address-card">
                  <div className="address-top">
                    <span className="address-type">{addr.type}</span>
                    <span className="default-badge">Default</span>
                  </div>
                  <p className="address-name">{addr.name}</p>
                  <p className="address-text">{addr.address}</p>
                  <p className="address-phone">📞 {addr.phone}</p>
                  <div className="address-actions">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="delete-addr-btn">🗑️ Remove</button>
                  </div>
                </div>
              ))}
              <div className="address-card add-new">
                <span>➕</span>
                <p>Add New Address</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;