import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate

function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
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
      if (response.ok) {
        localStorage.setItem('token', result.token); // Store token
        // Navigate based on role from API response
        if (result.role === 'administrator') {
          navigate('/admin-dashboard');
        } else if (result.role === 'supervisor') {
          navigate('/supervisor-dashboard');
        } else {
          navigate('/dashboard'); // Default to student dashboard
        }
      } else {
        console.log('Registration failed:', result.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  // Watch the password field to compare with confirm password
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
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />
            <span className="visibility-toggle" onClick={togglePasswordVisibility}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" {...register('role', { required: 'Role is required' })}>
            <option value="Student">Student</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Administrator">Administrator</option>
          </select>
          {errors.role && <p className="error-message">{errors.role.message}</p>}
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
        <div className="login-link">
          <Link to="/">Already have an account? Login</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;