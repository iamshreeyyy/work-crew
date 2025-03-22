'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';

function DisputesContent() {
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState({
    milestoneId: '',
    raisedBy: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/disputes');
        setDisputes(res.data.disputes);
      } catch (err) {
        setError('Error fetching disputes');
      }
    };
    fetchDisputes();
  }, [refresh]);

  const handleChange = (e) => {
    setNewDispute({ ...newDispute, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/disputes', newDispute);
      setNewDispute({ milestoneId: '', raisedBy: '', description: '' });
      setRefresh(!refresh);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting dispute');
    }
  };

  return (
    <div>
      <h2>Dispute Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <section style={{ marginBottom: '2rem' }}>
        <h3>Raise a New Dispute</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <input type="text" name="milestoneId" placeholder="Milestone ID" value={newDispute.milestoneId} onChange={handleChange} required />
          <input type="text" name="raisedBy" placeholder="Your User ID" value={newDispute.raisedBy} onChange={handleChange} required />
          <textarea name="description" placeholder="Describe the dispute..." value={newDispute.description} onChange={handleChange} rows={4} required></textarea>
          <button type="submit">Submit Dispute</button>
        </form>
      </section>
      <section>
        <h3>Existing Disputes</h3>
        {disputes.length === 0 ? (
          <p>No disputes found.</p>
        ) : (
          <ul>
            {disputes.map(d => (
              <li key={d._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
                <p><strong>Milestone ID:</strong> {d.milestoneId?._id || d.milestoneId}</p>
                <p><strong>Title:</strong> {d.milestoneId?.title || 'N/A'}</p>
                <p><strong>Raised By:</strong> {d.raisedBy?.username || d.raisedBy}</p>
                <p><strong>Description:</strong> {d.description}</p>
                <p><strong>Status:</strong> {d.status}</p>
                {d.resolution && <p><strong>Resolution:</strong> {d.resolution}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function DisputesPage() {
  return (
    <ProtectedRoute>
      <DisputesContent />
    </ProtectedRoute>
  );
}
