'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';

function DashboardContent() {
  const [milestones, setMilestones] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/milestones')
      .then(res => setMilestones(res.data.milestones))
      .catch(() => setError('Error fetching milestones'));

    axios.get('http://localhost:5000/api/disputes')
      .then(res => setDisputes(res.data.disputes))
      .catch(() => setError('Error fetching disputes'));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section style={sectionStyle}>
        <h3>Recent Milestones</h3>
        {milestones.length === 0 ? (
          <p>No milestones found.</p>
        ) : (
          <ul>
            {milestones.slice(0, 5).map(m => (
              <li key={m._id}>
                <strong>{m.title}</strong> - Status: {m.status}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section style={sectionStyle}>
        <h3>Recent Disputes</h3>
        {disputes.length === 0 ? (
          <p>No disputes found.</p>
        ) : (
          <ul>
            {disputes.slice(0, 5).map(d => (
              <li key={d._id}>
                Milestone: {d.milestoneId?.title || d.milestoneId} - Status: {d.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

const sectionStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
