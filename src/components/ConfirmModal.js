import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Text from './Text';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, theme: t }) => {
  if (!isOpen) return null;

  const btnBase = {
    flex: 1, padding: '11px', borderRadius: '10px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
    fontFamily: 'inherit',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
      padding: '20px', animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div style={{
        width: '100%', maxWidth: '400px', backgroundColor: t.bg.secondary,
        borderRadius: '16px', border: `1px solid ${t.border}`,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderBottom: `1px solid ${t.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.danger }}>
            <AlertTriangle size={18} />
            <Text variant="h4" style={{ fontWeight: '700' }}>{title || 'Confirmation'}</Text>
          </div>
          <button onClick={onClose} style={{
            width: '28px', height: '28px', borderRadius: '8px', border: 'none',
            backgroundColor: t.bg.tertiary, color: t.text.secondary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={14} />
          </button>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <Text variant="body" style={{ color: t.text.secondary }}>{message || 'Are you sure you want to perform this action?'}</Text>
        </div>

        <div style={{ display: 'flex', gap: '10px', padding: '0 24px 20px' }}>
          <button onClick={onClose} style={{
            ...btnBase, border: `1.5px solid ${t.border}`,
            backgroundColor: 'transparent', color: t.text.secondary,
          }}>
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} style={{
            ...btnBase, border: 'none',
            backgroundColor: t.danger, color: '#fff',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
          }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
