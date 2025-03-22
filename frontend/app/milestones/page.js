'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';

function MilestonesContent() {
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/milestones')
      .then(res => setMilestones(res.data.milestones))
      .catch(() => setError('Error fetching milestones'));
  }, []);

  return (
    <div>
      <h2>Milestones</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {milestones.length === 0 ? (
        <p>No milestones available.</p>
      ) : (
        <ul>
          {milestones.map(m => (
            <li key={m._id}>
              <strong>{m.title}</strong> - Status: {m.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MilestonesPage() {
  return (
    <ProtectedRoute>
      <MilestonesContent />
    </ProtectedRoute>
  );
}
