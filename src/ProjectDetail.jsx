import React from 'react';
import { Link } from 'react-router-dom';

function ProjectDetail() {
  // Hardcoded data for demo purposes
  const project = {
    title: 'Machine Learning in Healthcare',
    author: 'John Doe',
    year: '2024',
    keywords: 'machine learning, healthcare',
    abstract: 'This project explores the application of machine learning techniques in predicting patient outcomes based on electronic health records. The study focuses on supervised learning models and their performance in real-world healthcare settings.',
  };

  const handleDownload = () => {
    console.log('Download project document initiated');
    // Logic to download the file would go here (e.g., fetch from backend)
  };

  return (
    <div className="detail-page">
      <main className="detail-content">
        <div className="detail-card">
          <h3>{project.title}</h3>
          <div className="metadata">
            <p><strong>Author:</strong> {project.author}</p>
            <p><strong>Year:</strong> {project.year}</p>
            <p><strong>Keywords:</strong> {project.keywords}</p>
          </div>
          <div className="input-group">
            <label htmlFor="abstract">Abstract</label>
            <textarea
              id="abstract"
              rows="5"
              value={project.abstract}
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