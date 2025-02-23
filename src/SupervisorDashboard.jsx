import React from 'react';
import { Link } from 'react-router-dom';

function SupervisorDashboard() {
  // Hardcoded data for demo purposes
  const supervisorName = 'Dr. Alice Carter';
  const projects = [
    { id: 1, title: 'Machine Learning in Healthcare', studentName: 'John Doe', status: 'Under Review' },
    { id: 2, title: 'Web Development Trends', studentName: 'Jane Smith', status: 'Submitted' },
    { id: 3, title: 'AI for Climate Modeling', studentName: 'Alex Brown', status: 'Approved' },
  ];

  const handleReview = (projectId) => {
    console.log(`Reviewing project with ID: ${projectId}`);
    // Logic to navigate to a review screen could go here
  };

  return (
    <div className="supervisor-dashboard">
      <header className="welcome-header">
        <h2>Welcome, {supervisorName}</h2>
      </header>
      <main className="supervisor-content">
        <div className="table-container">
          <table className="supervisor-table">
            <thead>
              <tr>
                <th>Project Title</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.studentName}</td>
                  <td>{project.status}</td>
                  <td>
                    <button
                      className="review-button"
                      onClick={() => handleReview(project.id)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mobile-cards">
            {projects.map(project => (
              <div key={project.id} className="mobile-card">
                <h3>{project.title}</h3>
                <p><strong>Student:</strong> {project.studentName}</p>
                <p><strong>Status:</strong> {project.status}</p>
                <button
                  className="review-button"
                  onClick={() => handleReview(project.id)}
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SupervisorDashboard;