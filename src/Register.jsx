import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error feedback
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    setMessage(''); // Clear previous messages
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });
      const result = await response.json();
      console.log('Register response:', result);
      if (response.ok) {
        localStorage.setItem('token', result.token);
        setMessage('Registration successful! Redirecting...');
        const role = result.role.toLowerCase();
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
        setMessage(result.error || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const password = watch('password', '');

  return (
    <div className="register-card">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            {...register('fullName', { required: 'Full Name is required' })}
          />
          {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="input-group password-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
            />
            <span className="visibility-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <div className="input-group password-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
            />
            <span className="visibility-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" {...register('role', { required: 'Role is required' })}>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="supervisor">Supervisor</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role && <p className="error-message">{errors.role.message}</p>}
        </div>
        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {message && (
          <p
            className="message-text"
            style={{ color: message.includes('successful') ? 'green' : 'red', marginTop: '10px', textAlign: 'center' }}
          >
            {message}
          </p>
        )}
        <div className="login-link">
          <Link to="/">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;