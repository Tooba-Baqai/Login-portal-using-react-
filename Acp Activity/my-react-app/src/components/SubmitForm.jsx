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

const SubmitForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setRating('');
    setMessage('');
    setError('');
  };

  const validateRating = (value) => {
    const ratingNum = parseInt(value);
    return !isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5;
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^[1-5]$/.test(value)) {
      setRating(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Basic validation
    if (!username || !email || !rating) {
      setError('Please fill in all fields');
      return;
    }

    // Validate rating
    if (!validateRating(rating)) {
      setError('Rating must be a number between 1 and 5');
      return;
    }

    try {
      const userData = {
        userName: username,
        email: email,
        rating: rating
      };

      console.log('Submitting data:', userData);
      const response = await api.post('/api/feedback', userData);
      console.log('Response:', response);
      setMessage('Feedback submitted successfully!');
      resetForm();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || `Failed to submit feedback: ${err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Submit New Feedback</h2>
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="submit-username">Username:</label>
          <input
            type="text"
            id="submit-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="submit-email">Email:</label>
          <input
            type="email"
            id="submit-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="submit-rating">Rating (1-5):</label>
          <input
            type="number"
            id="submit-rating"
            value={rating}
            onChange={handleRatingChange}
            placeholder="Enter your rating (1-5)"
            className="form-input"
            min="1"
            max="5"
          />
          <small className="rating-hint">Please rate from 1 (lowest) to 5 (highest)</small>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="button-group">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={resetForm} className="reset-button">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default SubmitForm; 