import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, Users, Search, ChevronDown } from 'lucide-react';
import { authService } from '../services/api';
import { getStyles } from './TicketModal.styles';

const TicketModal = ({ isOpen, onClose, onSave, ticket, theme: t, defaultStatus }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', priority: 'Medium', assigned_to: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const isEdit = !!ticket;

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await authService.getUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        category: ticket.category || '',
        priority: ticket.priority || 'Medium',
        status: ticket.status || 'Open',
        assigned_to: Array.isArray(ticket.assignees) ? ticket.assignees.map(u => u.id) : [],
      });
    } else {
      setFormData({ title: '', description: '', category: '', priority: 'Medium', status: defaultStatus || 'Open', assigned_to: [] });
    }
    setError('');
    setDropdownOpen(false);
    setSearchQuery('');
  }, [ticket, isOpen, defaultStatus]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSave(formData, ticket?.id);
      onClose();
    } catch (err) {
      setError('Failed to save ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleToggleUser = (userId) => {
    setFormData((prev) => {
      const current = prev.assigned_to;
      const updated = current.includes(userId)
        ? current.filter(id => id !== userId)
        : [...current, userId];
      return { ...prev, assigned_to: updated };
    });
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAssigneeLabel = () => {
    const selectedCount = formData.assigned_to.length;
    if (selectedCount === 0) return 'Select assignees';
    if (selectedCount === 1) {
      const u = users.find(x => x.id === formData.assigned_to[0]);
      return u ? u.name : '1 selected';
    }
    return `${selectedCount} assignees selected`;
  };

  const s = getStyles(t, isEdit, loading);

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <div style={s.header}>
          <h2 style={s.title}>{isEdit ? 'Edit Ticket' : 'New Ticket'}</h2>
          <button onClick={onClose} style={s.closeBtn}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {error && (
            <div style={s.error}>{error}</div>
          )}

          <div style={s.formGroup}>
            <label style={s.label}>Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required placeholder="What needs to be done?" style={s.input} />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Add more details..." rows={3}
              style={{ ...s.input, resize: 'vertical', minHeight: '60px' }} />
          </div>

          <div style={s.grid}>
            <div>
              <label style={s.label}>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required style={s.input}>
                <option value="">Select</option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Network">Network</option>
                <option value="Email">Email</option>
                <option value="Printer">Printer</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleChange} required style={s.input}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {isEdit && (
            <div style={s.formGroup}>
              <label style={s.label}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} style={s.input}>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}

          {/* Assign Multiple Users (Searchable Dropdown) */}
          <div style={s.assigneesSection} ref={dropdownRef}>
            <label style={{ ...s.label, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={14} /> Assign To (Multiple)
            </label>
            <div style={s.dropdownTrigger} onClick={() => setDropdownOpen(!dropdownOpen)}>
              <span>{getAssigneeLabel()}</span>
              <ChevronDown size={16} style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>

            {dropdownOpen && (
              <div style={s.dropdownMenu}>
                <div style={s.dropdownSearchWrapper}>
                  <Search size={13} style={s.dropdownSearchIcon} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    style={s.dropdownSearchInput}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div style={s.dropdownList}>
                  {filteredUsers.map((u) => {
                    const isSelected = formData.assigned_to.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        onClick={() => handleToggleUser(u.id)}
                        style={s.dropdownItem(isSelected)}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '380px' }}>
                          {u.name} ({u.email})
                        </span>
                        {isSelected && <span style={{ fontSize: '10px', fontWeight: 'bold' }}>✓</span>}
                      </div>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <div style={{ padding: '8px 10px', fontSize: '12px', color: t.text.tertiary, fontStyle: 'italic', textAlign: 'center' }}>
                      No matching users
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={s.buttonGroup}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={s.submitBtn}>
              {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;
