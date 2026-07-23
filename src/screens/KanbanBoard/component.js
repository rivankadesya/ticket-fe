import React, { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ticketService } from '../../services/api';
import KanbanColumn from '../../components/KanbanColumn';
import KanbanCard from '../../components/KanbanCard';
import { useTheme } from '../../store/themeStore';
import { lightTheme, darkTheme } from '../../theme';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const { isDark, toggleTheme } = useTheme();

  const theme = isDark ? darkTheme : lightTheme;
  const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await ticketService.getTickets();
      setTickets(response.data.tickets || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeTicket = tickets.find((t) => t.id === active.id);
    if (!activeTicket) return;

    const newStatus = over.data.current?.status;
    if (!newStatus || newStatus === activeTicket.status) return;

    try {
      await ticketService.updateTicket(activeTicket.id, {
        status: newStatus,
      });

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === activeTicket.id
            ? { ...ticket, status: newStatus }
            : ticket
        )
      );
    } catch (error) {
      console.error('Failed to update ticket:', error);
      fetchTickets();
    }
  };

  const getTicketsByStatus = (status) =>
    tickets.filter((ticket) => ticket.status === status);

  if (loading) {
    return (
      <div style={{ ...styles.container(theme), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={styles.spinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container(theme)}>
      <div style={styles.header(theme)}>
        <div>
          <h1 style={styles.title(theme)}>📋 Ticket Board</h1>
          <p style={styles.subtitle(theme)}>Drag and drop to organize your tickets</p>
        </div>
        <button
          onClick={toggleTheme}
          style={styles.themeToggle(theme)}
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={styles.boardWrapper}>
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tickets={getTicketsByStatus(status)}
              theme={theme}
            />
          ))}
        </div>
        <DragOverlay>
          {activeId && (
            <KanbanCard
              ticket={tickets.find((t) => t.id === activeId)}
              isDragging
              theme={theme}
            />
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const styles = {
  container: (theme) => ({
    padding: '24px',
    minHeight: '100vh',
    backgroundColor: theme.bg.primary,
    color: theme.text.primary,
    transition: 'background-color 0.3s ease, color 0.3s ease',
  }),
  header: (theme) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: `2px solid ${theme.border}`,
  }),
  title: (theme) => ({
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: theme.text.primary,
  }),
  subtitle: (theme) => ({
    fontSize: '14px',
    color: theme.text.secondary,
    margin: 0,
  }),
  themeToggle: (theme) => ({
    padding: '10px 20px',
    borderRadius: '8px',
    border: `2px solid ${theme.border}`,
    backgroundColor: theme.bg.secondary,
    color: theme.text.primary,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 2px 8px ${theme.shadow}`,
  }),
  boardWrapper: {
    display: 'flex',
    gap: '24px',
    overflowX: 'auto',
    paddingBottom: '16px',
  },
  spinner: {
    fontSize: '18px',
    fontWeight: '600',
  },
};

export default KanbanBoard;
