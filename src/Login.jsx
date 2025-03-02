import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error feedback
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data);
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful! Redirecting...');
        const role = data.role.toLowerCase();
        setTimeout(() => {
          if (role === 'admin') {
            navigate('/admin-dashboard');
          } else if (role === 'supervisor') {
            navigate('/supervisor-dashboard');
          } else if (role === 'student') {
            navigate('/dashboard');
          } else {
            console.log('Unknown role:', role);
            navigate('/');
          }
        }, 1000); // 1-second delay for feedback visibility
      } else {
        setMessage(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email"
            required
          />
        </div>
        <div className="input-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              aria-label="Password"
              required
            />
            <span className="visibility-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
        </div>
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {message && (
          <p
            className="message-text"
            style={{ color: message.includes('successful') ? 'green' : 'red', marginTop: '10px', textAlign: 'center' }}
          >
            {message}
          </p>
        )}
        <div className="forgot-password">
          <a href="#forgot">Forgot Password?</a>
        </div>
        <div className="register-link">
          <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;