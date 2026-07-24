import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { ticketService } from '../../services/api';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';
import { getStyles } from './styles';

const CreateTicketComponent = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const s = getStyles(t, isDark);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    assigned_to: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    document.body.style.backgroundColor = t.bg.primary;
  }, [isDark]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await ticketService.createTicket({
        ...formData,
        assigned_to: formData.assigned_to || null,
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const scrollbarColor = isDark ? '#334155' : '#cbd5e1';
  const scrollbarBg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <div style={s.container}>
      <style>{`
        .create-ticket-textarea::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .create-ticket-textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        .create-ticket-textarea::-webkit-scrollbar-thumb {
          background: ${scrollbarColor};
          border-radius: 3px;
        }
        .create-ticket-textarea::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#475569' : '#94a3b8'};
        }
        .create-ticket-card ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .create-ticket-card ::-webkit-scrollbar-track {
          background: transparent;
        }
        .create-ticket-card ::-webkit-scrollbar-thumb {
          background: ${scrollbarColor};
          border-radius: 3px;
        }
        .create-ticket-card ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#475569' : '#94a3b8'};
        }
      `}</style>
      <div className="create-ticket-card" style={s.card}>
        <button onClick={() => navigate('/dashboard')} style={s.backBtn}>
          <ArrowLeft size={14} style={{ marginRight: 6 }} />
          Back
        </button>
        <h1 style={s.title}>Create New Ticket</h1>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.formGroup}>
            <label style={s.label}>Title *</label>
            <input
              type="text" name="title" value={formData.title}
              onChange={handleChange} required
              placeholder="Enter ticket title" style={s.input}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Description</label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} placeholder="Describe the issue"
              className="create-ticket-textarea" style={s.textarea} rows="5"
            />
          </div>

          <div style={s.row}>
            <div style={s.formGroup}>
              <label style={s.label}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required style={s.select}>
                <option value="">Select category</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Email">Email</option>
                <option value="Printer">Printer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} required style={s.select}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Assign To (optional)</label>
            <input
              type="text" name="assigned_to" value={formData.assigned_to}
              onChange={handleChange} placeholder="User ID or leave empty"
              style={s.input}
            />
          </div>

          <div style={s.buttonGroup}>
            <button type="submit" disabled={loading} style={{ ...s.submitBtn, opacity: loading ? 0.6 : 1 }}>
              <Plus size={16} style={{ marginRight: 6 }} />
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} style={s.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketComponent;