import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';

function StudentDashboard() {
  const [studentName, setStudentName] = useState('');
  const [projectId, setProjectId] = useState(null); // Store projectId
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchStudentName = async () => {
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
        const data = await response.json();
        if (response.ok) {
          setStudentName(data.fullName);
        } else {
          console.log('Failed to fetch user data:', data.error || 'Unknown error');
          navigate('/');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        navigate('/');
      }
    };

    fetchStudentName();

    // Check if projectId came from navigation state
    if (location.state?.projectId) {
      setProjectId(location.state.projectId);
      console.log('Project ID from upload:', location.state.projectId);
    }
  }, [navigate, location]);

  return (
    <div className="dashboard">
      <header className="welcome-header">
        <h2>Welcome, {studentName || 'Loading...'}</h2>
      </header>
      <main className="dashboard-content">
        <Link to="/upload" className="card-link">
          <div className="card">
            <CloudUploadIcon className="card-icon" />
            <h3>Upload Project</h3>
            <p>Submit your final year project</p>
          </div>
        </Link>
        <Link to={projectId ? `/status/${projectId}` : '/dashboard'} className="card-link">
          <div className="card">
            <TrackChangesIcon className="card-icon" />
            <h3>Track Project Status</h3>
            <p>Monitor your project’s progress</p>
          </div>
        </Link>
        <Link to="/search" className="card-link">
          <div className="card">
            <SearchIcon className="card-icon" />
            <h3>Search Past Projects</h3>
            <p>Explore previous submissions</p>
          </div>
        </Link>
        <Link to="/feedback" className="card-link">
          <div className="card">
            <TrackChangesIcon className="card-icon" />
            <h3>View Feedback</h3>
            <p>See supervisor comments</p>
          </div>
        </Link>
      </main>
    </div>
  );
}

export default StudentDashboard;