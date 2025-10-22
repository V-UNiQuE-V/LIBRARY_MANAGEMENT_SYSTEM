# Frontend Integration Guide for Feedback System

## React Component Example

Below is a sample React component that demonstrates how to integrate the feedback system into the frontend.

### FeedbackForm.jsx

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
    category: 'General'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const categories = [
    'General',
    'Book Quality',
    'Service',
    'Website',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        '/api/v1/feedback/submit',
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage('Thank you for your feedback!');
        setFormData({ rating: 5, comment: '', category: 'General' });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Share Your Feedback</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Rating (1-5 stars)
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className={`text-3xl ${
                  star <= formData.rating
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-gray-600">
              {formData.rating} star{formData.rating !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Feedback
          </label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Tell us about your experience..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-md ${
              message.includes('Thank you')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default FeedbackForm;
```

### FeedbackList.jsx (Admin View)

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('/api/v1/feedback/all', {
        withCredentials: true
      });
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) {
      return;
    }

    try {
      await axios.delete(`/api/v1/feedback/delete/${id}`, {
        withCredentials: true
      });
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (error) {
      alert('Failed to delete feedback');
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Customer Feedback</h2>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback._id}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {feedback.user.name}
                </h3>
                <p className="text-sm text-gray-600">{feedback.user.email}</p>
              </div>
              <button
                onClick={() => handleDelete(feedback._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>

            <div className="mb-2">
              <span className="text-yellow-400 text-xl">
                {renderStars(feedback.rating)}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                ({feedback.rating}/5)
              </span>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {feedback.category}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{feedback.comment}</p>

            <p className="text-xs text-gray-500">
              {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {feedbacks.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            No feedback yet
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
```

### MyFeedback.jsx (User View)

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyFeedbacks();
  }, []);

  const fetchMyFeedbacks = async () => {
    try {
      const response = await axios.get('/api/v1/feedback/my-feedback', {
        withCredentials: true
      });
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Feedback History</h2>
      
      <div className="space-y-4">
        {feedbacks.map((feedback) => (
          <div
            key={feedback._id}
            className="bg-white p-6 rounded-lg shadow-md border"
          >
            <div className="mb-2">
              <span className="text-yellow-400 text-xl">
                {renderStars(feedback.rating)}
              </span>
              <span className="ml-2 text-sm text-gray-600">
                ({feedback.rating}/5)
              </span>
            </div>

            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {feedback.category}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{feedback.comment}</p>

            <p className="text-xs text-gray-500">
              Submitted on {new Date(feedback.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

        {feedbacks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              You haven't submitted any feedback yet
            </p>
            <a
              href="/feedback"
              className="text-blue-600 hover:underline"
            >
              Submit your first feedback
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFeedback;
```

## Axios Configuration

Make sure to configure axios with credentials:

```javascript
// api/config.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```

## Routing Example

```javascript
// App.jsx or routes configuration
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import MyFeedback from './components/MyFeedback';

// For users
<Route path="/feedback" element={<FeedbackForm />} />
<Route path="/my-feedback" element={<MyFeedback />} />

// For admins
<Route path="/admin/feedback" element={<FeedbackList />} />
```

## Notes

- The components use Tailwind CSS classes (already configured in this project)
- Authentication is handled through HTTP-only cookies (already implemented)
- Error handling is included for all API calls
- Loading states are managed appropriately
- All components follow React best practices and hooks
