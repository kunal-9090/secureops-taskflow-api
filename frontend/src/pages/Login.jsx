import React, { useState } from 'react';
import api from '../api/axios.js';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = res.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      navigate('/dashboard');
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed';
      setMsg({ type: 'error', text: message });
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '30px auto' }}>
        <h2 style={{ marginTop: 0 }}>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="col" style={{ marginBottom: 12 }}>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="col" style={{ marginBottom: 12 }}>
            <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          <button className="primary" type="submit">
            Login
          </button>
        </form>

        {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}
        <div style={{ marginTop: 12, color: 'var(--muted)' }}>
          New here?{' '}
          <Link to="/register" style={{ color: 'var(--primary)' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

