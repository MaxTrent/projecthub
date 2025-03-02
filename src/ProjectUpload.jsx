import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProjectUpload() {
  const [projectTitle, setProjectTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState(null);
  const [project, setProject] = useState(null);
  const [message, setMessage] = useState('');
  const [maxFileSize, setMaxFileSize] = useState(50); //Default 50mb
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/');
        return;
      }

      try {
        // Fetch settings
        const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!settingsResponse.ok) {
          const text = await settingsResponse.text();
          console.log('Settings fetch failed - Status:', settingsResponse.status, 'Response:', text);
          // Use default 50MB if fetch fails
        } else {
          const settingsData = await settingsResponse.json();
          setMaxFileSize(settingsData.maxFileSize);
        }

        // Fetch project
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
          return;
        }
        const data = await projectResponse.json();
        console.log('Project data:', data);
        setProject(data);
        if (data) {
          const projectDetailsResponse = await fetch(`http://localhost:3000/api/projects/${data.projectId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          const projectData = await projectDetailsResponse.json();
          if (projectDetailsResponse.ok) {
            setProjectTitle(projectData.title);
            setAbstract(projectData.abstract);
            setKeywords(projectData.keywords);
            setMessage('You have an existing project. Update details and/or file as needed.');
          }
        } else {
          setMessage('No project submitted yet. Please fill in all fields to submit.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSizeBytes = maxFileSize * 1024 * 1024; // Convert MB to bytes
      if (allowedTypes.includes(selectedFile.type) && selectedFile.size <= maxSizeBytes) {
        setFile(selectedFile);
      } else {
        alert(`Please upload a PDF or Word file under ${maxFileSize}MB.`);
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectTitle || !abstract || !keywords) {
      alert('Please fill in all fields.');
      return;
    }
    if (!file && !project) {
      alert('Please upload a file for your initial submission.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/');
      return;
    }

    const formData = new FormData();
    formData.append('title', projectTitle);
    formData.append('abstract', abstract);
    formData.append('keywords', keywords);
    if (file) formData.append('file', file);

    try {
      const url = project ? `http://localhost:3000/api/projects/upload/${project.projectId}` : 'http://localhost:3000/api/projects/upload';
      const method = project ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log(project ? 'Resubmit successful:' : 'Upload successful:', data);
        setProject({ projectId: data.projectId, title: projectTitle, status: project ? 'submitted' : 'draft' });
        setFile(null);
        setMessage(project ? 'Project resubmitted successfully!' : 'Project submitted successfully!');
        navigate('/dashboard');
      } else {
        console.log(project ? 'Resubmit failed:' : 'Upload failed:', data.error);
        setMessage(`Submission failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setMessage('Error during submission.');
    }
  };

  return (
    <div className="upload-page">
      <main className="upload-content">
        <div className="upload-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="projectTitle">Project Title</label>
              <input
                type="text"
                id="projectTitle"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="abstract">Abstract</label>
              <textarea
                id="abstract"
                rows="5"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="keywords">Keywords</label>
              <input
                type="text"
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., machine learning, web development"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="document">Upload Document</label>
              <input
                type="file"
                id="document"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                required={!project}
              />
            </div>
            <button type="submit" className="submit-button">
              {project ? 'Resubmit Project' : 'Submit Project'}
            </button>
            <p className="upload-note">Supported formats: PDF, Word. Max size: {maxFileSize}MB.</p>
            {message && (
              <p style={{ color: message.includes('successfully') ? 'green' : 'red' }}>
                {message}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProjectUpload;