import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log('Login response:', data); // Debug role
      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token
        // Navigate based on role from API response (case-insensitive)
        const role = data.role.toLowerCase();
        if (role === 'administrator') {
          navigate('/admin-dashboard');
        } else if (role === 'supervisor') {
          navigate('/supervisor-dashboard');
        } else {
          navigate('/dashboard'); // Default to student dashboard
        }
      } else {
        console.log('Login failed:', data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Login error:', err);
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
        <button type="submit" className="login-button">
          Login
        </button>
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