import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ProjectUpload() {
  const [projectTitle, setProjectTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (allowedTypes.includes(selectedFile.type) && selectedFile.size <= maxSize) {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF or Word file under 50MB.');
        e.target.value = null;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a document.');
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
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/projects/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Project submitted successfully:', data);
        setProjectTitle('');
        setAbstract('');
        setKeywords('');
        setFile(null);
        e.target.reset();
        // Redirect to dashboard with projectId in state
        navigate('/dashboard', { state: { projectId: data.projectId } });
      } else {
        console.log('Project upload failed:', data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error uploading project:', err);
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
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
            <p className="upload-note">Supported formats: PDF, Word. Max size: 50MB.</p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ProjectUpload;