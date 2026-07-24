import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Circle, Loader, CheckCircle, Archive, Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { statusColors } from '../theme';
import Text from './Text';

const statusIcons = {
  Open: Circle,
  'In Progress': Loader,
  Resolved: CheckCircle,
  Closed: Archive,
};

const KanbanColumn = ({ status, tickets, theme: t, onEdit, onDelete, onDetail, onAdd }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}`, data: { status } });
  const Icon = statusIcons[status] || Circle;

  return (
    <div ref={setNodeRef} style={{
      minWidth: '280px', flex: 1, backgroundColor: t.bg.secondary,
      borderRadius: '14px', border: `1.5px solid ${isOver ? statusColors[status] : t.border}`,
      padding: '16px', boxShadow: isOver ? `0 0 0 3px ${statusColors[status]}20` : t.shadow,
      display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '14px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icon size={16} color={statusColors[status]} />
          <Text variant="body" style={{ fontWeight: '700', color: t.text.primary }}>{status}</Text>
        </div>
        <Text variant="caption" style={{
          fontWeight: '700', color: t.text.tertiary,
          backgroundColor: t.bg.tertiary, padding: '2px 8px', borderRadius: '10px',
        }}>{tickets.length}</Text>
      </div>

      <SortableContext items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '60px', flex: 1 }}>
          {tickets.length === 0 ? (
            <Text variant="bodySm" style={{
              textAlign: 'center', color: t.text.tertiary, padding: '24px 8px',
              border: `1.5px dashed ${t.border}`, borderRadius: '10px', display: 'block',
            }}>
              Drop tickets here
            </Text>
          ) : (
            tickets.map((ticket) => (
              <KanbanCard key={ticket.id} ticket={ticket} theme={t} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} />
            ))
          )}
        </div>
      </SortableContext>

      <button onClick={() => onAdd?.(status)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        width: '100%', marginTop: '12px', padding: '8px', borderRadius: '10px',
        border: `1.5px dashed ${t.border}`, backgroundColor: 'transparent',
        color: t.text.tertiary, fontSize: '12px', fontWeight: '600',
        cursor: 'pointer', transition: 'all 0.2s',
      }}>
        <Plus size={14} /> Add Ticket
      </button>
    </div>
  );
};

export default KanbanColumn;
