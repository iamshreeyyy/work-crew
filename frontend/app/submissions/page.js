'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';

function SubmissionsContent() {
  const [submissions, setSubmissions] = useState([]);
  const [newSubmission, setNewSubmission] = useState({
    milestoneId: '',
    freelancerId: '',
    submissionDetails: '',
  });
  const [error, setError] = useState('');

  // Optionally, you might fetch submissions based on a logged-in freelancer's ID.
  useEffect(() => {
    if (newSubmission.freelancerId) {
      axios.get('http://localhost:5000/api/submissions', {
        params: { freelancerId: newSubmission.freelancerId }
      })
      .then(res => setSubmissions(res.data.submissions))
      .catch(() => setError('Error fetching submissions'));
    }
  }, [newSubmission.freelancerId]);

  const handleChange = (e) => {
    setNewSubmission({ ...newSubmission, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/submissions', newSubmission);
      setNewSubmission({
        milestoneId: '',
        freelancerId: newSubmission.freelancerId,
        submissionDetails: '',
      });
      // Refresh submissions after a successful post
      const res = await axios.get('http://localhost:5000/api/submissions', {
        params: { freelancerId: newSubmission.freelancerId }
      });
      setSubmissions(res.data.submissions);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting work');
    }
  };

  return (
    <div>
      <h2>Work Submissions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', maxWidth: '400px' }}>
        <input type="text" name="milestoneId" placeholder="Milestone ID" value={newSubmission.milestoneId} onChange={handleChange} required />
        <input type="text" name="freelancerId" placeholder="Your Freelancer ID" value={newSubmission.freelancerId} onChange={handleChange} required />
        <textarea name="submissionDetails" placeholder="Enter your work submission details" value={newSubmission.submissionDetails} onChange={handleChange} rows={4} required></textarea>
        <button type="submit">Submit Work</button>
      </form>
      <section>
        <h3>Your Submissions</h3>
        {submissions.length === 0 ? (
          <p>No submissions found.</p>
        ) : (
          <ul>
            {submissions.map(sub => (
              <li key={sub._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                <p><strong>Milestone:</strong> {sub.milestoneId?.title || sub.milestoneId}</p>
                <p><strong>Status:</strong> {sub.status}</p>
                <p><strong>Details:</strong> {sub.submissionDetails}</p>
                {sub.feedback && <p><strong>Feedback:</strong> {sub.feedback}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <ProtectedRoute>
      <SubmissionsContent />
    </ProtectedRoute>
  );
}
