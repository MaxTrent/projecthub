import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SearchProjects() {
  const [searchQuery, setSearchQuery] = useState('');
  const demoProjects = [
    { id: 1, title: 'Machine Learning in Healthcare', author: 'John Doe', year: '2024' },
    { id: 2, title: 'Web Development Trends', author: 'Jane Smith', year: '2023' },
    { id: 3, title: 'AI for Climate Modeling', author: 'Alex Brown', year: '2024' },
  ];

  const [searchResults, setSearchResults] = useState(demoProjects);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = demoProjects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  };

  return (
    <div className="search-page">
      <main className="search-content">
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by keywords, e.g., machine learning"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search projects"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        <div className="results-list">
          {searchResults.length > 0 ? (
            searchResults.map(project => (
              <div key={project.id} className="result-card">
                <h3>{project.title}</h3>
                <p>Author: {project.author}</p>
                <p>Year: {project.year}</p>
                <Link to="/detail" className="view-details-button">View Details</Link>
              </div>
            ))
          ) : (
            <p>No projects found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default SearchProjects;