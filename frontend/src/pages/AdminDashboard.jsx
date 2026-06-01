import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [msg, setMsg] = useState(null);

  const fetchAll = async () => {
    setMsg(null);
    try {
      const [usersRes, tasksRes, statsRes, logsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/tasks'),
        api.get('/admin/stats'),
        api.get('/admin/audit-logs')
      ]);
      setUsers(usersRes.data.data || []);
      setTasks(tasksRes.data.data || []);
      setStats(statsRes.data.data || null);
      setAuditLogs(logsRes.data.data || []);
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to load admin data' });
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setUserStatus = async (id, isActive) => {
    try {
      await api.patch(`/admin/users/${id}/status`, { isActive });
      await fetchAll();
      setMsg({ type: 'success', text: 'User updated' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update user' });
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/admin/tasks/${id}`);
      await fetchAll();
      setMsg({ type: 'success', text: 'Task deleted' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to delete task' });
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: 10 }}>Admin Dashboard</h2>
      {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

      <div className="row" style={{ marginTop: 16 }}>
        <div className="card col">
          <h3 style={{ marginTop: 0 }}>Stats</h3>
          {stats ? (
            <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--muted)' }}>
              <li>Total Users: {stats.totalUsers}</li>
              <li>Active Users: {stats.activeUsers}</li>
              <li>Total Tasks: {stats.totalTasks}</li>
              <li>Pending Tasks: {stats.pendingTasks}</li>
              <li>Completed Tasks: {stats.completedTasks}</li>
              <li>High Priority Tasks: {stats.highPriorityTasks}</li>
            </ul>
          ) : (
            <div style={{ color: 'var(--muted)' }}>Loading...</div>
          )}
        </div>

        <div className="card col">
          <h3 style={{ marginTop: 0 }}>Users</h3>
          <div style={{ maxHeight: 320, overflow: 'auto' }}>
            {users.map((u) => (
              <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{u.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>{u.email} • {u.role}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setUserStatus(u._id, true)}
                    disabled={u.isActive}
                  >Activate</button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => setUserStatus(u._id, false)}
                    disabled={!u.isActive}
                  >Deactivate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>All Tasks (Admin)</h3>
        <div style={{ maxHeight: 340, overflow: 'auto' }}>
          {tasks.map((t) => (
            <div key={t._id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 900 }}>{t.title}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {t.status} • {t.priority} • created by {t.createdBy?.name}
              </div>
              <div style={{ marginTop: 8 }}>
                <button className="danger" onClick={() => deleteTask(t._id)} type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Audit Logs</h3>
        <div style={{ maxHeight: 320, overflow: 'auto' }}>
          {auditLogs.map((l) => (
            <div key={l._id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontWeight: 900 }}>{l.action}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {l.resource} • {l.endpoint} • {new Date(l.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

