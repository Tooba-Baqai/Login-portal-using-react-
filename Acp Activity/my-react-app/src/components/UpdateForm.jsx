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

const UpdateForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setUsername('');
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Email is required for update');
      return;
    }

    if (!username || !rating) {
      setError('Please fill in username and rating');
      return;
    }

    if (!validateRating(rating)) {
      setError('Rating must be a number between 1 and 5');
      return;
    }

    try {
      const userData = {
        userName: username,
        rating: rating
      };

      console.log('Updating feedback for email:', email, userData);
      const response = await api.put(`/api/feedback/email/${email}`, userData);
      console.log('Update response:', response);
      setMessage('Feedback updated successfully!');
    } catch (err) {
      console.error('Error updating feedback:', err);
      setError(err.response?.data?.message || `Failed to update feedback: ${err.message}`);
    }
  };

  return (
    <div className="form-container update-container">
      <h2>Update Feedback</h2>
      
      <form onSubmit={handleUpdate} className="feedback-form">
        <div className="form-group">
          <label htmlFor="update-email">Email:</label>
          <input
            type="email"
            id="update-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to find your feedback"
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="update-username">New Username:</label>
          <input
            type="text"
            id="update-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter new username"
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="update-rating">New Rating (1-5):</label>
          <input
            type="number"
            id="update-rating"
            value={rating}
            onChange={handleRatingChange}
            placeholder="Enter new rating (1-5)"
            className="form-input"
            min="1"
            max="5"
          />
          <small className="rating-hint">Please rate from 1 (lowest) to 5 (highest)</small>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <div className="button-group">
          <button type="submit" className="update-button">Update</button>
          <button type="button" onClick={resetForm} className="reset-button">Reset</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm; 