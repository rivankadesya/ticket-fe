import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Pencil, Trash2 } from 'lucide-react';
import { priorityColors } from '../theme';
import Text from './Text';

const MiniAvatar = ({ name }) => {
  const initials = (name || '?').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316'];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div style={{
      width: '20px', height: '20px', borderRadius: '50%', backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontSize: '8px', fontWeight: '700', color: '#fff', border: '1.5px solid #fff',
      marginLeft: '-4px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    }} title={name}>{initials}</div>
  );
};

const KanbanCard = ({ ticket, isDragging, theme: t, onEdit, onDelete, onDetail }) => {
  const {
    attributes, listeners, setNodeRef, transform,
    isDragging: isSortableDragging,
  } = useSortable({ id: ticket.id });

  const handleCardClick = (e) => {
    if (e.target.closest('button')) {
      return;
    }
    if (onDetail) {
      onDetail(ticket);
    }
  };

  const style = {
    transform: isDragging 
      ? `${CSS.Transform.toString(transform)} rotate(3deg) scale(1.02)` 
      : CSS.Transform.toString(transform),
    opacity: isSortableDragging ? 0 : 1,
    backgroundColor: t.bg.primary,
    border: `1.5px solid ${isDragging ? t.accent : t.border}`,
    borderLeft: `4px solid ${priorityColors[ticket.priority]}`, // Colored left border for priority level
    borderRadius: '12px',
    padding: '14px',
    boxShadow: isDragging 
      ? '0 15px 30px rgba(0, 0, 0, 0.15)' 
      : t.shadow,
    cursor: isDragging ? 'grabbing' : 'grab',
    transition: isDragging ? 'none' : 'transform 0.15s ease, border-color 0.2s, box-shadow 0.2s',
    userSelect: 'none',
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCardClick}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        if (!isDragging && !isSortableDragging) {
          e.currentTarget.style.borderColor = t.accent;
          e.currentTarget.style.boxShadow = t.shadowMd;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging && !isSortableDragging) {
          e.currentTarget.style.borderColor = t.border;
          e.currentTarget.style.boxShadow = t.shadow;
        }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
              backgroundColor: priorityColors[ticket.priority],
            }} />
            <Text variant="caption" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: priorityColors[ticket.priority] }}>
              {ticket.priority}
            </Text>
          </div>
          <Text variant="mono" style={{ color: t.text.tertiary }}>
            #{ticket.id.slice(0, 8).toUpperCase()}
          </Text>
        </div>

        <Text variant="h4" style={{ color: t.text.primary, wordBreak: 'break-word' }}>
          {ticket.title}
        </Text>

        {ticket.description && (
          <Text variant="bodySm" style={{
            color: t.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {ticket.description}
          </Text>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: `1px solid ${t.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Text variant="caption" style={{
              color: t.text.secondary, backgroundColor: t.bg.tertiary, padding: '2px 8px', borderRadius: '6px',
            }}>
              {ticket.category}
            </Text>
            <div style={{ display: 'flex', paddingLeft: '4px' }}>
              {Array.isArray(ticket.assignees) && ticket.assignees.map((assignee) => (
                <MiniAvatar key={assignee.id} name={assignee.name} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {onEdit && (
              <button onClick={() => onEdit(ticket)} style={{
                width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                backgroundColor: 'transparent', color: t.text.tertiary,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = t.accent}
                onMouseLeave={(e) => e.currentTarget.style.color = t.text.tertiary}
              ><Pencil size={12} /></button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(ticket.id)} style={{
                width: '26px', height: '26px', borderRadius: '6px', border: 'none',
                backgroundColor: 'transparent', color: t.text.tertiary,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = t.danger}
                onMouseLeave={(e) => e.currentTarget.style.color = t.text.tertiary}
              ><Trash2 size={12} /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
