import React from 'react';
import { Link } from 'react-router-dom';

function SupervisorFeedback() {
  // Hardcoded data for demo purposes
  const projectTitle = 'Machine Learning in Healthcare';
  const supervisorComments = 'Please revise chapter 3 to include more details on methodology. The current version lacks clarity in the data preprocessing steps.';

  const handleDownload = () => {
    console.log('Download project file initiated');
    // Logic to download the file would go here (e.g., fetch from backend)
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