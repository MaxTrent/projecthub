import React from 'react';
import { Link } from 'react-router-dom';

function ManageUsers() {
  // Hardcoded data for demo purposes
  const users = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Student' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Supervisor' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'Administrator' },
  ];

  const handleEdit = (userId) => {
    console.log(`Editing user with ID: ${userId}`);
    // Logic to edit user could go here (e.g., open a modal or navigate)
  };

  const handleDelete = (userId) => {
    console.log(`Deleting user with ID: ${userId}`);
    // Logic to delete user could go here (e.g., confirm and API call)
  };

  const handleAddUser = () => {
    console.log('Add user initiated');
    // Logic to add user could go here (e.g., open a form modal)
  };

  return (
    <div className="manage-users-page">
      <main className="manage-users-content">
        <div className="manage-users-card">
          <button className="add-user-button" onClick={handleAddUser}>
            Add User
          </button>
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
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(user.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mobile-cards">
              {users.map(user => (
                <div key={user.id} className="mobile-card">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <div className="mobile-actions">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(user.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ManageUsers;