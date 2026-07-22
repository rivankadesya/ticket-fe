import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService, commentService } from '../../services/api';
import styles from './styles';

const TicketDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      const response = await ticketService.getTicketById(id);
      setTicket(response.data.ticket);
      setComments(response.data.comments);
      setEditData(response.data.ticket);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await commentService.addComment(id, newComment);
      setNewComment('');
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to add comment');
      console.error(err);
    }
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ticketService.updateTicket(id, {
        title: editData.title,
        description: editData.description,
        category: editData.category,
        priority: editData.priority,
        status: editData.status,
      });
      setEditMode(false);
      fetchTicketDetails();
    } catch (err) {
      setError('Failed to update ticket');
      console.error(err);
    } finally {
      setSubmitting(false);
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
  if (!ticket) return <div style={styles.loader}>Ticket not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>Ticket Details</h1>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.content}>
        <div style={styles.ticketInfo}>
          {!editMode ? (
            <>
              <div style={styles.infoGroup}>
                <h2 style={styles.ticketTitle}>{ticket.title}</h2>
              </div>

              <div style={styles.grid}>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Status</label>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: statusColor(ticket.status),
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Priority</label>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: priorityColor(ticket.priority),
                    }}
                  >
                    {ticket.priority}
                  </span>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Category</label>
                  <p style={styles.value}>{ticket.category}</p>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Assigned To</label>
                  <p style={styles.value}>{ticket.assigned_to_name || 'Unassigned'}</p>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Created By</label>
                  <p style={styles.value}>{ticket.created_by_name}</p>
                </div>
                <div style={styles.infoGroup}>
                  <label style={styles.label}>Created Date</label>
                  <p style={styles.value}>
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div style={styles.infoGroup}>
                <label style={styles.label}>Description</label>
                <p style={styles.description}>{ticket.description || 'No description'}</p>
              </div>

              <button
                onClick={() => setEditMode(true)}
                style={styles.editBtn}
              >
                Edit Ticket
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdateTicket} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  style={styles.textarea}
                  rows="4"
                />
              </div>

              <div style={styles.grid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    style={styles.select}
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Network">Network</option>
                    <option value="Email">Email</option>
                    <option value="Printer">Printer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Priority</label>
                  <select
                    value={editData.priority}
                    onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    style={styles.select}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Status</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    style={styles.select}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    ...styles.saveBtn,
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setEditData(ticket);
                  }}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div style={styles.commentsSection}>
          <h3 style={styles.commentsTitle}>Comments ({comments.length})</h3>

          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              style={styles.commentInput}
              rows="3"
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              style={styles.commentBtn}
            >
              Post Comment
            </button>
          </form>

          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment.id} style={styles.commentItem}>
                <div style={styles.commentHeader}>
                  <strong style={styles.commentAuthor}>{comment.user_name}</strong>
                  <span style={styles.commentDate}>
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                <p style={styles.commentText}>{comment.comment}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p style={styles.noComments}>No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailComponent;
