import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo">
          <h1>STYLECART</h1>
        </div>
        <div className="login-form">

          {isLogin ? (
            <>
              <h2>Enter Your Email</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h2>Password</h2>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="forgot">Forgot password?</p>
              {error && <p className="error-msg">{error}</p>}
              <button
                className="login-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              <div className="divider"><span>OR</span></div>
              <button
                className="signup-btn"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              <h2>Full Name</h2>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <h2>Email</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h2>Password</h2>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="error-msg">{error}</p>}
              <button
                className="login-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
              <div className="divider"><span>OR</span></div>
              <button
                className="signup-btn"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </>
          )}

        </div>
      </div>
      <div className="login-right">
        <div className="bubble b1"></div>
        <div className="bubble b2"></div>
        <div className="bubble b3"></div>
        <div className="bubble b4"></div>
        <div className="shopping-girl">🛍️</div>
      </div>
    </div>
  );
}

export default Login;