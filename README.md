# IT Support Tickets - Frontend Application

Aplikasi klien dashboard tiket IT Support yang dibangun menggunakan **React 19**, sinkronisasi **Socket.IO** real-time, **Pusher Beams** untuk push notification, **dnd-kit** untuk drag-and-drop kanban, dan visual modern (Glassmorphism, priority accents, light/dark theme).

---

## Teknologi & Dependensi Utama

| Teknologi | Kegunaan |
|---|---|
| **React 19** | Framework UI |
| **Zustand** | State management tema (persist ke `localStorage`) |
| **@dnd-kit/core** & **@dnd-kit/sortable** | Drag-and-drop kanban board |
| **Axios** | HTTP client (interceptor otomatis sisipkan JWT Bearer token) |
| **React Router DOM** (v7) | Routing SPA |
| **Lucide React** | Icon set |
| **Socket.IO Client** | Koneksi WebSocket real-time ke backend |
| **@pusher/push-notifications-web** | Push notification browser via Pusher Beams |

---

## Struktur Folder

```
frontend/
├── public/
│   └── service-worker.js          # Service worker untuk push notification Pusher Beams
│
├── src/
│   ├── components/
│   │   ├── Text.js                # Komponen tipografi Poppins (h1 - mono)
│   │   ├── ConfirmModal.js        # Modal konfirmasi (pengganti window.confirm)
│   │   ├── TicketModal.js         # Modal create/edit dengan searchable dropdown assignees
│   │   ├── TicketModal.styles.js  # Style TicketModal
│   │   ├── KanbanColumn.js        # Kolom kanban (drop zone per status)
│   │   └── KanbanCard.js          # Kartu tiket (priority border, assignee avatar)
│   │
│   ├── context/
│   │   └── AuthContext.js         # Manajemen sesi JWT + registrasi Pusher Beams
│   │
│   ├── screens/
│   │   ├── Dashboard/
│   │   │   ├── component.js       # Main dashboard (metrik, tabel/kanban, sidebar, users)
│   │   │   └── styles.js          # Style Dashboard
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── KanbanBoard/
│   │   ├── TicketDetail/
│   │   └── CreateTicket/
│   │
│   ├── store/
│   │   └── themeStore.js          # Zustand store dark/light mode
│   │
│   ├── services/
│   │   ├── api.js                 # Axios client + service functions
│   │   ├── socket.js              # Socket.IO client helper
│   │   └── pusher.js              # Pusher Beams SDK helper
│   │
│   ├── theme.js                   # Token warna light/dark mode
│   ├── index.css                  # Font Poppins & reset CSS
│   └── App.js                     # Root component + routing
│
├── .env                           # Konfigurasi env (git-ignored)
└── package.json
```

---

## Fitur & Implementasi Teknis

### 1. Real-Time Sync via Socket.IO

Menggantikan short-polling dengan **Socket.IO** WebSocket untuk update data instan.

#### Alur kerja:
1. Dashboard mount → `connectSocket()` terpanggil, membuka koneksi WebSocket ke backend (`localhost:5001`).
2. `onEvent('tickets:created', cb)` mendaftarkan listener untuk event tiket baru.
3. Saat user lain membuat/mengupdate/menghapus tiket di browser lain, backend emit event `tickets:created/updated/deleted`.
4. Frontend langsung memanggil `fetchData(false)` — refresh data tanpa polling.

#### Event yang didengarkan:
| Event | Aksi |
|---|---|
| `tickets:created` | Refresh data tiket & metrik |
| `tickets:updated` | Refresh data tiket & metrik |
| `tickets:deleted` | Refresh data tiket & metrik |
| `comments:added` | Refresh komentar (jika panel detail terbuka) |

#### Perbandingan dengan short-polling sebelumnya:
| Aspek | Sebelum (Polling) | Sesudah (Socket.IO) |
|---|---|---|
| Delay update | 5 detik (tiket), 3 detik (komentar) | Real-time (0 delay) |
| HTTP request per menit | 12-20 request | 0 (setelah koneksi) |
| Beban server | Tinggi (request periodik) | Rendah (event-based) |

#### File terkait:
- `src/services/socket.js` — Koneksi, listener management
- `src/screens/Dashboard/component.js` — Subscriber event

---

### 2. Push Notification (Pusher Beams)

Notifikasi push browser meskipun tab dashboard sedang tidak aktif.

#### Alur kerja:
1. Setelah login sukses, `AuthContext` memanggil `initPusherBeams()`.
2. `registerPusherUser()` memanggil `POST /api/pusher/beams-auth` dengan JWT token.
3. Backend mengembalikan token autentikasi Pusher yang ditandatangani.
4. Browser terdaftar ke Pusher Beams via Service Worker.
5. Saat tiket baru dibuat/diperbarui, backend publish notifikasi → browser menampilkan banner.

#### Notifikasi yang diterima:
- **Tiket baru** — `"Tiket Baru Ditugaskan"` + judul tiket
- **Tiket diperbarui** — `"Tiket Diperbarui"` + perubahan status/priority

#### File terkait:
- `public/service-worker.js` — Service worker Pusher Beams
- `src/services/pusher.js` — Inisialisasi & registrasi SDK
- `src/context/AuthContext.js` — Trigger registrasi saat login/logout

---

### 3. Drag-and-Drop Kanban (dnd-kit)

Papan kanban dengan drag-and-drop untuk mengubah status tiket secara instan.

#### Solusi masalah:
Secara default, dnd-kit menelan semua event klik pada kartu. Untuk mengatasinya, kami menggunakan `activationConstraint.distance: 8px`:

```javascript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Drag hanya aktif setelah geser 8px
    },
  })
);
```

Artinya:
- **Klik biasa** (< 8px pergerakan) → membuka detail, edit, atau hapus tiket.
- **Drag** (≥ 8px pergerakan) → memindahkan tiket ke kolom status lain.

#### Optimisme update:
Saat drag selesai, status langsung diubah di state lokal (`setTickets`) sebelum response server — memberikan feedback instan ke user.

---

### 4. Priority Indicator

Empat tingkat prioritas dengan warna dan icon berbeda:

| Priority | Warna | Icon | Glow |
|---|---|---|---|
| Low | Hijau (`#22c55e`) | `ArrowDown` | Hijau transparan |
| Medium | Kuning (`#eab308`) | `AlertCircle` | Kuning transparan |
| High | Oranye (`#f97316`) | `Zap` | Oranye transparan |
| Critical | Merah (`#ef4444`) | `Flame` | Merah transparan |

---

### 5. Searchable Assignee Dropdown

Modal create/edit tiket memiliki dropdown multi-select assignee dengan fitur pencarian (search by name/email). Style dropdown menampilkan avatar + nama + email per opsi.

---

### 6. Confirm Modal (Mengganti `window.confirm`)

Semua konfirmasi hapus menggunakan komponen `ConfirmModal` kustom dengan desain konsisten, bukan `window.confirm` bawaan browser.

---

### 7. Users Directory

Tab "Users Directory" menampilkan daftar semua user aktif dengan avatar, nama, email, role, dan status. Pencarian user real-time berdasarkan nama atau email.

---

## Instalasi & Menjalankan

1. Pasang semua dependensi npm:
```bash
npm install
```

2. Buat file `.env` di root folder frontend:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api

# Pusher Beams (opsional — untuk push notification)
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=
```

3. Jalankan aplikasi:
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000` dan otomatis membuka browser.

---

## Catatan Pengembangan

- **Pastikan backend sudah running** di `localhost:5001` sebelum menjalankan frontend.
- **Socket.IO** akan otomatis connect ke server di `REACT_APP_API_BASE_URL` (tanpa suffix `/api`).
- **Pusher Beams** bersifat opsional. Jika dikosongkan, aplikasi tetap berjalan normal tanpa push notification.
- **Service worker** (`service-worker.js`) hanya aktif jika Pusher Beams dikonfigurasi.
