import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Loader2, Users, Search, ChevronDown, FileText, ChevronRight } from 'lucide-react';
import { authService } from '../services/api';
import { getStyles } from './TicketModal.styles';

const priorityDot = { Low: '#22c55e', Medium: '#eab308', High: '#f97316', Critical: '#ef4444' };

const TicketModal = ({ isOpen, onClose, onSave, ticket, theme: t, defaultStatus }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: '', priority: 'Medium', assigned_to: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [prioOpen, setPrioOpen] = useState(false);
  const [statOpen, setStatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const catRef = useRef(null);
  const prioRef = useRef(null);
  const statRef = useRef(null);
  const isEdit = !!ticket;

  useEffect(() => {
    if (isOpen) fetchUsers();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
      if (catRef.current && !catRef.current.contains(event.target)) setCatOpen(false);
      if (prioRef.current && !prioRef.current.contains(event.target)) setPrioOpen(false);
      if (statRef.current && !statRef.current.contains(event.target)) setStatOpen(false);
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
  const displayedUsers = searchQuery ? filteredUsers : filteredUsers.slice(0, 5);
  const hasMore = !searchQuery && filteredUsers.length > 5;

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
        <div style={s.headerBar} />
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>
              {isEdit ? <FileText size={17} /> : <ChevronRight size={17} />}
            </div>
            <div>
              <h2 style={s.title}>{isEdit ? 'Edit Ticket' : 'New Ticket'}</h2>
              <div style={s.subtitle}>{isEdit ? 'Update ticket details' : 'Create a new support ticket'}</div>
            </div>
          </div>
          <button onClick={onClose} style={s.closeBtn}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={s.form}>
          {error && <div style={s.error}>{error}</div>}

          <div style={s.sectionCard}>
            <div style={s.sectionLabel}>
              <FileText size={13} /> Details
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required placeholder="What needs to be done?" style={s.input} />
            </div>
            <div style={s.formGroupLast}>
              <label style={s.label}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the issue in detail..." rows={3} style={s.textarea} />
            </div>
          </div>

          <div style={s.sectionCard}>
            <div style={s.sectionLabel}>
              <ChevronRight size={13} /> Classification
            </div>
            <div style={s.grid}>
              <div style={s.formGroup}>
                <label style={s.label}>Category *</label>
                <div style={s.selectWrapper} ref={catRef}>
                  <div style={s.selectTrigger} onClick={() => { setCatOpen(!catOpen); setPrioOpen(false); setDropdownOpen(false); }}>
                    <span style={{ color: formData.category ? undefined : t.text.tertiary, fontWeight: formData.category ? '500' : '400' }}>
                      {formData.category || 'Select'}
                    </span>
                    <ChevronDown size={14} style={{ color: t.text.tertiary, transition: 'transform 0.2s', transform: catOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </div>
                  {catOpen && (
                    <div style={s.selectMenu}>
                      {['Hardware', 'Software', 'Network', 'Email', 'Printer', 'Other'].map((opt) => (
                        <div key={opt} style={s.selectOption(formData.category === opt)} onClick={() => { setFormData(prev => ({ ...prev, category: opt })); setCatOpen(false); }}>
                          <div style={s.selectOptionDot('#6366f1')} />
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Priority *</label>
                <div style={s.selectWrapper} ref={prioRef}>
                  <div style={s.selectTrigger} onClick={() => { setPrioOpen(!prioOpen); setCatOpen(false); setDropdownOpen(false); }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {formData.priority && <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: priorityDot[formData.priority] }} />}
                      {formData.priority}
                    </span>
                    <ChevronDown size={14} style={{ color: t.text.tertiary, transition: 'transform 0.2s', transform: prioOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </div>
                  {prioOpen && (
                    <div style={s.selectMenu}>
                      {Object.entries(priorityDot).map(([label, color]) => (
                        <div key={label} style={s.selectOption(formData.priority === label)} onClick={() => { setFormData(prev => ({ ...prev, priority: label })); setPrioOpen(false); }}>
                          <div style={s.selectOptionDot(color)} />
                          {label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isEdit && (
              <div style={{ ...s.formGroup, marginBottom: 0, marginTop: '12px' }}>
                <label style={s.label}>Status</label>
                <div style={s.selectWrapper} ref={statRef}>
                  <div style={s.selectTrigger} onClick={() => { setStatOpen(!statOpen); setCatOpen(false); setPrioOpen(false); setDropdownOpen(false); }}>
                    {formData.status}
                    <ChevronDown size={14} style={{ color: t.text.tertiary, transition: 'transform 0.2s', transform: statOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </div>
                  {statOpen && (
                    <div style={s.selectMenu}>
                      {['Open', 'In Progress', 'Resolved', 'Closed'].map((opt) => (
                        <div key={opt} style={s.selectOption(formData.status === opt)} onClick={() => { setFormData(prev => ({ ...prev, status: opt })); setStatOpen(false); }}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {isEdit && formData.status && (
            <div style={{ ...s.sectionCard, marginBottom: '20px' }}>
              <div style={s.sectionLabel}>
                <Users size={13} /> Assignees
              </div>
              <div style={s.assigneesSection} ref={dropdownRef}>
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
                      {displayedUsers.map((u) => {
                        const isSelected = formData.assigned_to.includes(u.id);
                        return (
                          <div
                            key={u.id}
                            onClick={() => handleToggleUser(u.id)}
                            style={s.dropdownItem(isSelected)}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                backgroundColor: t.bg.tertiary, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '9px', fontWeight: '700',
                                color: t.text.secondary, flexShrink: 0,
                              }}>
                                {(u.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {u.name}
                              </span>
                            </span>
                            {isSelected && <span style={{ fontSize: '11px', fontWeight: 'bold', color: t.accent }}>✓</span>}
                          </div>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <div style={{ padding: '12px', fontSize: '12px', color: t.text.tertiary, fontStyle: 'italic', textAlign: 'center' }}>
                          No matching users
                        </div>
                      )}
                      {hasMore && (
                        <div style={{ padding: '8px 10px', fontSize: '11px', color: t.text.tertiary, textAlign: 'center', borderTop: `1px solid ${t.border}`, marginTop: '4px' }}>
                          Type to search more users...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isEdit && (
            <div style={{ ...s.sectionCard, marginBottom: '20px' }}>
              <div style={s.sectionLabel}>
                <Users size={13} /> Assignees
              </div>
              <div style={s.assigneesSection} ref={dropdownRef}>
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
                      {displayedUsers.map((u) => {
                        const isSelected = formData.assigned_to.includes(u.id);
                        return (
                          <div
                            key={u.id}
                            onClick={() => handleToggleUser(u.id)}
                            style={s.dropdownItem(isSelected)}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                backgroundColor: t.bg.tertiary, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', fontSize: '9px', fontWeight: '700',
                                color: t.text.secondary, flexShrink: 0,
                              }}>
                                {(u.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                              </div>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {u.name}
                              </span>
                            </span>
                            {isSelected && <span style={{ fontSize: '11px', fontWeight: 'bold', color: t.accent }}>✓</span>}
                          </div>
                        );
                      })}
                      {filteredUsers.length === 0 && (
                        <div style={{ padding: '12px', fontSize: '12px', color: t.text.tertiary, fontStyle: 'italic', textAlign: 'center' }}>
                          No matching users
                        </div>
                      )}
                      {hasMore && (
                        <div style={{ padding: '8px 10px', fontSize: '11px', color: t.text.tertiary, textAlign: 'center', borderTop: `1px solid ${t.border}`, marginTop: '4px' }}>
                          Type to search more users...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div style={s.buttonGroup}>
            <button type="button" onClick={onClose} style={s.cancelBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={s.submitBtn}>
              {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
              {loading ? 'Saving...' : isEdit ? 'Update Ticket' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;