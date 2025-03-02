import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';

function StudentDashboard() {
  const [studentName, setStudentName] = useState('');
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }
      console.log('Fetching with token:', token);
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
      console.log('Token role:', decodedToken.role);

      // Role check
      if (decodedToken.role !== 'student') {
        console.log('User is not a student, redirecting based on role');
        if (decodedToken.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (decodedToken.role === 'supervisor') {
          navigate('/supervisor-dashboard');
        } else {
          navigate('/');
        }
        return;
      }

      try {
        const userResponse = await fetch('http://localhost:3000/api/auth/currentUser', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!userResponse.ok) {
          const text = await userResponse.text();
          console.log('User fetch failed - Status:', userResponse.status, 'Response:', text);
          navigate('/');
          return;
        }
        const userData = await userResponse.json();
        console.log('User data:', userData);
        setStudentName(userData.fullName);

        const projectResponse = await fetch('http://localhost:3000/api/projects/student/project', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!projectResponse.ok) {
          const text = await projectResponse.text();
          console.log('Project fetch failed - Status:', projectResponse.status, 'Response:', text);
          navigate('/');
          return;
        }
        const projectData = await projectResponse.json();
        console.log('Project data received:', projectData);
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching student data:', err);
        navigate('/');
      }
    };

    fetchStudentData();
  }, [navigate]);

  const handleReview = () => {
    if (project) {
      navigate(`/feedback/${project.projectId}`);
    }
  };

  return (
    <div className="dashboard">
      <header className="welcome-header">
        <h2>Welcome, {studentName || 'Loading...'}</h2>
      </header>
      <main className="dashboard-content">
        <Link to="/upload" className="card-link">
          <div className="card">
            <CloudUploadIcon className="card-icon" />
            <h3>{project ? 'Manage Project' : 'Upload Project'}</h3>
            <p>{project ? 'Update your project submission' : 'Submit your final year project'}</p>
          </div>
        </Link>
        <div className="card-link" onClick={() => project && navigate(`/status/${project.projectId}`)}>
          <div className="card">
            <TrackChangesIcon className="card-icon" />
            <h3>Track Project Status</h3>
            <p>Monitor your project’s progress</p>
          </div>
        </div>
        <Link to="/search" className="card-link">
          <div className="card">
            <SearchIcon className="card-icon" />
            <h3>Search Past Projects</h3>
            <p>Explore previous submissions</p>
          </div>
        </Link>
        <div className="card-link" onClick={handleReview}>
          <div className="card">
            <TrackChangesIcon className="card-icon" />
            <h3>View Feedback</h3>
            <p>See supervisor comments</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;