import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ProjectUpload() {
  const [projectTitle, setProjectTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (allowedTypes.includes(selectedFile.type) && selectedFile.size <= maxSize) {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF or Word file under 50MB.');
        e.target.value = null; // Reset the input
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a document.');
      return;
    }
    console.log('Project submitted:', { projectTitle, abstract, keywords, file });
    // Reset form after submission (optional)
    setProjectTitle('');
    setAbstract('');
    setKeywords('');
    setFile(null);
    e.target.reset(); // Reset file input
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