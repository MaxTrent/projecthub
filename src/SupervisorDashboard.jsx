import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SupervisorDashboard() {
  const [supervisorName, setSupervisorName] = useState('');
  const [projects, setProjects] = useState([]);
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
        // Fetch supervisor name from /currentUser
        const userResponse = await fetch('http://localhost:3000/api/auth/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const userData = await userResponse.json();
        if (userResponse.ok) {
          setSupervisorName(userData.fullName);
        } else {
          console.log('Failed to fetch user data:', userData.error);
          navigate('/');
          return;
        }

        // Fetch projects from /search without keyword for supervisor-specific list
        const projectsResponse = await fetch('http://localhost:3000/api/projects/search', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const projectsData = await projectsResponse.json();
        if (projectsResponse.ok) {
          console.log('Projects data received:', projectsData);
          setProjects(projectsData);
        } else {
          console.log('Failed to fetch projects:', projectsData.error);
          setProjects([]);
        }
      } catch (err) {
        console.error('Error fetching supervisor data:', err);
        navigate('/');
      }
    };

    fetchSupervisorData();
  }, [navigate]);

  const handleReview = (projectId) => {
    console.log(`Reviewing project with ID: ${projectId}`);
    navigate(`/supervisor-review/${projectId}`);
  };

  return (
    <div className="supervisor-dashboard">
      <header className="welcome-header">
        <h2>Welcome, {supervisorName || 'Loading...'}</h2>
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
              {projects.length > 0 ? (
                projects.map(project => (
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
                  <p><strong>Status:</strong> {project.status}</p>
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