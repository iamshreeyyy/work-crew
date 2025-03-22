'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewSubmissionsContent() {
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/submissions')
      .then(res => setSubmissions(res.data.submissions))
      .catch(() => setError('Error fetching submissions'));
  }, []);

  const handleUpdate = async (submissionId, status) => {
    try {
      const feedback = status === 'rejected' ? prompt('Enter feedback for rejection:') : '';
      await axios.put(`http://localhost:5000/api/submissions/${submissionId}`, { status, feedback });
      setSubmissions(prev => prev.map(sub => sub._id === submissionId ? { ...sub, status, feedback } : sub));
    } catch (err) {
      setError('Error updating submission');
    }
  };

  return (
    <div>
      <h2>Review Work Submissions</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {submissions.length === 0 ? (
        <p>No submissions to review.</p>
      ) : (
        <ul>
          {submissions.map(sub => (
            <li key={sub._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
              <p><strong>Milestone:</strong> {sub.milestoneId?.title || sub.milestoneId}</p>
              <p><strong>Freelancer:</strong> {sub.freelancerId?.username || sub.freelancerId}</p>
              <p><strong>Details:</strong> {sub.submissionDetails}</p>
              <p><strong>Status:</strong> {sub.status}</p>
              {sub.feedback && <p><strong>Feedback:</strong> {sub.feedback}</p>}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => handleUpdate(sub._id, 'approved')} disabled={sub.status === 'approved'}>Approve</button>
                <button onClick={() => handleUpdate(sub._id, 'rejected')} style={{ marginLeft: '1rem' }} disabled={sub.status === 'rejected'}>Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReviewSubmissionsPage() {
  return (
    <ProtectedRoute>
      <ReviewSubmissionsContent />
    </ProtectedRoute>
  );
}
