import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ticketService } from '../../services/api';
import styles from './styles';

const DashboardComponent = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    fetchData();
  }, [filterStatus, filterPriority]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const metricsRes = await ticketService.getDashboardMetrics();
      setMetrics(metricsRes.data.metrics);

      const filters = {};
      if (filterStatus) filters.status = filterStatus;
      if (filterPriority) filters.priority = filterPriority;

      const ticketsRes = await ticketService.getTickets(filters);
      setTickets(ticketsRes.data.tickets);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await ticketService.deleteTicket(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete ticket');
      }
    }
  };

  const priorityColor = (priority) => {
    const colors = {
      Low: '#28a745',
      Medium: '#ffc107',
      High: '#fd7e14',
      Critical: '#dc3545',
    };
    return colors[priority] || '#6c757d';
  };

  const statusColor = (status) => {
    const colors = {
      Open: '#007bff',
      'In Progress': '#ffc107',
      Resolved: '#28a745',
      Closed: '#6c757d',
    };
    return colors[status] || '#6c757d';
  };

  if (loading) return <div style={styles.loader}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>IT Support Ticket Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {metrics && (
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{metrics.total_tickets}</div>
            <div style={styles.metricLabel}>Total Tickets</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{metrics.open_tickets}</div>
            <div style={styles.metricLabel}>Open Tickets</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{metrics.in_progress_tickets}</div>
            <div style={styles.metricLabel}>In Progress</div>
          </div>
          <div style={styles.metricCard}>
            <div style={styles.metricValue}>{metrics.high_priority_tickets}</div>
            <div style={styles.metricLabel}>High Priority</div>
          </div>
        </div>
      )}

      <div style={styles.actionsBar}>
        <button
          onClick={() => navigate('/create-ticket')}
          style={styles.createBtn}
        >
          + Create Ticket
        </button>
        <div style={styles.filters}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      <div style={styles.ticketsTable}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Category</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Assigned To</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} style={styles.row}>
                <td style={styles.td}>{ticket.title}</td>
                <td style={styles.td}>{ticket.category}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: priorityColor(ticket.priority),
                  }}>
                    {ticket.priority}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: statusColor(ticket.status),
                  }}>
                    {ticket.status}
                  </span>
                </td>
                <td style={styles.td}>{ticket.assigned_to_name || 'Unassigned'}</td>
                <td style={styles.td}>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                    style={styles.viewBtn}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && (
          <div style={styles.noData}>No tickets found</div>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
