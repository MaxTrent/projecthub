import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ProjectStatus() {
  const [stages, setStages] = useState([]);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      console.log('Fetching status for projectId:', projectId); 
      try {
        const response = await fetch(`http://localhost:3000/api/projects/status/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('API response:', data); // Debug log
        if (response.ok) {
          // Map backend status to stages
          const allStages = ['Draft', 'Submitted', 'Under Review', 'Approved'];
          const currentStatusIndex = allStages.findIndex(
            stage => stage.toLowerCase().replace(' ', '_') === data.status
          );
          console.log('Current status:', data.status, 'Index:', currentStatusIndex); // Debug log
          setStages(
            allStages.map((name, index) => ({
              name,
              active: index <= currentStatusIndex,
            }))
          );
          setStatusHistory(data.updates || []); // Ensure updates is an array
          setLoading(false); // Data loaded
        } else {
          console.log('Failed to fetch project status:', data.error || 'Unknown error');
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching project status:', err);
        navigate('/dashboard');
      }
    };

    if (projectId) {
      fetchProjectStatus();
    } else {
      console.log('No projectId provided');
      navigate('/dashboard');
    }
  }, [projectId, navigate]);

  if (loading) {
    return (
      <div className="status-page">
        <main className="status-content">
          <div className="status-card">
            <h3>Project Status</h3>
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="status-page">
      <main className="status-content">
        <div className="status-card">
          <h3>Project Status</h3>
          {stages.length === 0 && statusHistory.length === 0 ? (
            <p>No status data available</p>
          ) : (
            <>
              <div className="timeline">
                {stages.map((stage, index) => (
                  <div key={stage.name} className="timeline-stage">
                    <div className={`stage-circle ${stage.active ? 'active' : ''}`}>
                      {index + 1}
                    </div>
                    <span className="stage-name">{stage.name}</span>
                    {index < stages.length - 1 && (
                      <div className={`timeline-line ${stage.active && stages[index + 1].active ? 'active' : ''}`} />
                    )}
                  </div>
                ))}
              </div>
              <table className="status-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {statusHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.status.replace('_', ' ')}</td>
                      <td>{entry.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProjectStatus;