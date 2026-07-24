<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-5-443e38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/dnd--kit-6-6366f1?style=for-the-badge" />
</p>

<div align="center">
  <h1>🎫 IT Support Tickets — Frontend</h1>
  <p><strong>Dashboard tiket IT Support</strong> — real-time, drag-and-drop kanban, push notification</p>

  <p>
    <a href="https://github.com/rivankadesya/ticket-fe.git"><img src="https://img.shields.io/github/stars/rivankadesya/ticket-fe?style=flat-square&label=Stars&color=yellow" /></a>
    <a href="https://github.com/rivankadesya/ticket-fe.git"><img src="https://img.shields.io/github/forks/rivankadesya/ticket-fe?style=flat-square&label=Forks&color=blue" /></a>
    <a href="https://github.com/rivankadesya/ticket-be.git"><img src="https://img.shields.io/badge/Backend%20Repo-Link-6366f1?style=flat-square" /></a>
  </p>
</div>

---

## 📋 Daftar Isi

- [Clone Repository](#-clone-repository)
- [Teknologi](#-teknologi)
- [Fitur](#-fitur)
- [Struktur Folder](#-struktur-folder)
- [Instalasi](#-instalasi)
- [Deployment](#-deployment)
- [Catatan](#-catatan)

---

## 📦 Clone Repository

```bash
git clone https://github.com/rivankadesya/ticket-fe.git
cd ticket-fe
```

> **Backend API:** [rivankadesya/ticket-be](https://github.com/rivankadesya/ticket-be.git)

---

## 🛠️ Teknologi

| Teknologi | Versi | Kegunaan |
|---|---|---|
| **React** | 19 | Framework UI |
| **Zustand** | 5 | State management tema |
| **@dnd-kit** | 6 | Drag-and-drop kanban |
| **Axios** | 1.18 | HTTP client |
| **React Router DOM** | 7 | Routing SPA |
| **Lucide React** | 1.25 | Icon set |
| **Socket.IO Client** | 4.8 | WebSocket real-time |
| **@pusher/push-notifications-web** | 1.1 | Push notification |
| **use-debounce** | — | Debounce pencarian |

---

## ✨ Fitur

### 🔄 Real-Time Sync (Socket.IO)
Dashboard menerima update tiket secara instan — tanpa refresh halaman.

| Event | Trigger |
|---|---|
| `tickets:created` | Tiket baru dibuat |
| `tickets:updated` | Tiket diperbarui |
| `tickets:deleted` | Tiket dihapus |
| `comments:added` | Komentar baru |

### 📋 Drag-and-Drop Kanban
Pindahkan tiket antar status (Open → In Progress → Resolved → Closed) dengan drag-and-drop. Klik biasa untuk detail, drag untuk pindah status.

### 🏷️ Add Ticket per Kolom
Setiap kolom kanban punya tombol **+ Add Ticket** — status otomatis terisi sesuai kolom.

### 🔍 Filter Multi-Pill
Filter status & priority dengan chip interaktif. Pilih banyak filter sekaligus, aktifkan/nonaktifkan dengan satu klik.

### 🎨 Priority Colors

| Priority | Warna | Icon |
|---|---|---|
| Low | 🟢 Hijau `#22c55e` | `ArrowDown` |
| Medium | 🟡 Kuning `#eab308` | `AlertCircle` |
| High | 🟠 Oranye `#f97316` | `Zap` |
| Critical | 🔴 Merah `#ef4444` | `Flame` |

### ⚙️ Custom Dropdown
Category, Priority, Status, dan Assignees pakai custom dropdown — bukan native `<select>`.

### 👤 Edit Profile
Klik avatar/nama di header → edit nama atau ganti password.

### 🌗 Dark Mode
Toggle dark/light theme tersimpan otomatis di localStorage.

### 📱 Responsive
Tampilan menyesuaikan desktop, tablet, dan handphone.

---

## 📁 Struktur Folder

```
src/
├── components/          # Komponen reusable
│   ├── KanbanColumn.js  # Kolom kanban + tombol add
│   ├── KanbanCard.js    # Kartu tiket (draggable)
│   ├── TicketModal.js   # Modal create/edit tiket
│   ├── ProfileModal.js  # Modal edit profile
│   └── ConfirmModal.js  # Modal konfirmasi hapus
│
├── screens/             # Halaman
│   ├── Login/           # Login (split-screen + animasi)
│   ├── Register/        # Register
│   └── Dashboard/       # Dashboard utama (metrik, kanban, filter)
│
├── services/
│   ├── api.js           # Axios + service functions
│   ├── socket.js        # Socket.IO helper
│   └── pusher.js        # Pusher Beams helper
│
├── store/
│   └── themeStore.js    # Zustand dark/light mode
│
├── theme.js             # Token warna + priority/status colors
├── index.css            # Font Poppins, animasi, reset
└── App.js               # Root component + routing
```

---

## 🚀 Instalasi

### Development

```bash
git clone https://github.com/rivankadesya/ticket-fe.git
cd ticket-fe
npm install
```

Buat file `.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=
```

Jalankan:
```bash
npm start
```

Aplikasi di `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Hasil build di folder `build/`.

---

## 🌐 Deployment (Nginx)

```nginx
server {
    listen 80;
    server_name domain-anda.com;
    root /var/www/ticket-fe/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Pastikan `REACT_APP_API_BASE_URL` diisi domain backend.

---

## 📝 Catatan

- **Backend harus running** sebelum frontend dijalankan.
- **Socket.IO** auto-connect ke server dari `REACT_APP_API_BASE_URL` (tanpa suffix `/api`).
- **Pusher Beams** opsional.
- Font: **Poppins** dari Google Fonts.
- **Custom scrollbar** menyesuaikan tema.

---

<p align="center">
  Dibuat dengan ❤️ oleh <a href="https://github.com/rivankadesya">rivankadesya</a>
</p>