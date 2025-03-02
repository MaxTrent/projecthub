import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SystemSettings() {
  const [maxFileSize, setMaxFileSize] = useState('');
  const [defaultRole, setDefaultRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/admin/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Fetch settings failed - Status: ${response.status}, Response: ${text}`);
        }
        const data = await response.json();
        setMaxFileSize(data.maxFileSize.toString()); // Ensure string for input
        setDefaultRole(data.defaultRole); // Already lowercase from backend
        setLoading(false);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/');
      return;
    }

    const settings = {
      maxFileSize: parseInt(maxFileSize, 10),
      defaultRole: defaultRole.toLowerCase(), // Match backend expectation
    };

    if (isNaN(settings.maxFileSize) || settings.maxFileSize <= 0) {
      setMessage('Please enter a valid positive integer for max file size.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Settings saved:', settings);
        setMessage('Settings saved successfully!');
      } else {
        console.log('Save failed:', data.error);
        setMessage(`Failed to save settings: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage('Error saving settings.');
    }
  };

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div className="error-message" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="settings-page">
      <main className="settings-content">
        <div className="settings-card">
          <h3>System Settings</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="maxFileSize">Max File Size (MB)</label>
              <input
                type="number"
                id="maxFileSize"
                value={maxFileSize}
                onChange={(e) => setMaxFileSize(e.target.value)}
                min="1"
                placeholder="Enter max file size in MB"
                aria-label="Maximum File Size in MB"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="defaultRole">Default Role</label>
              <select
                id="defaultRole"
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                aria-label="Default User Role"
                required
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="save-settings-button">
              Save Settings
            </button>
            {message && (
              <p style={{ color: message.includes('successfully') ? 'green' : 'red', marginTop: '10px' }}>
                {message}
              </p>
            )}
          </form>
          <div className="back-link">
            <Link to="/admin-dashboard">Back to Admin Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SystemSettings;