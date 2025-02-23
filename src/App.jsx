import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import StudentDashboard from './StudentDashboard';
import ProjectUpload from './ProjectUpload';

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
            <Route path="/upload" element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            } />
          </Routes>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/upload" element={<ProjectUpload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;