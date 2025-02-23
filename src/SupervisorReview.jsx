import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SupervisorReview() {
  // Hardcoded data for demo purposes
  const project = {
    title: 'Machine Learning in Healthcare',
    abstract: 'This project explores the application of machine learning techniques in predicting patient outcomes based on electronic health records. The study focuses on supervised learning models and their performance in real-world healthcare settings.',
  };

  const [feedback, setFeedback] = useState('');

  const handleDownload = () => {
    console.log('Download project document initiated');
    // Logic to download the file would go here (e.g., fetch from backend)
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { projectTitle: project.title, feedback });
    setFeedback(''); // Clear feedback after submission
  };

  return (
    <div className="review-page">
      <main className="review-content">
        <div className="review-card">
          <h3>Review: {project.title}</h3>
          <div className="input-group">
            <label htmlFor="projectAbstract">Project Abstract</label>
            <textarea
              id="projectAbstract"
              rows="5"
              value={project.abstract}
              readOnly
              aria-label="Project Abstract"
            />
          </div>
          <button className="download-button" onClick={handleDownload}>
            Download Document
          </button>
          <form onSubmit={handleSubmitFeedback}>
            <div className="input-group">
              <label htmlFor="feedback">Feedback</label>
              <textarea
                id="feedback"
                rows="5"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide your feedback here"
                aria-label="Supervisor Feedback"
                required
              />
            </div>
            <button type="submit" className="submit-feedback-button">
              Submit Feedback
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SupervisorReview;