import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

function ProjectDetail() {
  const [project, setProject] = useState(null);
  const { projectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Project details received:', data);
          setProject(data);
        } else {
          console.log('Failed to fetch project details:', data.error || 'Unknown error');
          navigate('/search');
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
        navigate('/search');
      }
    };

    if (projectId) {
      fetchProjectDetails();
    } else {
      console.log('No projectId provided');
      navigate('/search');
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
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        // Extract filename from Content-Disposition or default
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

  if (!project) {
    return (
      <div className="detail-page">
        <main className="detail-content">
          <div className="detail-card">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <main className="detail-content">
        <div className="detail-card">
          <h3>{project.title || 'No Title'}</h3>
          <div className="metadata">
            <p><strong>Author:</strong> {project.author || 'Unknown'}</p>
            <p><strong>Year:</strong> {project.year || 'N/A'}</p>
            <p><strong>Keywords:</strong> {project.keywords || 'None'}</p>
          </div>
          <div className="input-group">
            <label htmlFor="abstract">Abstract</label>
            <textarea
              id="abstract"
              rows="5"
              value={project.abstract || 'No abstract available'}
              readOnly
              aria-label="Project Abstract"
            />
          </div>
          <button className="download-button" onClick={handleDownload}>
            Download Document
          </button>
        </div>
      </main>
    </div>
  );
}

export default ProjectDetail;