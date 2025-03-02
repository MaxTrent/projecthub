import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';

function AdminDashboard() {
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`User fetch failed - Status: ${response.status}, Response: ${text}`);
        }
        const data = await response.json();
        setAdminName(data.fullName);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        navigate('/');
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      <header className="welcome-header">
        <h2>Welcome, {adminName || 'Loading...'}</h2>
      </header>
      <main className="admin-content">
        <Link to="/manage-users" className="card-link">
          <div className="card">
            <PersonIcon className="card-icon" />
            <h3>Manage Users</h3>
            <p>View and edit user accounts</p>
          </div>
        </Link>
        <Link to="/system-settings" className="card-link">
          <div className="card">
            <SettingsIcon className="card-icon" />
            <h3>System Settings</h3>
            <p>Configure system preferences</p>
          </div>
        </Link>
        <Link to="/assign-supervisor" className="card-link">
          <div className="card">
            <AssignmentIcon className="card-icon" />
            <h3>Assign Supervisor</h3>
            <p>Assign supervisors to students</p>
          </div>
        </Link>
      </main>
    </div>
  );
}

export default AdminDashboard;