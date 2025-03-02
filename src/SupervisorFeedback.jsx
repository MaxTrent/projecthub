import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function SupervisorFeedback() {
  const [projectTitle, setProjectTitle] = useState('');
  const [supervisorComments, setSupervisorComments] = useState('');
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [projectUpdatedAt, setProjectUpdatedAt] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
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
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();
        setUserRole(userData.role.toLowerCase());

        const projectResponse = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!projectResponse.ok) {
          const text = await projectResponse.text();
          throw new Error(`Project fetch failed - Status: ${projectResponse.status}, Response: ${text}`);
        }
        const projectData = await projectResponse.json();
        setProjectTitle(projectData.title);
        setStatus(projectData.status || '');
        setProjectUpdatedAt(projectData.updatedAt);

        const feedbackResponse = await fetch(`http://localhost:3000/api/feedback/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!feedbackResponse.ok) {
          const text = await feedbackResponse.text();
          throw new Error(`Feedback fetch failed - Status: ${feedbackResponse.status}, Response: ${text}`);
        }
        const feedbackData = await feedbackResponse.json();
        const latestFeedback = feedbackData.feedback.length > 0 ? feedbackData.feedback[0] : null;
        setSupervisorComments(latestFeedback ? latestFeedback.comments || '' : '');
        if (latestFeedback && new Date(latestFeedback.updatedAt) > new Date(projectData.updatedAt)) {
          setFeedbackSubmitted(true);
        } else {
          setFeedbackSubmitted(false);
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
        navigate(userRole === 'supervisor' ? '/supervisor-dashboard' : '/dashboard');
      }
    };

    if (projectId) {
      fetchFeedback();
    } else {
      console.log('No projectId provided');
      navigate('/dashboard');
    }
  }, [projectId, navigate, userRole]);

  const handleSubmitFeedback = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/');
      return;
    }

    if (!status) {
      setMessage('Please select a status before submitting feedback.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/projects/status/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          comments: supervisorComments,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Feedback submitted:', data);
        setMessage('Feedback submitted successfully!');
        setFeedbackSubmitted(true);
        setSupervisorComments('');
      } else {
        console.log('Feedback submission failed:', data.error);
        setMessage(`Failed to submit feedback: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setMessage('Error submitting feedback.');
    }
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/documents/${projectId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `project-${projectId}.pdf`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Download initiated');
      } else {
        const data = await response.json();
        console.log('Download failed:', data.error);
        setMessage(`Download failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      setMessage('Error downloading file.');
    }
  };

  return (
    <div className="feedback-page">
      <main className="feedback-content">
        <div className="feedback-card">
          <h3>Feedback for {projectTitle}</h3>
          <div className="input-group">
            <label htmlFor="supervisorComments">Supervisor Comments</label>
            <textarea
              id="supervisorComments"
              rows="5"
              value={supervisorComments}
              onChange={(e) => userRole === 'supervisor' && !feedbackSubmitted && setSupervisorComments(e.target.value)}
              readOnly={userRole !== 'supervisor' || feedbackSubmitted}
            />
          </div>
          {userRole === 'supervisor' && (
            <div className="input-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => !feedbackSubmitted && setStatus(e.target.value)}
                disabled={feedbackSubmitted}
                required
              >
                <option value="">Select Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
              </select>
            </div>
          )}
          <button className="download-button" onClick={handleDownload}>
            Download Project
          </button>
          {userRole === 'supervisor' && (
            <button
              className="submit-feedback-button"
              onClick={handleSubmitFeedback}
              disabled={feedbackSubmitted}
            >
              Submit Feedback
            </button>
          )}
          {message && (
            <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
              {message}
            </p>
          )}
          <div className="back-link">
            <Link to={userRole === 'supervisor' ? '/supervisor-dashboard' : '/dashboard'}>
              Back to {userRole === 'supervisor' ? 'Supervisor' : 'Student'} Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SupervisorFeedback;