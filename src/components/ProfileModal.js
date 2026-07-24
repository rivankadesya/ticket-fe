import React, { useState } from 'react';
import { X, User, Lock, Save, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

const ProfileModal = ({ isOpen, onClose, user, theme: t, isDark, onUpdate }) => {
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setName(user?.name || '');
      setCurrentPassword('');
      setNewPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setError('Name is required'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await authService.updateProfile(name.trim());
      setSuccess('Profile updated successfully');
      onUpdate(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally { setLoading(false); }
  };

  const s = {
    backdrop: { position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', padding: '20px' },
    modal: { width: '100%', maxWidth: '440px', backgroundColor: t.bg.secondary, borderRadius: '16px', border: `1px solid ${t.border}`, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' },
    headerBar: { height: '4px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' },
    headerTitle: { fontSize: '17px', fontWeight: '700', color: t.text.primary, letterSpacing: '-0.3px' },
    closeBtn: { width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.bg.tertiary, color: t.text.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
    body: { padding: '20px 24px 24px' },
    tabs: { display: 'flex', gap: '4px', backgroundColor: t.bg.primary, borderRadius: '10px', padding: '4px', marginBottom: '20px' },
    tab: (active) => ({ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: active ? t.accent : 'transparent', color: active ? '#fff' : t.text.secondary, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s' }),
    formGroup: { marginBottom: '14px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', color: t.text.secondary, marginBottom: '5px' },
    input: { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${t.border}`, backgroundColor: isDark ? '#0f172a' : '#f8fafc', color: t.text.primary, fontSize: '13px', fontWeight: '500', boxSizing: 'border-box', fontFamily: 'inherit' },
    error: { padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: t.danger, fontSize: '13px', fontWeight: '500' },
    success: { padding: '10px 14px', borderRadius: '10px', marginBottom: '12px', backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: t.success, fontSize: '13px', fontWeight: '500' },
    btn: (load) => ({ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', backgroundColor: t.accent, color: '#fff', fontSize: '13px', fontWeight: '600', cursor: load ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: load ? 0.7 : 1, fontFamily: 'inherit' }),
    info: { padding: '16px', borderRadius: '12px', backgroundColor: t.bg.primary, border: `1px solid ${t.border}`, marginBottom: '16px' },
    infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: t.text.secondary, marginBottom: '8px' },
    infoLabel: { fontWeight: '500', color: t.text.tertiary },
    infoValue: { fontWeight: '600', color: t.text.primary },
  };

  return (
    <div style={s.backdrop} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.headerBar} />
        <div style={s.header}>
          <span style={s.headerTitle}>Account Settings</span>
          <button onClick={onClose} style={s.closeBtn}><X size={16} /></button>
        </div>
        <div style={s.body}>
          <div style={s.info}>
            <div style={s.infoRow}><span style={s.infoLabel}>Email</span><span style={s.infoValue}>{user?.email}</span></div>
            <div style={{ ...s.infoRow, marginBottom: 0 }}><span style={s.infoLabel}>Role</span><span style={s.infoValue}>{user?.role}</span></div>
          </div>

          <div style={s.tabs}>
            <button style={s.tab(tab === 'profile')} onClick={() => setTab('profile')}><User size={14} /> Profile</button>
            <button style={s.tab(tab === 'password')} onClick={() => setTab('password')}><Lock size={14} /> Password</button>
          </div>

          {error && <div style={s.error}>{error}</div>}
          {success && <div style={s.success}>{success}</div>}

          {tab === 'profile' && (
            <form onSubmit={handleProfile}>
              <div style={s.formGroup}>
                <label style={s.label}>Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={s.input} />
              </div>
              <button type="submit" disabled={loading} style={s.btn(loading)}>
                {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          )}

          {tab === 'password' && (
            <form onSubmit={handlePassword}>
              <div style={s.formGroup}>
                <label style={s.label}>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Enter current password" style={s.input} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" style={s.input} />
              </div>
              <button type="submit" disabled={loading} style={s.btn(loading)}>
                {loading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={15} />}
                {loading ? 'Saving...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;