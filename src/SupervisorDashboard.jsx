import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SupervisorDashboard() {
  const [supervisorName, setSupervisorName] = useState('');
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupervisorData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        // Fetch supervisor name
        const userResponse = await fetch('http://localhost:3000/api/auth/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!userResponse.ok) {
          const text = await userResponse.text();
          throw new Error(`User fetch failed - Status: ${userResponse.status}, Response: ${text}`);
        }
        const userData = await userResponse.json();
        setSupervisorName(userData.fullName);

        // Fetch projects
        const projectsResponse = await fetch('http://localhost:3000/api/projects/supervisor/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!projectsResponse.ok) {
          const text = await projectsResponse.text();
          throw new Error(`Projects fetch failed - Status: ${projectsResponse.status}, Response: ${text}`);
        }
        const projectsData = await projectsResponse.json();
        console.log('Projects data received:', projectsData);
        setProjects(projectsData.projects);
      } catch (err) {
        console.error('Error fetching supervisor data:', err);
        setError(err.message);
        navigate('/');
      }
    };

    fetchSupervisorData();
  }, [navigate]);

  const handleReview = (projectId) => {
    console.log(`Reviewing project with ID: ${projectId}`);
    navigate(`/feedback/${projectId}`); // Changed to /feedback/:projectId
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'draft': return { color: 'gray' };
      case 'submitted': return { color: 'blue' };
      case 'under_review': return { color: 'orange' };
      case 'approved': return { color: 'green' };
      default: return {};
    }
  };

  return (
    <div className="supervisor-dashboard">
      <header className="welcome-header">
        <h2>Welcome, {supervisorName || 'Loading...'}</h2>
      </header>
      <main className="supervisor-content">
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
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
              {projects.length > 0 ? (
                projects.map(project => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.studentName}</td>
                    <td style={getStatusStyle(project.status)}>{project.status}</td>
                    <td>
                      <button
                        className="review-button"
                        onClick={() => handleReview(project.id)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No projects assigned</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="mobile-cards">
            {projects.length > 0 ? (
              projects.map(project => (
                <div key={project.id} className="mobile-card">
                  <h3>{project.title}</h3>
                  <p><strong>Student:</strong> {project.studentName}</p>
                  <p><strong>Status:</strong> <span style={getStatusStyle(project.status)}>{project.status}</span></p>
                  <button
                    className="review-button"
                    onClick={() => handleReview(project.id)}
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              <p>No projects assigned</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SupervisorDashboard;