import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SystemSettings() {
  const [maxFileSize, setMaxFileSize] = useState('50');
  const [defaultRole, setDefaultRole] = useState('Student');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Settings saved:', { maxFileSize, defaultRole });
    // Logic to save settings to backend could go here
  };

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
                <option value="Student">Student</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
            <button type="submit" className="save-settings-button">
              Save Settings
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SystemSettings;