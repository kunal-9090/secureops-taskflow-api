import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '30px auto' }}>
        <h2 style={{ marginTop: 0 }}>404</h2>
        <p style={{ color: 'var(--muted)' }}>Page not found.</p>
        <Link to="/dashboard" style={{ color: 'var(--primary)' }}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

