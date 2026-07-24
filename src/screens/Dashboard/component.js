import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  LayoutGrid,
  List,
  Plus,
  Sun,
  Moon,
  LogOut,
  Search,
  Filter,
  Ticket,
  Clock,
  Pencil,
  Trash2,
  MessageSquare,
  Send,
  X,
  Hash,
  Users,
  Inbox,
  CheckCircle2,
  ArrowDown,
  AlertCircle,
  Zap,
  Flame,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { ticketService, commentService, authService } from "../../services/api";
import { connectSocket, disconnectSocket, onEvent, offEvent } from "../../services/socket";
import DateRangePicker from "../../components/DateRangePicker";
import KanbanColumn from '../../components/KanbanColumn';
import KanbanCard from '../../components/KanbanCard';
import TicketModal from '../../components/TicketModal';
import ConfirmModal from '../../components/ConfirmModal';
import ProfileModal from '../../components/ProfileModal';
import Text from '../../components/Text';
import { useTheme } from "../../store/themeStore";
import { useDebounce } from "use-debounce";
import {
  lightTheme,
  darkTheme,
  priorityColors,
  statusColors,
} from "../../theme";
import { getStyles } from "./styles";

const Avatar = ({ name, size = 28 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const colors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#06b6d4",
    "#f97316",
  ];
  const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: size * 0.38,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: "-0.5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      {initials}
    </div>
  );
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

const DashboardComponent = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState([]);
  const [filterPriority, setFilterPriority] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [activeId, setActiveId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTicket, setEditTicket] = useState(null);
  const [detailTicket, setDetailTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [activeMenu, setActiveMenu] = useState("tickets"); // "tickets" or "users"
  const [defaultStatus, setDefaultStatus] = useState(null);
  const [users, setUsers] = useState([]);
const [profileOpen, setProfileOpen] = useState(false);

  const [debouncedSearch] = useDebounce(searchQuery, 300);

  const dateRangeRef = useRef(dateRange);
  dateRangeRef.current = dateRange;

  const { isDark, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  const t = isDark ? darkTheme : lightTheme;
  const statuses = ["Open", "In Progress", "Resolved", "Closed"];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    document.body.style.backgroundColor = t.bg.primary;
  }, [isDark, t.bg.primary]);

  useEffect(() => () => disconnectSocket(), []);

  useEffect(() => {
    fetchData(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (metrics) fetchData(false, dateRange);
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connectSocket();

    const ticketCb = () => fetchData(false, dateRangeRef.current);
    onEvent('tickets:created', ticketCb);
    onEvent('tickets:updated', ticketCb);
    onEvent('tickets:deleted', ticketCb);

    return () => {
      offEvent('tickets:created', ticketCb);
      offEvent('tickets:updated', ticketCb);
      offEvent('tickets:deleted', ticketCb);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (detailTicket) {
      fetchComments(detailTicket.id);
      const cb = () => fetchComments(detailTicket.id);
      onEvent('comments:added', cb);
      return () => offEvent('comments:added', cb);
    }
  }, [detailTicket]); // eslint-disable-line react-hooks/exhaustive-deps

  const fmtDate = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  const fetchData = async (showLoader = false, forcedDates) => {
    if (showLoader) setLoading(true);
    try {
      const [start, end] = forcedDates || dateRange;
      const ticketParams = {};
      if (start) ticketParams.dateFrom = fmtDate(start);
      if (end) ticketParams.dateTo = fmtDate(end);

      const [metricsRes, ticketsRes, usersRes] = await Promise.all([
        ticketService.getDashboardMetrics(),
        ticketService.getTickets(ticketParams),
        authService.getUsers(),
      ]);
      setMetrics(metricsRes.data.metrics);
      setTickets(ticketsRes.data.tickets || []);
      setUsers(usersRes.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  const fetchComments = async (ticketId) => {
    try {
      const res = await commentService.getComments(ticketId);
      setComments(res.data.comments || []);
    } catch (err) {
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !detailTicket) return;
    setCommentLoading(true);
    try {
      await commentService.addComment(detailTicket.id, newComment);
      setNewComment("");
      fetchComments(detailTicket.id);
    } catch (err) {
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleSave = async (formData, id) => {
    if (id) await ticketService.updateTicket(id, formData);
    else await ticketService.createTicket(formData);
    fetchData(false);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await ticketService.deleteTicket(deleteId);
      if (detailTicket?.id === deleteId) setDetailTicket(null);
      fetchData(false);
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const openCreate = () => {
    setEditTicket(null);
    setDefaultStatus(null);
    setModalOpen(true);
  };
  const openCreateWithStatus = (status) => {
    setEditTicket(null);
    setDefaultStatus(status);
    setModalOpen(true);
  };
  const openEdit = (ticket) => {
    setEditTicket(ticket);
    setModalOpen(true);
  };
  const openDetail = (ticket) => {
    setDetailTicket(ticket);
    setComments([]);
    setNewComment("");
  };

  const handleDragStart = (e) => setActiveId(e.active.id);
  const handleDragEnd = async (e) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;
    const ticket = tickets.find((tk) => tk.id === active.id);
    if (!ticket) return;

    let newStatus = over.data.current?.status;
    if (!newStatus) {
      const targetTicket = tickets.find((tk) => tk.id === over.id);
      if (targetTicket) {
        newStatus = targetTicket.status;
      }
    }

    if (!newStatus || newStatus === ticket.status) return;

    try {
      await ticketService.updateTicket(ticket.id, { status: newStatus });
      setTickets((prev) =>
        prev.map((tk) =>
          tk.id === ticket.id ? { ...tk, status: newStatus } : tk,
        ),
      );
      // Recalculate metrics in real-time immediately
      fetchData(false);
    } catch (err) {
      fetchData(false);
    }
  };

  const filtered = tickets.filter(
    (tk) => {
      const matchSearch = !debouncedSearch ||
        tk.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        tk.category?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (tk.description &&
          tk.description.toLowerCase().includes(debouncedSearch.toLowerCase()));
      const matchStatus = filterStatus.length === 0 || filterStatus.includes(tk.status);
      const matchPriority = filterPriority.length === 0 || filterPriority.includes(tk.priority);
      return matchSearch && matchStatus && matchPriority;
    },
  );

  const getByStatus = (status) => filtered.filter((tk) => tk.status === status);
  const totalFiltered = filtered.length;

  const statusItems = metrics
    ? [
        { icon: Inbox, label: "Open", value: metrics.open_tickets, color: "#ef4444" },
        { icon: Clock, label: "In Progress", value: metrics.in_progress_tickets, color: "#f59e0b" },
        { icon: CheckCircle2, label: "Resolved", value: metrics.resolved_tickets, color: "#10b981" },
        { icon: X, label: "Closed", value: metrics.closed_tickets, color: "#6b7280" },
      ]
    : [];

  const priorityItems = metrics
    ? [
        { icon: ArrowDown, label: "Low", value: metrics.low_priority_tickets, color: priorityColors.Low },
        { icon: AlertCircle, label: "Medium", value: metrics.medium_priority_tickets, color: priorityColors.Medium },
        { icon: Zap, label: "High", value: metrics.high_priority_tickets, color: priorityColors.High },
        { icon: Flame, label: "Critical", value: metrics.critical_priority_tickets, color: priorityColors.Critical },
      ]
    : [];

  const s = getStyles(t, isDark, activeId !== null);

  if (loading) {
    return (
      <div style={s.loader}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `2px solid ${t.border}`,
            borderTopColor: t.accent,
            animation: "spin 0.8s linear infinite",
          }}
        />
        <Text style={{ color: t.text.secondary }}>
          Loading your workspace...
        </Text>
      </div>
    );
  }

  return (
    <div style={s.container}>
      {/* Header */}
      <header style={{ ...s.header, padding: isMobile ? "0 12px" : "0 24px" }}>
        <div style={s.headerLeft}>
          <div style={s.headerLogo}>
            <Ticket size={18} color="#fff" />
          </div>
          <Text
            variant="h4"
            style={{ color: t.text.primary, letterSpacing: "-0.3px" }}
          >
            IT Support
          </Text>
        </div>

        <div style={s.headerRight}>
          <button
            onClick={toggleTheme}
            title={isDark ? "Light mode" : "Dark mode"}
            style={s.actionBtn}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <div style={s.divider} />
          <div
            onClick={() => setProfileOpen(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", borderRadius: "8px", padding: "4px 8px 4px 4px", transition: "all 0.15s" }}
          >
            <Avatar name={user?.name} size={32} />
            <Text
              style={{
                color: t.text.primary,
                fontWeight: "600",
              }}
            >
              {user?.name}
            </Text>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            title="Logout"
            style={{
              ...s.actionBtn,
              backgroundColor: "transparent",
              border: "none",
            }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Sub Navigation Bar */}
      <div style={s.subHeader}>
        <div style={s.navTab(activeMenu === "tickets")} onClick={() => setActiveMenu("tickets")}>
          <Ticket size={15} /> Tickets
        </div>
        <div style={s.navTab(activeMenu === "users")} onClick={() => setActiveMenu("users")}>
          <Users size={15} /> Users Directory
        </div>
      </div>

      <main style={{ ...s.main, padding: isMobile ? "12px" : "20px" }}>
        {activeMenu === "tickets" ? (
          <>
            {/* Metrics — compact info card */}
        {metrics && (
          <div style={{ ...s.metricsCard, overflow: isMobile ? "auto" : "hidden" }}>
            <div style={{
              ...s.metricsBody,
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              gap: isMobile ? "12px" : "8px",
              padding: isMobile ? "12px 14px" : "14px 20px",
            }}>
              {/* Hero: Total */}
              <div style={s.metricHero}>
                <Ticket size={16} color={t.accent} />
                <span style={s.metricHeroValue}>{metrics.total_tickets}</span>
                <span style={s.metricHeroLabel}>Total Tickets</span>
              </div>

              <div style={{ ...s.metricDivider, width: isMobile ? "100%" : "1px", height: isMobile ? "1px" : "36px" }} />

              {/* Statuses */}
              <div style={{ ...s.metricGroup, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", padding: isMobile ? "0" : "0 16px" }}>
                <div style={s.metricGroupLabel}>Status</div>
                <div style={s.metricItems}>
                  {statusItems.map((c) => (
                    <div key={c.label} style={s.metricPill}>
                      <c.icon size={11} color={c.color} />
                      <span style={s.metricPillValue}>{c.value}</span>
                      <span style={s.metricPillLabel}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...s.metricDivider, width: isMobile ? "100%" : "1px", height: isMobile ? "1px" : "36px" }} />

              {/* Priorities */}
              <div style={{ ...s.metricGroup, flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", padding: isMobile ? "0" : "0 16px" }}>
                <div style={s.metricGroupLabel}>Priority</div>
                <div style={s.metricItems}>
                  {priorityItems.map((c) => (
                    <div key={c.label} style={s.metricPill}>
                      <c.icon size={11} color={c.color} />
                      <span style={s.metricPillValue}>{c.value}</span>
                      <span style={s.metricPillLabel}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ ...s.metricDivider, width: isMobile ? "100%" : "1px", height: isMobile ? "1px" : "36px" }} />

              {/* Team */}
              <div style={{ ...s.metricTeam, padding: isMobile ? "0" : "0 4px 0 16px" }} onClick={() => setActiveMenu("users")}>
                <Users size={15} color="#ec4899" />
                <span style={s.metricTeamValue}>{metrics.total_users || 0}</span>
                <span style={s.metricTeamLabel}>Users</span>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={{ ...s.toolbar, padding: isMobile ? "12px 14px" : "16px 20px" }}>
          <div style={{
            ...s.toolbarContent,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? "10px" : "12px",
          }}>
            <div style={{ ...s.toolbarLeft, flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? "8px" : "10px" }}>
              <button onClick={openCreate} style={{ ...s.newTicketBtn, flex: isMobile ? "1 1 auto" : "none", height: isMobile ? "36px" : "38px", fontSize: isMobile ? "12px" : "13px" }}>
                <Plus size={isMobile ? 13 : 15} /> New Ticket
              </button>

              <div style={s.viewToggle}>
                {[
                  { mode: "table", icon: List, label: "Table" },
                  { mode: "kanban", icon: LayoutGrid, label: "Board" },
                ].map(({ mode, icon: Icon, label }, idx, arr) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    style={s.viewToggleBtn(
                      viewMode === mode,
                      idx === arr.length - 1,
                    )}
                  >
                    <Icon size={isMobile ? 13 : 14} />{" "}
                    <span style={{ fontSize: isMobile ? "11px" : "12px" }}>{label}</span>
                  </button>
                ))}
              </div>

              <div style={{ ...s.searchWrapper, minWidth: isMobile ? "140px" : "220px", flex: isMobile ? "1" : "0 1 320px", height: isMobile ? "36px" : "38px" }}>
                <Search
                  size={14}
                  style={{ ...s.searchIcon, color: t.text.tertiary }}
                />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  style={{ ...s.searchInput, height: isMobile ? "36px" : "38px", fontSize: isMobile ? "12px" : "13px" }}
                />
              </div>
            </div>

            <div style={{ ...s.toolbarRight, justifyContent: isMobile ? "flex-start" : "flex-end", height: isMobile ? "auto" : "38px" }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={s.filterTriggerBtn(filterStatus.length > 0 || filterPriority.length > 0)}
              >
                <Filter size={isMobile ? 13 : 14} /> Filters
                {(filterStatus.length > 0 || filterPriority.length > 0) && (
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      fontSize: "10px",
                      backgroundColor: t.accent,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                    }}
                  >
                    {filterStatus.length + filterPriority.length}
                  </span>
                )}
              </button>
              <span style={s.ticketCount}>
                {totalFiltered} ticket{totalFiltered !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {showFilters && (
            <div style={s.filterPanel}>
              <div style={s.filterGroup}>
                <span style={s.filterGroupLabel}>Status</span>
                {statuses.map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus((prev) =>
                      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
                    )}
                    style={s.filterChip(filterStatus.includes(st), statusColors[st])}
                  >
                    <div style={s.filterChipDot(statusColors[st])} />
                    {st}
                  </button>
                ))}
              </div>

              <div style={{ ...s.filterGroup, marginTop: "10px" }}>
                <span style={s.filterGroupLabel}>Priority</span>
                {[{ label: "Low", color: "#22c55e" }, { label: "Medium", color: "#eab308" }, { label: "High", color: "#f97316" }, { label: "Critical", color: "#ef4444" }].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setFilterPriority((prev) =>
                      prev.includes(p.label) ? prev.filter((pl) => pl !== p.label) : [...prev, p.label]
                    )}
                    style={s.filterChip(filterPriority.includes(p.label), p.color)}
                  >
                    <div style={s.filterChipDot(p.color)} />
                    {p.label}
                  </button>
                ))}
              </div>

              <div style={{ ...s.filterGroup, marginTop: "10px" }}>
                <span style={s.filterGroupLabel}>Date Range</span>
                <DateRangePicker
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  onChange={(update) => {
                    setDateRange(update);
                    fetchData(false, update);
                  }}
                  theme={{
                    border: t.border,
                    bgPrimary: t.bg.primary,
                    textPrimary: t.text.primary,
                    textTertiary: t.text.tertiary,
                  }}
                />
                {dateRange[0] && (
                  <button onClick={() => { setDateRange([null, null]); fetchData(false, [null, null]); }} style={s.filterClearBtn}>
                    Clear
                  </button>
                )}
              </div>

              {(filterStatus.length > 0 || filterPriority.length > 0 || dateRange[0]) && (
                <div style={s.filterActiveRow}>
                  {filterStatus.map((st) => (
                    <span key={st} style={s.filterActiveTag(statusColors[st])}>
                      {st}
                      <X size={10} style={{ cursor: "pointer" }} onClick={() => setFilterStatus((prev) => prev.filter((s) => s !== st))} />
                    </span>
                  ))}
                  {filterPriority.map((p) => (
                    <span key={p} style={s.filterActiveTag(priorityColors[p])}>
                      {p}
                      <X size={10} style={{ cursor: "pointer" }} onClick={() => setFilterPriority((prev) => prev.filter((pl) => pl !== p))} />
                    </span>
                  ))}
                  {dateRange[0] && <span style={s.filterActiveTag("#6366f1")}>{dateRange[0].toLocaleDateString()} {dateRange[1] ? `— ${dateRange[1].toLocaleDateString()}` : ""} <X size={10} style={{ cursor: "pointer" }} onClick={() => { setDateRange([null, null]); fetchData(false, [null, null]); }} /></span>}
                  <button onClick={() => { setFilterStatus([]); setFilterPriority([]); setDateRange([null, null]); fetchData(false, [null, null]); }} style={s.filterClearBtn}>
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Table View */}
        {viewMode === "table" && (
          <div style={{ ...s.tableWrap, overflowX: "auto" }}>
            <div>
              <table style={s.table}>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Title",
                      "Category",
                      "Priority",
                      "Status",
                      "Assignees",
                      "Created",
                      "",
                    ].map((h) => (
                      <th key={h} style={s.th(h === "")}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ticket) => (
                    <tr
                      key={ticket.id}
                      style={s.row}
                      onClick={() => openDetail(ticket)}
                    >
                      <td style={s.td}>
                        <Text
                          variant="mono"
                          style={{
                            color: t.text.tertiary,
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          <Hash size={11} />
                          {ticket.id.slice(0, 8).toUpperCase()}
                        </Text>
                      </td>
                      <td style={s.td}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: t.text.primary,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "280px",
                          }}
                        >
                          {ticket.title}
                        </div>
                        {ticket.description && (
                          <div
                            style={{
                              fontSize: "11px",
                              color: t.text.tertiary,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              marginTop: "3px",
                              maxWidth: "280px",
                            }}
                          >
                            {ticket.description}
                          </div>
                        )}
                      </td>
                      <td style={s.td}>
                        <span style={s.categoryBadge}>{ticket.category}</span>
                      </td>
                      <td style={s.td}>
                        <span
                          style={s.priorityBadge(
                            priorityColors[ticket.priority],
                          )}
                        >
                          {ticket.priority}
                        </span>
                      </td>
                      <td style={s.td}>
                        <div style={s.statusWrapper}>
                          <span
                            style={s.statusDot(statusColors[ticket.status])}
                          />
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: t.text.primary,
                            }}
                          >
                            {ticket.status}
                          </span>
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={s.assigneesList}>
                          {Array.isArray(ticket.assignees) &&
                          ticket.assignees.length > 0 ? (
                            ticket.assignees.map((assignee) => (
                              <div
                                key={assignee.id}
                                title={assignee.name}
                                style={{ display: "inline-flex" }}
                              >
                                <Avatar name={assignee.name} size={22} />
                              </div>
                            ))
                          ) : (
                            <span style={s.unassignedText}>Unassigned</span>
                          )}
                        </div>
                      </td>
                      <td
                        style={{
                          ...s.td,
                          fontSize: "11px",
                          color: t.text.tertiary,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {timeAgo(ticket.created_at)}
                      </td>
                      <td style={s.td} onClick={(e) => e.stopPropagation()}>
                        <div style={s.actionsWrapper}>
                          <button
                            onClick={() => openEdit(ticket)}
                            title="Edit"
                            style={s.actionBtn}
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            title="Delete"
                            style={{ ...s.actionBtn, ...s.deleteBtn }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div style={s.emptyState}>
                <div style={s.emptyStateIcon}>
                  <Ticket size={28} style={{ opacity: 0.4 }} />
                </div>
                <p style={s.emptyTitle}>No tickets found</p>
                <p style={s.emptySubtitle}>
                  {searchQuery || filterStatus || filterPriority
                    ? "Try adjusting your filters"
                    : "Create your first ticket to get started"}
                </p>
                {!searchQuery && !filterStatus && !filterPriority && (
                  <button
                    onClick={openCreate}
                    style={{ ...s.viewToggleBtn(true), ...s.emptyCreateBtn }}
                  >
                    <Plus size={15} /> Create Ticket
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Kanban View */}
        {viewMode === "kanban" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(290px, 1fr))",
                gap: isMobile ? "12px" : "16px",
              }}
            >
              {statuses.map((status) => (
                <KanbanColumn
                  key={status}
                  status={status}
                  tickets={getByStatus(status)}
                  theme={t}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onDetail={openDetail}
                  onAdd={openCreateWithStatus}
                />
              ))}
            </div>
            <DragOverlay>
              {activeId && (
                <KanbanCard
                  ticket={tickets.find((tk) => tk.id === activeId)}
                  isDragging
                  theme={t}
                />
              )}
            </DragOverlay>
          </DndContext>
        )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={s.toolbar}>
              <div style={s.toolbarContent}>
                <div style={s.toolbarLeft}>
                  <Text variant="h3" style={{ color: t.text.primary, fontWeight: '700' }}>Workspace Users</Text>
                  <span style={s.ticketCount}>{users.length} members</span>
                </div>
                <div style={s.toolbarRight}>
                  <div style={s.searchWrapper}>
                    <Search size={14} style={{ ...s.searchIcon, color: t.text.tertiary }} />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search users..."
                      style={s.searchInput}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={s.tableWrap}>
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      {['Avatar', 'Name', 'Email', 'Role', 'Status'].map((h) => (
                        <th key={h} style={s.th(false)}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => 
                      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      u.email.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((u) => (
                      <tr key={u.id} style={s.row}>
                        <td style={s.td}>
                          <Avatar name={u.name} size={36} />
                        </td>
                        <td style={{ ...s.td, fontSize: '13px', fontWeight: '600', color: t.text.primary }}>
                          {u.name}
                        </td>
                        <td style={{ ...s.td, fontSize: '13px', color: t.text.secondary }}>
                          {u.email}
                        </td>
                        <td style={s.td}>
                          <span style={{
                            fontSize: '11px', fontWeight: '700', color: t.accent,
                            backgroundColor: t.accentLight, padding: '4px 10px', borderRadius: '6px',
                            textTransform: 'uppercase', letterSpacing: '0.5px',
                          }}>{u.role}</span>
                        </td>
                        <td style={s.td}>
                          <div style={s.statusWrapper}>
                            <span style={s.statusDot('#10b981')} />
                            <span style={{ fontSize: '12px', fontWeight: '600', color: t.text.primary }}>Active</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      <TicketModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setDefaultStatus(null); }}
        onSave={handleSave}
        ticket={editTicket}
        theme={t}
        defaultStatus={defaultStatus}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
        theme={t}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        theme={t}
        isDark={isDark}
        onUpdate={(updated) => {
          localStorage.setItem('user', JSON.stringify({ ...user, ...updated }));
          window.location.reload();
        }}
      />

      {/* Detail Side Panel */}
      {detailTicket && (
        <div style={s.sidePanelBackdrop} onClick={() => setDetailTicket(null)}>
          <div style={s.sidePanel} onClick={(e) => e.stopPropagation()}>
            {/* Panel Header */}
            <div style={s.panelHeader}>
              <div style={s.panelHeaderId}>
                <Hash size={14} color={t.text.tertiary} />
                <span style={s.panelHeaderIdText}>
                  {detailTicket.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div style={s.panelHeaderActions}>
                <button
                  onClick={() => {
                    setDetailTicket(null);
                    openEdit(detailTicket);
                  }}
                  style={s.panelHeaderEditBtn}
                >
                  <Pencil size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(detailTicket.id)}
                  style={s.panelHeaderDeleteBtn}
                >
                  <Trash2 size={12} /> Delete
                </button>
                <button
                  onClick={() => setDetailTicket(null)}
                  style={s.panelHeaderCloseBtn}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Panel Body */}
            <div style={s.panelBody}>
              <div>
                <h2 style={s.panelTitle}>{detailTicket.title}</h2>

                {/* Properties Grid */}
                <div style={s.propertiesGrid}>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Status
                    </Text>
                    <div style={s.propertyItemValue}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: statusColors[detailTicket.status],
                        }}
                      />
                      <Text
                        style={{
                          fontSize: "13px",
                          fontWeight: "600",
                          color: t.text.primary,
                        }}
                      >
                        {detailTicket.status}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Priority
                    </Text>
                    <div style={s.propertyItemValue}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "700",
                          color: "#fff",
                          backgroundColor:
                            priorityColors[detailTicket.priority],
                          padding: "2px 10px",
                          borderRadius: "20px",
                        }}
                      >
                        {detailTicket.priority}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Category
                    </Text>
                    <div style={s.propertyItemValue}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: t.text.secondary,
                          backgroundColor: t.bg.tertiary,
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {detailTicket.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Assignees
                    </Text>
                    <div
                      style={{
                        ...s.propertyItemValue,
                        gap: "6px",
                        flexWrap: "wrap",
                        minHeight: "24px",
                      }}
                    >
                      {Array.isArray(detailTicket.assignees) &&
                      detailTicket.assignees.length > 0 ? (
                        detailTicket.assignees.map((assignee) => (
                          <div key={assignee.id} style={s.assigneePill}>
                            <Avatar name={assignee.name} size={16} />
                            <span style={s.assigneePillText}>
                              {assignee.name}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span style={s.unassignedText}>Unassigned</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Created By
                    </Text>
                    <div style={s.propertyItemValue}>
                      <Avatar name={detailTicket.created_by_name} size={18} />
                      <Text
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: t.text.primary,
                        }}
                      >
                        {detailTicket.created_by_name}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text
                      style={{
                        ...s.propertyText,
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Created
                    </Text>
                    <div style={s.propertyItemValue}>
                      <Text
                        style={{
                          fontSize: "12px",
                          fontWeight: "500",
                          color: t.text.secondary,
                        }}
                      >
                        {new Date(detailTicket.created_at).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Text
                  style={{
                    ...s.propertyText,
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Description
                </Text>
                <div style={s.descriptionBox}>
                  {detailTicket.description || "No description provided."}
                </div>
              </div>

              {/* Comments Section */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                  flex: 1,
                }}
              >
                <div style={s.commentsHeader}>
                  <MessageSquare size={15} color={t.text.tertiary} />
                  <Text style={{ ...s.propertyText, margin: 0, fontWeight: "600" }}>
                    Comments ({comments.length})
                  </Text>
                </div>

                {/* Comment Input */}
                <div style={s.commentInputCard}>
                  <div style={s.commentInputHeader}>
                    <Avatar name={user?.name} size={22} />
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      style={s.commentInputTextarea}
                    />
                  </div>
                  <div style={s.commentInputFooter}>
                    <span style={s.commentInputHint}>
                      Enter to send · Shift+Enter for new line
                    </span>
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || commentLoading}
                      style={s.commentSendBtn(newComment.trim())}
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>

                {/* Comment List */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {comments.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "28px 20px",
                        color: t.text.tertiary,
                        fontSize: "13px",
                        border: `1.5px dashed ${t.border}`,
                        borderRadius: "12px",
                        lineHeight: 1.6,
                      }}
                    >
                      <MessageSquare size={18} style={{ opacity: 0.3, marginBottom: 8 }} />
                      <div>No comments yet.</div>
                      <div style={{ fontSize: "12px", marginTop: 2 }}>Be the first to share your thoughts.</div>
                    </div>
                  )}
                  {comments.map((c) => {
                    const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#f97316"];
                    const avatarColor = colors[c.user_name ? c.user_name.charCodeAt(0) % colors.length : 0];
                    const initials = (c.user_name || "?")
                      .split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <div key={c.id} style={s.commentItem}>
                        <div style={{ ...s.commentAvatar, backgroundColor: avatarColor }}>
                          {initials}
                        </div>
                        <div style={s.commentContent}>
                          <div style={s.commentUserRow}>
                            <span style={s.commentUserName}>{c.user_name}</span>
                            <span style={s.commentTime}>{timeAgo(c.created_at)}</span>
                          </div>
                          <div style={s.commentBody}>{c.comment}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
