import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function SupervisorFeedback() {
  const [projectTitle, setProjectTitle] = useState('');
  const [supervisorComments, setSupervisorComments] = useState('');
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
        const response = await fetch(`http://localhost:3000/api/feedback/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Feedback data received:', data);
          setProjectTitle(data.title);
          const latestFeedback = data.feedback.length > 0 ? data.feedback[0] : null;
          setSupervisorComments(latestFeedback ? latestFeedback.comments || 'No comments provided' : 'No feedback available');
        } else {
          console.log('Failed to fetch feedback:', data.error || 'Unknown error');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
        navigate('/dashboard');
      }
    };

    if (projectId) {
      fetchFeedback();
    } else {
      console.log('No projectId provided');
      navigate('/dashboard');
    }
  }, [projectId, navigate]);

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
        console.log('Blob size:', blob.size, 'Type:', blob.type);
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
        console.log('Download failed:', data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error downloading file:', err);
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
              readOnly
            />
          </div>
          <button className="download-button" onClick={handleDownload}>
            Download Project
          </button>
        </div>
      </main>
    </div>
  );
}

export default SupervisorFeedback;