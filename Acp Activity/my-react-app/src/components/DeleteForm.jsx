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

const DeleteForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const resetForm = () => {
    setEmail('');
    setMessage('');
    setError('');
    setConfirmDelete(false);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!email) {
      setError('Email is required for deletion');
      return;
    }

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      console.log('Deleting feedback for email:', email);
      const response = await api.delete(`/api/feedback/email/${email}`);
      console.log('Delete response:', response);
      setMessage('Feedback deleted successfully!');
      resetForm();
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError(`Failed to delete feedback: ${err.message}`);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="form-container delete-container">
      <h2>Delete Feedback</h2>
      
      <form onSubmit={handleDelete} className="feedback-form">
        <div className="form-group">
          <label htmlFor="delete-email">Email:</label>
          <input
            type="email"
            id="delete-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email to delete your feedback"
            className="form-input"
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        {confirmDelete && (
          <div className="confirm-delete">
            <p>Are you sure you want to delete your feedback? This action cannot be undone.</p>
          </div>
        )}
        
        <div className="button-group">
          <button type="submit" className="delete-button">
            {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </button>
          <button type="button" onClick={resetForm} className="reset-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteForm; 