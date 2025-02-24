import React from 'react';
import { Link } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SearchIcon from '@mui/icons-material/Search';

function StudentDashboard() {
  const studentName = 'John Doe';

  return (
    <div className="dashboard">
      <header className="welcome-header">
        <h2>Welcome, {studentName}</h2>
      </header>
      <main className="dashboard-content">
        <Link to="/upload" className="card-link">
          <div className="card">
            <CloudUploadIcon className="card-icon" />
            <h3>Upload Project</h3>
            <p>Submit your final year project</p>
          </div>
        </Link>
        <Link to="/status" className="card-link">
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