import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Login";
import Register from "./Register";
import StudentDashboard from "./StudentDashboard";
import ProjectUpload from "./ProjectUpload";
import ProjectStatus from "./ProjectStatus";
import SupervisorFeedback from "./SupervisorFeedback";
import SearchProjects from "./SearchProjects";
import ProjectDetail from "./ProjectDetail";
import SupervisorDashboard from "./SupervisorDashboard";
import SupervisorReview from "./SupervisorReview";
import AdminDashboard from "./AdminDashboard";
import ManageUsers from "./ManageUsers";
import SystemSettings from "./SystemSettings";
import AssignSupervisor from './AssignSupervisor';

// Inner component to use Router hooks
function AppContent() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="app-name">ProjectHub</h1>
        {["/dashboard", "/supervisor-dashboard", "/admin-dashboard"].includes(
          window.location.pathname
        ) && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
        <Routes>
          <Route
            path="/upload"
            element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/status/:projectId"
            element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/feedback"
            element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/search"
            element={
              <div className="back-link">
                <Link to="/dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/detail/:projectId"
            element={
              <div className="back-link">
                <Link to="/search">Back to Search</Link>
              </div>
            }
          />
          <Route
            path="/supervisor-review"
            element={
              <div className="back-link">
                <Link to="/supervisor-dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/manage-users"
            element={
              <div className="back-link">
                <Link to="/admin-dashboard">Back to Dashboard</Link>
              </div>
            }
          />
          <Route
            path="/system-settings"
            element={
              <div className="back-link">
                <Link to="/admin-dashboard">Back to Dashboard</Link>
              </div>
            }
          />

<Route path="/assign-supervisor" element={<div className="back-link"><Link to="/admin-dashboard">Back to Dashboard</Link></div>} />
        </Routes>
        
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route
            path="/supervisor-dashboard"
            element={<SupervisorDashboard />}
          />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/upload" element={<ProjectUpload />} />
          <Route path="/status/:projectId" element={<ProjectStatus />} />
          <Route path="/feedback/:projectId" element={<SupervisorFeedback />} />
          <Route path="/search" element={<SearchProjects />} />
          <Route path="/detail/:projectId" element={<ProjectDetail />} />
          <Route path="/supervisor-review" element={<SupervisorReview />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/system-settings" element={<SystemSettings />} />
          <Route path="/assign-supervisor" element={<AssignSupervisor />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
