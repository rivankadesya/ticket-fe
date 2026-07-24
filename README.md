<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-5-443e38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/dnd--kit-6-6366f1?style=for-the-badge" />
</p>

<div align="center">
  <h1>🎫 IT Support Tickets — Frontend</h1>
  <p><strong>IT Support Ticket Dashboard</strong> — real-time, drag-and-drop kanban, push notifications</p>

  <p>
    <a href="https://github.com/rivankadesya/ticket-fe.git"><img src="https://img.shields.io/github/stars/rivankadesya/ticket-fe?style=flat-square&label=Stars&color=yellow" /></a>
    <a href="https://github.com/rivankadesya/ticket-fe.git"><img src="https://img.shields.io/github/forks/rivankadesya/ticket-fe?style=flat-square&label=Forks&color=blue" /></a>
    <a href="https://github.com/rivankadesya/ticket-be.git"><img src="https://img.shields.io/badge/Backend%20Repo-Link-6366f1?style=flat-square" /></a>
  </p>
</div>

---

## 📋 Table of Contents

- [Clone Repository](#-clone-repository)
- [Technologies](#-technologies)
- [Features](#-features)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Deployment](#-deployment)
- [Notes](#-notes)

---

## 📦 Clone Repository

```bash
git clone https://github.com/rivankadesya/ticket-fe.git
cd ticket-fe
```

> **Backend API:** [rivankadesya/ticket-be](https://github.com/rivankadesya/ticket-be.git)

---

## 🛠️ Technologies

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI Framework |
| **Zustand** | 5 | Theme state management |
| **@dnd-kit** | 6 | Drag-and-drop kanban |
| **Axios** | 1.18 | HTTP client |
| **React Router DOM** | 7 | SPA routing |
| **Lucide React** | 1.25 | Icon set |
| **Socket.IO Client** | 4.8 | WebSocket real-time |
| **@pusher/push-notifications-web** | 1.1 | Push notification |
| **use-debounce** | — | Search debounce |

---

## ✨ Features

### 🔄 Real-Time Sync (Socket.IO)
Dashboard receives ticket updates instantly — no page refresh needed.

| Event | Trigger |
|---|---|
| `tickets:created` | New ticket created |
| `tickets:updated` | Ticket updated |
| `tickets:deleted` | Ticket deleted |
| `comments:added` | New comment added |

### 📋 Drag-and-Drop Kanban
Move tickets between statuses (Open → In Progress → Resolved → Closed) with drag-and-drop. Regular click for details, drag to change status.

### 🏷️ Add Ticket per Column
Each kanban column has a **+ Add Ticket** button — status is automatically set based on the column.

### 🔍 Multi-Pill Filter
Filter by status & priority with interactive chips. Select multiple filters at once, toggle on/off with one click.

### 🎨 Priority Colors

| Priority | Color | Icon |
|---|---|---|
| Low | 🟢 Green `#22c55e` | `ArrowDown` |
| Medium | 🟡 Yellow `#eab308` | `AlertCircle` |
| High | 🟠 Orange `#f97316` | `Zap` |
| Critical | 🔴 Red `#ef4444` | `Flame` |

### ⚙️ Custom Dropdown
Category, Priority, Status, and Assignees use custom dropdowns — not native `<select>`.

### 👤 Edit Profile
Click avatar/name in header → edit name or change password.

### 🌗 Dark Mode
Toggle dark/light theme, automatically saved to localStorage.

### 📱 Responsive
Layout adapts to desktop, tablet, and mobile screens.

---

## 📁 Folder Structure

```
src/
├── components/          # Reusable components
│   ├── KanbanColumn.js  # Kanban column + add button
│   ├── KanbanCard.js    # Ticket card (draggable)
│   ├── TicketModal.js   # Create/edit ticket modal
│   ├── ProfileModal.js  # Profile edit modal
│   └── ConfirmModal.js  # Delete confirmation modal
│
├── screens/             # Pages
│   ├── Login/           # Login (split-screen + animations)
│   ├── Register/        # Register
│   └── Dashboard/       # Main dashboard (metrics, kanban, filters)
│
├── services/
│   ├── api.js           # Axios + service functions
│   ├── socket.js        # Socket.IO helper
│   └── pusher.js        # Pusher Beams helper
│
├── store/
│   └── themeStore.js    # Zustand dark/light mode
│
├── theme.js             # Color tokens + priority/status colors
├── index.css            # Poppins font, animations, reset
└── App.js               # Root component + routing
```

---

## 🚀 Installation

### Development

```bash
git clone https://github.com/rivankadesya/ticket-fe.git
cd ticket-fe
npm install
```

Create `.env` file:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=
```

Run:
```bash
npm start
```

App at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Build output in `build/` folder.

---

## 🌐 Deployment (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/ticket-fe/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Make sure `REACT_APP_API_BASE_URL` points to your backend domain.

---

## 📝 Notes

- **Backend must be running** before starting the frontend.
- **Socket.IO** auto-connects to the server from `REACT_APP_API_BASE_URL` (without `/api` suffix).
- **Pusher Beams** is optional.
- Font: **Poppins** from Google Fonts.
- **Custom scrollbar** adapts to theme.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/rivankadesya">rivankadesya</a>
</p>