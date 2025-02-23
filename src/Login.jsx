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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempted with:', { email, password });
    // Simulate role-based routing
    if (email.includes('admin')) {
      navigate('/admin-dashboard');
    } else if (email.includes('supervisor')) {
      navigate('/supervisor-dashboard');
    } else {
      navigate('/dashboard');
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