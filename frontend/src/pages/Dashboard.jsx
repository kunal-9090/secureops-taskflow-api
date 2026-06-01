import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import TaskCard from '../components/TaskCard.jsx';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('limit', limit);
    if (filters.status) params.set('status', filters.status);
    if (filters.priority) params.set('priority', filters.priority);
    if (filters.search) params.set('search', filters.search);
    return params.toString();
  }, [filters, page, limit]);

  const fetchTasks = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.get(`/tasks?${queryString}`);
      setTasks(res.data.data.tasks || []);
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to fetch tasks' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
      };
      await api.post('/tasks', payload);
      setForm({ title: '', description: '', status: 'pending', priority: 'medium', dueDate: '', tags: '' });
      await fetchTasks();
      setMsg({ type: 'success', text: 'Task created' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to create task' });
    }
  };

  const handleEdit = async (task) => {
    const next = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
    try {
      await api.put(`/tasks/${task._id}`, { status: next });
      await fetchTasks();
      setMsg({ type: 'success', text: 'Task updated' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to update task' });
    }
  };

  const handleDelete = async (task) => {
    try {
      await api.delete(`/tasks/${task._id}`);
      await fetchTasks();
      setMsg({ type: 'success', text: 'Task deleted' });
    } catch (err) {
      setMsg({ type: 'error', text: err?.response?.data?.message || 'Failed to delete task' });
    }
  };

  return (
    <div className="container">
      <h2 style={{ marginTop: 10 }}>Your Dashboard</h2>

      {msg && <div className={`msg ${msg.type}`}>{msg.text}</div>}

      <div className="row" style={{ marginTop: 16 }}>
        <div className="card col">
          <h3 style={{ marginTop: 0 }}>Create Task</h3>
          <form onSubmit={handleCreate}>
            <div className="col" style={{ marginBottom: 12 }}>
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col" style={{ marginBottom: 12 }}>
              <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="row">
              <div className="col">
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="pending">pending</option>
                  <option value="in-progress">in-progress</option>
                  <option value="completed">completed</option>
                </select>
              </div>
              <div className="col">
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
              </div>
            </div>

            <div className="col" style={{ marginBottom: 12, marginTop: 12 }}>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>

            <div className="col" style={{ marginBottom: 12 }}>
              <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>

            <button className="primary" type="submit">Create</button>
          </form>
        </div>

        <div className="card col">
          <h3 style={{ marginTop: 0 }}>Filters</h3>
          <div className="row">
            <div className="col" style={{ marginBottom: 12 }}>
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All statuses</option>
                <option value="pending">pending</option>
                <option value="in-progress">in-progress</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div className="col" style={{ marginBottom: 12 }}>
              <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="">All priorities</option>
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </select>
            </div>
          </div>

          <div className="col" style={{ marginBottom: 12 }}>
            <input placeholder="Search title/description" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setPage(1)} type="button">Apply</button>
          </div>

          <div style={{ marginTop: 14, color: 'var(--muted)' }}>Pagination: page {page}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
            <button type="button" onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Your Tasks</h3>
        {loading ? (
          <div style={{ color: 'var(--muted)' }}>Loading...</div>
        ) : tasks.length === 0 ? (
          <div style={{ color: 'var(--muted)' }}>No tasks found.</div>
        ) : (
          tasks.map((t) => <TaskCard key={t._id} task={t} onEdit={handleEdit} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;

