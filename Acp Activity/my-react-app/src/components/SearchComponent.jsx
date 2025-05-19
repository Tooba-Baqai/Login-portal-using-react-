import { useState } from 'react';
import axios from 'axios';
import '../styles/FormComponents.css';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false 
});

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError('Please enter an email to search');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    
    try {
      console.log('Searching for email:', searchQuery);
      const response = await api.get(`/api/search?query=${searchQuery}`);
      console.log('Search response:', response.data);
      setSearchResults(response.data.results);
      
      if (response.data.results.length === 0) {
        setSearchError('No feedback found with this email');
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError(`An error occurred during search: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Search Feedback</h2>
      
      <form onSubmit={handleSearch} className="feedback-form">
        <div className="form-group">
          <label htmlFor="search-query">Email:</label>
          <input
            type="email"
            id="search-query"
            placeholder="Enter email to search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            required
          />
        </div>
        
        {searchError && (
          <div className="error-message">
            {searchError}
          </div>
        )}
        
        <div className="button-group">
          <button 
            type="submit"
            disabled={isSearching}
            className="submit-button"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          <button 
            type="button" 
            onClick={() => {setSearchQuery(''); setSearchResults([]);}}
            className="reset-button"
          >
            Clear
          </button>
        </div>
      </form>
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results ({searchResults.length})</h3>
          
          <div className="results-list">
            {searchResults.map((result) => (
              <div key={result._id} className="result-card">
                <div className="result-field">
                  <span className="field-label">Username:</span> 
                  <span className="field-value">{result.userName}</span>
                </div>
                
                <div className="result-field">
                  <span className="field-label">Email:</span> 
                  <span className="field-value">{result.email}</span>
                </div>
                
                <div className="result-field">
                  <span className="field-label">Rating:</span> 
                  <span className="field-value">{result.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent; 