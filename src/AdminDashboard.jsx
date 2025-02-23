import React from 'react';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';

function AdminDashboard() {
  const adminName = 'Admin User';

  return (
    <div className="admin-dashboard">
      <header className="welcome-header">
        <h2>Welcome, {adminName}</h2>
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
      </main>
    </div>
  );
}

export default AdminDashboard;