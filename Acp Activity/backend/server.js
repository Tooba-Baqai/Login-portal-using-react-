const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Feedback = require('./models/feedback');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: false
}));

mongoose.connect('mongodb://localhost:27017/admin', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); 
  });

app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = await Feedback.find({
      $or: [
        { userName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { rating: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({ results });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ message: 'Server error during search' });
  }
});

app.post('/api/feedback', async (req, res) => {
  console.log('Received feedback data:', req.body);
  try {
    const { userName, email, rating } = req.body;
    
    if (!userName || !email || !rating) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      console.log('Invalid rating value:', rating);
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }
    
    const feedback = new Feedback({ userName, email, rating });
    console.log('Created feedback object:', feedback);
    
    const savedFeedback = await feedback.save();
    console.log('Feedback saved successfully:', savedFeedback);
    
    res.status(201).json({ 
      message: 'Feedback saved successfully', 
      feedback: savedFeedback 
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ 
      message: 'Error saving feedback', 
      error: error.message 
    });
  }
});

app.put('/api/feedback/:id', async (req, res) => {
  console.log('Update request received for ID:', req.params.id);
  console.log('Update data:', req.body);
  
  try {
    const { id } = req.params;
    const { userName, email, rating } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid MongoDB ObjectId format:', id);
      return res.status(400).json({ message: 'Invalid feedback ID format' });
    }
    
    if (!userName || !email || !rating) {
      console.log('Missing required fields for update');
      return res.status(400).json({ message: 'All fields are required for update' });
    }
    
    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      { userName, email, rating },
      { new: true }
    );
    
    if (!updatedFeedback) {
      console.log('Feedback not found with ID:', id);
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    console.log('Feedback updated successfully:', updatedFeedback);
    res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      message: 'Error updating feedback', 
      error: error.message 
    });
  }
});

app.delete('/api/feedback/:id', async (req, res) => {
  console.log('Delete request received for ID:', req.params.id);
  
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('Invalid MongoDB ObjectId format:', id);
      return res.status(400).json({ message: 'Invalid feedback ID format' });
    }
    
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    
    if (!deletedFeedback) {
      console.log('Feedback not found with ID:', id);
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    console.log('Feedback deleted successfully:', deletedFeedback);
    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ 
      message: 'Error deleting feedback', 
      error: error.message 
    });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Error fetching feedback' });
  }
});

app.put('/api/feedback/email/:email', async (req, res) => {
  console.log('Update request received for email:', req.params.email);
  console.log('Update data:', req.body);
  
  try {
    const { email } = req.params;
    const { userName, rating } = req.body;
    
    if (!email) {
      console.log('Missing email parameter');
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (!userName || !rating) {
      console.log('Missing required fields for update');
      return res.status(400).json({ message: 'Username and rating are required for update' });
    }
    
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      console.log('Invalid rating value:', rating);
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }
    
    const updatedFeedback = await Feedback.findOneAndUpdate(
      { email: email },
      { userName, rating },
      { new: true }
    );
    
    if (!updatedFeedback) {
      console.log('Feedback not found with email:', email);
      return res.status(404).json({ message: 'Feedback not found with this email' });
    }
    
    console.log('Feedback updated successfully:', updatedFeedback);
    res.json({ message: 'Feedback updated successfully', feedback: updatedFeedback });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ 
      message: 'Error updating feedback', 
      error: error.message 
    });
  }
});

app.delete('/api/feedback/email/:email', async (req, res) => {
  console.log('Delete request received for email:', req.params.email);
  
  try {
    const { email } = req.params;
    
    if (!email) {
      console.log('Missing email parameter');
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const deletedFeedback = await Feedback.findOneAndDelete({ email: email });
    
    if (!deletedFeedback) {
      console.log('Feedback not found with email:', email);
      return res.status(404).json({ message: 'Feedback not found with this email' });
    }
    
    console.log('Feedback deleted successfully:', deletedFeedback);
    res.json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ 
      message: 'Error deleting feedback', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 