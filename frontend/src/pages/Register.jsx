import React, { useState } from 'react';
import api from '../api/axios.js';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      setMsg({ type: 'success', text: res.data.message });
      navigate('/login');
    } catch (err) {
      const message = err?.response?.data?.message || 'Registration failed';
      setMsg({ type: 'error', text: message });
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '30px auto' }}>
        <h2 style={{ marginTop: 0 }}>Register</h2>
        <form onSubmit={handleRegister}>
          <div className="col" style={{ marginBottom: 12 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="col" style={{ marginBottom: 12 }}>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="col" style={{ marginBottom: 12 }}>
            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
            />
          </div>
          <button className="primary" type="submit">Register</button>
        </form>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
        <div style={{ marginTop: 12, color: 'var(--muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

