import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    if (token) {
      setIsLoggedIn(true);
      setUser(userData);
    }
  }, []);

  const handleShopNow = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products');
    } else {
      navigate('/login');
    }
  };

  const handleProducts = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/products');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="home-container">

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <h1>STYLECART</h1>
        </div>
        <div className="nav-links">
          <span onClick={() => navigate('/')}>HOME</span>
          <span onClick={handleProducts}>PRODUCTS</span>
          {isLoggedIn ? (
            <>
              <span onClick={() => navigate('/profile')}>MY PROFILE</span>
              <span onClick={handleLogout} className="logout-link">LOGOUT</span>
            </>
          ) : (
            <span onClick={() => navigate('/login')}>LOGIN</span>
          )}
        </div>
        {isLoggedIn && user && (
          <div className="nav-user" onClick={() => navigate('/profile')}>
            <div className="nav-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span>Hi, {user.name.split(' ')[0]}!</span>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-left">
          <p className="hero-tag">NEW COLLECTION 2026</p>
          <h1 className="hero-title">
            <span className="big-style">Style</span>
            <br />at your
          </h1>
          <h1 className="hero-subtitle">Fingertips.</h1>
          <p className="hero-desc">
            Shop the trends you love, anytime, anywhere.
            Discover fashion that speaks to you.
          </p>
          <div className="hero-buttons">
            <button className="shop-btn" onClick={handleShopNow}>
              Shop Now →
            </button>
            <button className="explore-btn" onClick={handleProducts}>
              Explore Collections
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>Products</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>50+</h3>
              <p>Brands</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <h3>10K+</h3>
              <p>Customers</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="model-card card1">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&q=80"
              alt="Fashion 1"
            />
          </div>
          <div className="model-card card2">
            <img
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=300&q=80"
              alt="Fashion 2"
            />
          </div>
          <div className="model-card card3">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80"
              alt="Fashion 3"
            />
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          <div className="category-card" onClick={handleProducts}>
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80"
              alt="T-Shirts"
            />
            <div className="category-overlay">
              <h3>T-Shirts</h3>
              <p>Shop Now →</p>
            </div>
          </div>
          <div className="category-card" onClick={handleProducts}>
            <img
              src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"
              alt="Shirts"
            />
            <div className="category-overlay">
              <h3>Shirts</h3>
              <p>Shop Now →</p>
            </div>
          </div>
          <div className="category-card" onClick={handleProducts}>
            <img
              src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80"
              alt="Jeans"
            />
            <div className="category-overlay">
              <h3>Jeans</h3>
              <p>Shop Now →</p>
            </div>
          </div>
          <div className="category-card" onClick={handleProducts}>
            <img
              src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80"
              alt="Hoodies"
            />
            <div className="category-overlay">
              <h3>Hoodies</h3>
              <p>Shop Now →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-card">
          <span>🚚</span>
          <h4>Free Shipping</h4>
          <p>On orders above ₹999</p>
        </div>
        <div className="feature-card">
          <span>🔄</span>
          <h4>Easy Returns</h4>
          <p>30 day return policy</p>
        </div>
        <div className="feature-card">
          <span>🔒</span>
          <h4>Secure Payment</h4>
          <p>100% secure transactions</p>
        </div>
        <div className="feature-card">
          <span>💎</span>
          <h4>Premium Quality</h4>
          <p>Handpicked collections</p>
        </div>
      </div>

      {/* Footer */}
      <div className="home-footer">
        <h2>STYLECART</h2>
        <p>Style at your Fingertips — Shop the trends you love, anytime, anywhere.</p>
        <p className="footer-copy">© 2026 StyleCart. All rights reserved.</p>
      </div>

    </div>
  );
}

export default Home;