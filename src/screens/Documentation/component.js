import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Server,
  Database,
  Shield,
  Wifi,
  Bell,
  Sun,
  Moon,
  BookOpen,
  Code,
  Cpu,
  Layout,
  FileText,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../../store/themeStore";
import { lightTheme, darkTheme } from "../../theme";
import { getStyles } from "./styles";
import Footer from "../../components/Footer";

const sections = [
  {
    id: "overview",
    label: "Overview",
    group: "Getting Started",
    icon: BookOpen,
  },
  {
    id: "tech-stack",
    label: "Tech Stack",
    group: "Getting Started",
    icon: Cpu,
  },
  {
    id: "architecture",
    label: "Architecture",
    group: "Getting Started",
    icon: Layout,
  },
  {
    id: "backend-structure",
    label: "BE Structure",
    group: "Backend",
    icon: Server,
  },
  { id: "database", label: "Database", group: "Backend", icon: Database },
  { id: "api-endpoints", label: "API Endpoints", group: "Backend", icon: Code },
  { id: "security", label: "Security", group: "Backend", icon: Shield },
  {
    id: "realtime",
    label: "Real-Time (Socket.IO)",
    group: "Backend",
    icon: Wifi,
  },
  {
    id: "push-notif",
    label: "Push Notification",
    group: "Backend",
    icon: Bell,
  },
  {
    id: "migration",
    label: "Database Migration",
    group: "Backend",
    icon: FileText,
  },
  {
    id: "frontend-structure",
    label: "FE Structure",
    group: "Frontend",
    icon: Layout,
  },
  { id: "features", label: "Features", group: "Frontend", icon: Ticket },
  { id: "install", label: "Installation", group: "Deployment", icon: Server },
  { id: "production", label: "Production", group: "Deployment", icon: Shield },
];

const techs = [
  { name: "React 19", use: "UI Framework", version: "19.x" },
  { name: "Express.js", use: "Web Framework", version: "4.x" },
  { name: "Socket.IO", use: "Real-Time WebSocket", version: "4.x" },
  { name: "PostgreSQL", use: "Database", version: "16.x" },
  { name: "JWT", use: "Auth Tokens", version: "9.x" },
  { name: "bcryptjs", use: "Password Hashing", version: "2.x" },
  { name: "Zustand", use: "State Management", version: "5.x" },
  { name: "dnd-kit", use: "Drag & Drop", version: "1.x" },
  { name: "Axios", use: "HTTP Client", version: "1.x" },
  { name: "Pusher Beams", use: "Push Notifications", version: "2.x" },
  { name: "react-date-range", use: "Date Range Picker", version: "2.x" },
  { name: "Lucide React", use: "Icon Library", version: "0.x" },
];

const DocumentationComponent = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const t = isDark ? darkTheme : lightTheme;
  const s = getStyles(t, isDark);
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const grouped = sections.reduce((acc, section) => {
    if (!acc[section.group]) acc[section.group] = [];
    acc[section.group].push(section);
    return acc;
  }, {});

  const scrollTo = (id) => {
    setActiveSection(id);
    setSidebarOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollPos = window.scrollY + 120;
      let current = "overview";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= scrollPos) current = s.id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Tag = ({ color, label }) => <span style={s.tag(color)}>{label}</span>;

  const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <button onClick={handleCopy} style={s.copyBtn}>
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied" : "Copy"}
      </button>
    );
  };

  return (
    <div style={s.container}>
      {/* Mobile header */}
      {isMobile && (
        <div
          style={{
            ...s.mobileHeader,
            backgroundColor: t.bg.secondary,
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <div style={s.mobileHeaderTitle}>
            <div style={s.sidebarLogo}>
              <Ticket size={14} color="#fff" />
            </div>
            <span style={{ ...s.mobileHeaderText, color: t.text.primary }}>
              Documentation
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              ...s.mobileToggle,
              border: `1px solid ${t.border}`,
              backgroundColor: t.bg.tertiary,
              color: t.text.secondary,
            }}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside
        style={{
          ...s.sidebar,
          ...(isMobile
            ? {
                position: "fixed",
                top: "48px",
                left: 0,
                zIndex: 99,
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
                width: "260px",
                height: "calc(100vh - 48px)",
                boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.2)" : "none",
              }
            : {}),
        }}
      >
        <div style={s.sidebarHeader}>
          <div style={s.sidebarLogo}>
            <Ticket size={16} color="#fff" />
          </div>
          <div>
            <div style={s.sidebarTitle}>IT Support</div>
            <div style={s.sidebarSubtitle}>Documentation</div>
          </div>
        </div>

        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} style={s.navGroup}>
            <div style={s.navGroupLabel}>{group}</div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  style={s.navItem(activeSection === item.id)}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}

        <div
          style={{
            padding: isMobile ? "12px 12px 24px" : "12px",
          }}
        >
          <button onClick={toggleTheme} style={s.navItem(false)}>
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={s.mobileBackdrop} />
        )}
      </aside>

      {/* Main */}
      <div
        style={{
          ...s.contentWrap,
          paddingTop: isMobile ? "48px" : 0,
        }}
      >
        <main
          style={{
            ...s.content,
            flex: 1,
            padding: isMobile ? "16px" : "32px 40px",
          }}
        >
          <button onClick={() => navigate("/")} style={s.backLink}>
            <ArrowLeft size={14} /> {isMobile ? "Back" : "Back to Dashboard"}
          </button>

          {/* Overview */}
          <section id="overview" style={s.section}>
            <h1 style={s.pageTitle}>IT Support Dashboard</h1>
            <p style={s.pageDesc}>
              Full-stack IT Support Ticket Dashboard — React 19 frontend with
              Express.js/PostgreSQL backend, real-time sync via Socket.IO,
              drag-and-drop kanban, push notifications via Pusher Beams, and
              modern glassmorphism UI.
            </p>
            <div style={s.githubCard}>
              <div style={s.githubCardTitle}>
                <BookOpen size={16} /> Repository
              </div>

              <div style={s.githubRow}>
                <div style={{ ...s.githubLabel, minWidth: "80px" }}>
                  Frontend
                </div>
                <a
                  href="https://github.com/rivankadesya/ticket-fe.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.githubLink}
                >
                  <code style={s.inlineCode}>rivankadesya/ticket-fe</code>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ ...s.githubCloneRow }}>
                <code style={s.githubClone}>
                  git clone https://github.com/rivankadesya/ticket-fe.git
                </code>
                <CopyButton text="git clone https://github.com/rivankadesya/ticket-fe.git" />
              </div>

              <div style={{ ...s.githubRow, marginTop: "12px" }}>
                <div style={{ ...s.githubLabel, minWidth: "80px" }}>
                  Backend
                </div>
                <a
                  href="https://github.com/rivankadesya/ticket-be.git"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.githubLink}
                >
                  <code style={s.inlineCode}>rivankadesya/ticket-be</code>
                  <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ ...s.githubCloneRow, marginBottom: 0 }}>
                <code style={s.githubClone}>
                  git clone https://github.com/rivankadesya/ticket-be.git
                </code>
                <CopyButton text="git clone https://github.com/rivankadesya/ticket-be.git" />
              </div>
            </div>
          </section>

          {/* Tech Stack */}
          <section id="tech-stack" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>1</div>
              <h2 style={s.sectionTitle}>Tech Stack</h2>
            </div>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Technology</th>
                    <th style={s.th}>Use</th>
                    <th style={s.th}>Version</th>
                  </tr>
                </thead>
                <tbody>
                  {techs.map((tech, i) => (
                    <tr key={tech.name} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td style={{ ...s.td, ...s.tdBold }}>{tech.name}</td>
                      <td style={s.td}>{tech.use}</td>
                      <td style={s.td}>{tech.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Architecture */}
          <section id="architecture" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>2</div>
              <h2 style={s.sectionTitle}>Architecture</h2>
            </div>
            <p style={s.paragraph}>
              The application uses a <strong>Client-Server</strong> architecture
              with REST API and WebSocket. The React frontend communicates with
              the Express backend via HTTP (Axios) for CRUD operations and
              Socket.IO for real-time updates.
            </p>
            <div style={s.codeBlock}>
              {`┌──────────────┐         HTTP (REST)          ┌──────────────┐
│   Frontend   │ ──────────────────────────►  │   Backend    │
│   (React 19) │   GET/POST/PUT/DELETE        │  (Express +  │
│  socket.io-  │ ◄──────────────────────────  │  PostgreSQL) │
│   client)    │         JSON Response        │              │
│              │                              │              │
│              │     Socket.IO (WebSocket)    │              │
│              │ ◄══════════════════════════  │              │
│              │   tickets:* / comments:*     │              │
└──────────────┘                              └──────────────┘`}
            </div>
          </section>

          {/* Backend Structure */}
          <section id="backend-structure" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>3</div>
              <h2 style={s.sectionTitle}>Backend Structure</h2>
            </div>
            <div style={s.codeBlock}>
              {`backend/
├── src/
│   ├── config/database.js       # PostgreSQL pool
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   └── commentController.js
│   ├── middleware/auth.js       # JWT verify + error handler
│   ├── models/index.js          # Table initialization
│   ├── routes/                  # API routes
│   ├── services/                # Pusher, Socket.IO helpers
│   ├── utils/validators.js      # express-validator rules
│   └── server.js                # Entry point + Socket.IO
├── .env
├── package.json
└── Postman_Collection.json`}
            </div>
          </section>

          {/* Database */}
          <section id="database" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>4</div>
              <h2 style={s.sectionTitle}>Database (PostgreSQL)</h2>
            </div>
            <h3 style={s.subTitle}>Entity Relationship</h3>
            <div style={s.erDiagram}>
              {`users ──1:N── tickets ──1:N── ticket_comments
  │                             │
  └── N:N ──────────────────────┘
  (ticket_assignments)`}
            </div>

            <h3 style={s.subTitle}>Tables</h3>

            <h4 style={s.subSubTitle}>users</h4>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Column</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["id", "UUID (PK)", "gen_random_uuid()"],
                    ["email", "VARCHAR(255)", "UNIQUE"],
                    ["password", "VARCHAR(255)", "bcrypt hash"],
                    ["name", "VARCHAR(255)", ""],
                    ["role", "VARCHAR(50)", "user / admin"],
                    ["is_active", "BOOLEAN", ""],
                    ["created_at", "TIMESTAMP", "auto"],
                    ["updated_at", "TIMESTAMP", "auto"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td
                        style={{
                          ...s.td,
                          fontWeight: 600,
                          color: t.text.primary,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={s.td}>{r[1]}</td>
                      <td style={s.td}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={s.subSubTitle}>tickets</h4>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Column</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["id", "UUID (PK)", "auto"],
                    ["title", "VARCHAR(255)", ""],
                    ["description", "TEXT", ""],
                    ["category", "VARCHAR(100)", ""],
                    [
                      "priority",
                      "VARCHAR(50)",
                      "CHECK: Low/Medium/High/Critical",
                    ],
                    ["status", "VARCHAR(50)", "DEFAULT Open"],
                    ["created_by", "UUID (FK → users)", "ON DELETE CASCADE"],
                    ["created_at", "TIMESTAMP", "auto"],
                    ["updated_at", "TIMESTAMP", "auto"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td
                        style={{
                          ...s.td,
                          fontWeight: 600,
                          color: t.text.primary,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={s.td}>{r[1]}</td>
                      <td style={s.td}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={s.subSubTitle}>ticket_assignments</h4>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Column</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ticket_id", "UUID (FK → tickets)", "ON DELETE CASCADE"],
                    ["user_id", "UUID (FK → users)", "ON DELETE CASCADE"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td
                        style={{
                          ...s.td,
                          fontWeight: 600,
                          color: t.text.primary,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={s.td}>{r[1]}</td>
                      <td style={s.td}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h4 style={s.subSubTitle}>ticket_comments</h4>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Column</th>
                    <th style={s.th}>Type</th>
                    <th style={s.th}>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["id", "UUID (PK)", "auto"],
                    ["ticket_id", "UUID (FK → tickets)", "ON DELETE CASCADE"],
                    ["user_id", "UUID (FK → users)", "ON DELETE CASCADE"],
                    ["comment", "TEXT", ""],
                    ["created_at", "TIMESTAMP", "auto"],
                    ["updated_at", "TIMESTAMP", "auto"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td
                        style={{
                          ...s.td,
                          fontWeight: 600,
                          color: t.text.primary,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={s.td}>{r[1]}</td>
                      <td style={s.td}>{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* API Endpoints */}
          <section id="api-endpoints" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>5</div>
              <h2 style={s.sectionTitle}>API Endpoints</h2>
            </div>

            <h3 style={s.subTitle}>
              Auth — <code style={s.inlineCode}>/api/auth</code>
            </h3>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Method</th>
                    <th style={s.th}>Endpoint</th>
                    <th style={s.th}>Auth</th>
                    <th style={s.th}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["POST", "/register", "✗", "Register new user"],
                    ["POST", "/login", "✗", "Login → JWT"],
                    ["GET", "/users", "✓", "List active users"],
                    ["GET", "/me", "✓", "Get my profile"],
                    ["PUT", "/profile", "✓", "Update name"],
                    ["PUT", "/password", "✓", "Change password"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td style={{ ...s.td, ...s.tdBold }}>{r[0]}</td>
                      <td style={{ ...s.td, ...s.tdCode }}>
                        <code>{r[1]}</code>
                      </td>
                      <td style={s.td}>{r[2]}</td>
                      <td style={s.td}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={s.subTitle}>
              Tickets — <code style={s.inlineCode}>/api/tickets</code>
            </h3>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Method</th>
                    <th style={s.th}>Endpoint</th>
                    <th style={s.th}>Auth</th>
                    <th style={s.th}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "POST",
                      "/",
                      "✓",
                      "Create ticket (title, category, priority, status, assignees)",
                    ],
                    ["GET", "/", "✓", "List (filter: status, priority)"],
                    ["GET", "/metrics", "✓", "Dashboard metrics"],
                    ["GET", "/:id", "✓", "Detail + comments"],
                    ["PUT", "/:id", "✓", "Update (creator/assignee/admin)"],
                    ["DELETE", "/:id", "✓", "Delete (creator/admin)"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td style={{ ...s.td, ...s.tdBold }}>{r[0]}</td>
                      <td style={{ ...s.td, ...s.tdCode }}>
                        <code>{r[1]}</code>
                      </td>
                      <td style={s.td}>{r[2]}</td>
                      <td style={s.td}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={s.subTitle}>
              Comments —{" "}
              <code style={s.inlineCode}>/api/tickets/:id/comments</code>
            </h3>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Method</th>
                    <th style={s.th}>Endpoint</th>
                    <th style={s.th}>Auth</th>
                    <th style={s.th}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["POST", "/:ticket_id/comments", "✓", "Add comment"],
                    ["GET", "/:ticket_id/comments", "✓", "Get comments"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td style={{ ...s.td, ...s.tdBold }}>{r[0]}</td>
                      <td style={{ ...s.td, ...s.tdCode }}>
                        <code>{r[1]}</code>
                      </td>
                      <td style={s.td}>{r[2]}</td>
                      <td style={s.td}>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={s.paragraph}>
              <Tag color="#ef4444" label="POST" />{" "}
              <Tag color="#10b981" label="GET" />{" "}
              <Tag color="#f59e0b" label="PUT" />{" "}
              <Tag color="#ef4444" label="DELETE" />
            </p>
          </section>

          {/* Security */}
          <section id="security" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>6</div>
              <h2 style={s.sectionTitle}>Security</h2>
            </div>
            <ul style={s.list}>
              <li style={s.listItem}>
                <strong>Helmet</strong> — HTTP header protection (XSS,
                clickjacking)
              </li>
              <li style={s.listItem}>
                <strong>JWT</strong> — Bearer token on protected routes
              </li>
              <li style={s.listItem}>
                <strong>bcryptjs</strong> — Password hashing with configurable
                salt rounds
              </li>
              <li style={s.listItem}>
                <strong>Role-based access</strong> — Creator/Admin/Assignee
                permission model
              </li>
              <li style={s.listItem}>
                <strong>express-validator</strong> — Input validation for all
                endpoints
              </li>
              <li style={s.listItem}>
                <strong>Parameterized queries</strong> — Prepared statements
                prevent SQL injection
              </li>
              <li style={s.listItem}>
                <strong>Central error handler</strong> — Consistent JSON error
                responses
              </li>
            </ul>
          </section>

          {/* Real-Time */}
          <section id="realtime" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>7</div>
              <h2 style={s.sectionTitle}>Real-Time Sync (Socket.IO)</h2>
            </div>
            <p style={s.paragraph}>
              Replaces short-polling with <strong>Socket.IO</strong>{" "}
              bidirectional WebSocket. Every data change is instantly sent to
              all connected clients without delay.
            </p>
            <div style={s.codeBlock}>
              {`┌──────────────┐                             ┌──────────────┐
│   Backend    │  ──  tickets:created  ──►   │   Frontend   │
│   (Server)   │  ──  tickets:updated  ──►   │   (Client)   │
│              │  ──  tickets:deleted  ──►   │              │
│              │  ──  comments:added   ──►   │              │
└──────────────┘                             └──────────────┘`}
            </div>
            <div style={s.tableWrap}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Event</th>
                    <th style={s.th}>Trigger</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["tickets:created", "New ticket created"],
                    [
                      "tickets:updated",
                      "Ticket updated (status, priority, etc)",
                    ],
                    ["tickets:deleted", "Ticket deleted"],
                    ["comments:added", "New comment added"],
                  ].map((r, i) => (
                    <tr key={i} style={i % 2 === 1 ? s.rowAlt : {}}>
                      <td
                        style={{
                          ...s.td,
                          fontFamily: "monospace",
                          fontWeight: 600,
                          color: t.text.primary,
                        }}
                      >
                        {r[0]}
                      </td>
                      <td style={s.td}>{r[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Push Notification */}
          <section id="push-notif" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>8</div>
              <h2 style={s.sectionTitle}>Push Notification (Pusher Beams)</h2>
            </div>
            <p style={s.paragraph}>
              <strong>Pusher Beams</strong> sends browser push notifications to
              assigned users. Notifications appear as banners even when the
              dashboard tab is inactive.
            </p>
            <div style={s.subSubTitle}>Flow:</div>
            <ul style={s.list}>
              <li style={s.listItem}>
                User login → <code style={s.inlineCode}>initPusherBeams()</code>
              </li>
              <li style={s.listItem}>
                Frontend calls{" "}
                <code style={s.inlineCode}>POST /api/pusher/beams-auth</code> →
                signed token
              </li>
              <li style={s.listItem}>Browser registered via Service Worker</li>
              <li style={s.listItem}>
                Ticket created/updated → backend publishes to assignees
              </li>
            </ul>
          </section>

          {/* Database Migration */}
          <section id="migration" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>9</div>
              <h2 style={s.sectionTitle}>Database Migration</h2>
            </div>
            <p style={s.paragraph}>
              Schema changes are managed via SQL migration files. Auto-create
              database if not exists.
            </p>
            <div style={s.codeBlock}>
              {`# Run all pending migrations
npm run migrate

# Add new migration
touch src/migrations/002_add_column.sql
# Write SQL, then: npm run migrate`}
            </div>
          </section>

          {/* Frontend Structure */}
          <section id="frontend-structure" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>10</div>
              <h2 style={s.sectionTitle}>Frontend Structure</h2>
            </div>
            <div style={s.codeBlock}>
              {`frontend/
├── public/
│   └── service-worker.js        # Pusher Beams SW
├── src/
│   ├── components/              # Reusable UI
│   │   ├── Text.js              # Poppins typography
│   │   ├── ConfirmModal.js      # Custom confirm dialog
│   │   ├── TicketModal.js       # Create/Edit ticket form
│   │   ├── KanbanColumn.js      # Kanban drop zone
│   │   ├── KanbanCard.js        # Ticket card with priority
│   │   └── DateRangePicker.js   # Date range selector
│   ├── context/AuthContext.js    # JWT auth + Pusher init
│   ├── screens/                 # Page components
│   │   ├── Dashboard/           # Main dashboard
│   │   ├── Login/               # Login page
│   │   ├── Register/            # Registration
│   │   └── Documentation/       # This page
│   ├── services/
│   │   ├── api.js               # Axios client
│   │   ├── socket.js            # Socket.IO client
│   │   └── pusher.js            # Pusher Beams helper
│   ├── store/themeStore.js      # Zustand theme state
│   └── App.js                   # Routes
├── .env
└── package.json`}
            </div>
          </section>

          {/* Features */}
          <section id="features" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>11</div>
              <h2 style={s.sectionTitle}>Frontend Features</h2>
            </div>

            <h3 style={s.subTitle}>1. Real-Time via Socket.IO</h3>
            <p style={s.paragraph}>
              Dashboard subscribes to{" "}
              <code style={s.inlineCode}>tickets:created/updated/deleted</code>{" "}
              and <code style={s.inlineCode}>comments:added</code> events. Data
              refreshes instantly without polling.
            </p>

            <h3 style={s.subTitle}>2. Drag-and-Drop Kanban</h3>
            <p style={s.paragraph}>
              <code style={s.inlineCode}>@dnd-kit/core</code> with{" "}
              <code style={s.inlineCode}>activationConstraint.distance: 8</code>{" "}
              — drag activated after 8px movement, regular click still works for
              detail/edit/delete.
            </p>

            <h3 style={s.subTitle}>3. Priority Indicators</h3>
            <div style={s.techGrid}>
              {[
                ["Low", "#6366f1", "ArrowDown"],
                ["Medium", "#f59e0b", "AlertCircle"],
                ["High", "#f97316", "Zap"],
                ["Critical", "#ef4444", "Flame"],
              ].map(([l, c]) => (
                <div
                  key={l}
                  style={{ ...s.techCard, borderLeft: `3px solid ${c}` }}
                >
                  <div style={s.techName}>{l}</div>
                  <div style={{ ...s.techUse, color: c }}>{c}</div>
                </div>
              ))}
            </div>

            <h3 style={s.subTitle}>4. Searchable Assignee Dropdown</h3>
            <p style={s.paragraph}>
              Multi-select with live search by name/email, avatar + name
              display.
            </p>

            <h3 style={s.subTitle}>5. Dark/Light Theme</h3>
            <p style={s.paragraph}>
              Zustand store persists to{" "}
              <code style={s.inlineCode}>localStorage</code>. Full glassmorphism
              with 90+ token design system.
            </p>

            <h3 style={s.subTitle}>6. Date Range Filter</h3>
            <p style={s.paragraph}>
              <code style={s.inlineCode}>react-date-range</code> — Two-month
              calendar, server-side date filtering.
            </p>

            <h3 style={s.subTitle}>7. Confirm Modal</h3>
            <p style={s.paragraph}>
              Custom <code style={s.inlineCode}>ConfirmModal</code> menggantikan{" "}
              <code style={s.inlineCode}>window.confirm</code> — konsisten
              dengan theme.
            </p>

            <h3 style={s.subTitle}>8. Users Directory</h3>
            <p style={s.paragraph}>
              Tab "Users" displays a list of users with avatar, role, and active
              status.
            </p>
          </section>

          {/* Installation */}
          <section id="install" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>12</div>
              <h2 style={s.sectionTitle}>Installation</h2>
            </div>

            <h3 style={s.subTitle}>Backend</h3>
            <div style={s.codeBlock}>
              {`cd backend
npm install
# Create .env file with DB, JWT, Pusher config
npm run migrate       # Run database migrations
npm run dev           # Start at :5001`}
            </div>

            <h3 style={s.subTitle}>Frontend</h3>
            <div style={s.codeBlock}>
              {`cd frontend
npm install
# Create .env file with API URL and Pusher key
npm start             # Start at :3000`}
            </div>
          </section>

          {/* Production */}
          <section id="production" style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.sectionNumber}>13</div>
              <h2 style={s.sectionTitle}>Production Deployment</h2>
            </div>

            <h3 style={s.subTitle}>PM2 Process Manager</h3>
            <div style={s.codeBlock}>
              {`npm install pm2 --save-dev
npx pm2 start src/server.js --name ticket-api
npx pm2 save
npx pm2 startup`}
            </div>

            <h3 style={s.subTitle}>Nginx Reverse Proxy</h3>
            <div style={s.codeBlock}>
              {`server {
    listen 80;
    server_name api.domain.com;

    location / {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    location /socket.io/ {
        proxy_pass http://127.0.0.1:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}`}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DocumentationComponent;
