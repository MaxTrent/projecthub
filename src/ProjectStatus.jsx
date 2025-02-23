import React from 'react';
import { Link } from 'react-router-dom';

function ProjectStatus() {
  // Hardcoded data for demo purposes
  const stages = [
    { name: 'Draft', active: true },
    { name: 'Submitted', active: true },
    { name: 'Under Review', active: true },
    { name: 'Approved', active: false },
  ];

  const statusHistory = [
    { date: '2024-09-01', status: 'Submitted', comments: 'Awaiting review' },
    { date: '2024-08-25', status: 'Draft', comments: 'Initial draft saved' },
  ];

  return (
    <div className="status-page">
      <main className="status-content">
        <div className="status-card">
          <h3>Project Status</h3>
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
                  <td>{entry.date}</td>
                  <td>{entry.status}</td>
                  <td>{entry.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ProjectStatus;