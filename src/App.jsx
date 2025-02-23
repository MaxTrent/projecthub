import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import StudentDashboard from './StudentDashboard';
import ProjectUpload from './ProjectUpload';
import ProjectStatus from './ProjectStatus';
import SupervisorFeedback from './SupervisorFeedback';
import SearchProjects from './SearchProjects';
import ProjectDetail from './ProjectDetail';
import SupervisorDashboard from './SupervisorDashboard';
import SupervisorReview from './SupervisorReview';
import AdminDashboard from './AdminDashboard';
import ManageUsers from './ManageUsers';
import SystemSettings from './SystemSettings';

function App() {
  const handleLogout = () => {
    console.log('Logged out');
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1 className="app-name">ProjectHub</h1>
          <Routes>
            <Route path="/dashboard" element={
              <button className="logout-button" onClick={handleLogout}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Logout</Link>
              </button>
            } />
            <Route path="/supervisor-dashboard" element={
              <button className="logout-button" onClick={handleLogout}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Logout</Link>
              </button>
            } />
            <Route path="/admin-dashboard" element={
              <button className="logout-button" onClick={handleLogout}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>Logout</Link>
              </button>
            } />
            <Route path="/upload" element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/status" element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/feedback" element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/search" element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/detail" element={
              <div className="back-link">
                <Link to="/search">Back to Search</Link>
              </div>
            } />
            <Route path="/supervisor-review" element={
              <div className="back-link">
                <Link to="/supervisor-dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/manage-users" element={
              <div className="back-link">
                <Link to="/admin-dashboard">Back to Dashboard</Link>
              </div>
            } />
            <Route path="/system-settings" element={
              <div className="back-link">
                <Link to="/admin-dashboard">Back to Dashboard</Link>
              </div>
            } />
          </Routes>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/upload" element={<ProjectUpload />} />
            <Route path="/status" element={<ProjectStatus />} />
            <Route path="/feedback" element={<SupervisorFeedback />} />
            <Route path="/search" element={<SearchProjects />} />
            <Route path="/detail" element={<ProjectDetail />} />
            <Route path="/supervisor-review" element={<SupervisorReview />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/system-settings" element={<SystemSettings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;