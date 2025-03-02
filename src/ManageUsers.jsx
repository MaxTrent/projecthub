import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null); // Tracks user ID being edited
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });
  const navigate = useNavigate();

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Fetch users failed - Status: ${response.status}, Response: ${text}`);
        }
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prev => [...prev, { id: data.userId, ...formData, password: undefined }]);
        setFormData({ fullName: '', email: '', password: '', role: '' });
        setShowAddForm(false);
      } else {
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Error adding user');
    }
  };

  // Edit user
  const handleEdit = (userId) => {
    const user = users.find(u => u.id === userId);
    setFormData({ fullName: user.fullName, email: user.email, password: '', role: user.role });
    setShowEditForm(userId);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${showEditForm}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prev => prev.map(user => 
          user.id === showEditForm ? { ...user, fullName: formData.fullName, email: formData.email, role: formData.role } : user
        ));
        setFormData({ fullName: '', email: '', password: '', role: '' });
        setShowEditForm(null);
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Error updating user');
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(prev => prev.filter(user => user.id !== userId));
      } else {
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message" style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="manage-users-page">
      <main className="manage-users-content">
        <div className="manage-users-card">
          <button className="add-user-button" onClick={() => setShowAddForm(true)}>
            Add User
          </button>
          {showAddForm && (
            <form onSubmit={handleAddUser} className="add-user-form">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
              />
              <select name="role" value={formData.role} onChange={handleInputChange} required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
            </form>
          )}
          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button className="action-button edit-button" onClick={() => handleEdit(user.id)}>
                        Edit
                      </button>
                      <button className="action-button delete-button" onClick={() => handleDelete(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showEditForm && (
              <form onSubmit={handleUpdateUser} className="edit-user-form">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  required
                />
                <select name="role" value={formData.role} onChange={handleInputChange} required>
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrator</option>
                </select>
                <button type="submit">Update</button>
                <button type="button" onClick={() => setShowEditForm(null)}>Cancel</button>
              </form>
            )}
            <div className="mobile-cards">
              {users.map(user => (
                <div key={user.id} className="mobile-card">
                  <h3>{user.fullName}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <div className="mobile-actions">
                    <button className="action-button edit-button" onClick={() => handleEdit(user.id)}>
                      Edit
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <div className="back-link">
            <Link to="/admin-dashboard">Back to Admin Dashboard</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageUsers;