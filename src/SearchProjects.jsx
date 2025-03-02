import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SearchProjects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      console.log('Search query is empty');
      setSearchResults([]);
      return;
    }

    console.log('Sending search request with keyword:', searchQuery);
    try {
      const response = await fetch(`http://localhost:3000/api/projects/search?keyword=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('Raw response status:', response.status, 'Data:', data);
      if (response.ok) {
        console.log('Search results received:', data);
        setSearchResults(data);
      } else {
        console.log('Search failed:', data.error || 'Unknown error');
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error during search:', err);
      setSearchResults([]);
    }
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
              <div key={project.projectId} className="result-card">
                <h3>{project.title || 'No Title'}</h3>
                <p>Author: {project.author || 'Unknown'}</p>
                <p>Year: {project.year || 'N/A'}</p>
                <Link to={`/detail/${project.projectId}`} className="view-details-button">View Details</Link>
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