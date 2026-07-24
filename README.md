# IT Support Tickets - Frontend Application

Aplikasi klien dashboard tiket IT Support yang dibangun menggunakan **React 19**, sinkronisasi **Socket.IO** real-time, **Pusher Beams** untuk push notification, **dnd-kit** untuk drag-and-drop kanban, dan visual modern dengan light/dark theme.

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
| **use-debounce** | Debounce pada pencarian |

---

## Struktur Folder

```
frontend/
├── public/
│   └── service-worker.js            # Service worker untuk push notification Pusher Beams
│
├── src/
│   ├── components/
│   │   ├── Text.js                  # Komponen tipografi Poppins
│   │   ├── ConfirmModal.js          # Modal konfirmasi hapus
│   │   ├── TicketModal.js           # Modal create/edit dengan custom dropdown
│   │   ├── TicketModal.styles.js    # Style TicketModal
│   │   ├── KanbanColumn.js          # Kolom kanban (drop zone + tombol add)
│   │   └── KanbanCard.js            # Kartu tiket (priority border, assignee avatar)
│   │
│   ├── context/
│   │   └── AuthContext.js           # Manajemen sesi JWT + registrasi Pusher Beams
│   │
│   ├── screens/
│   │   ├── Dashboard/
│   │   │   ├── component.js         # Main dashboard (metrik, tabel/kanban, filter, side panel)
│   │   │   └── styles.js            # Style Dashboard
│   │   ├── Login/
│   │   │   ├── component.js         # Login screen (split-screen layout + animasi)
│   │   │   └── styles.js
│   │   ├── Register/
│   │   │   ├── component.js         # Register screen
│   │   │   └── styles.js
│   │   ├── KanbanBoard/
│   │   ├── TicketDetail/
│   │   └── CreateTicket/
│   │
│   ├── store/
│   │   └── themeStore.js            # Zustand store dark/light mode
│   │
│   ├── services/
│   │   ├── api.js                   # Axios client + service functions
│   │   ├── socket.js                # Socket.IO client helper
│   │   └── pusher.js                # Pusher Beams SDK helper
│   │
│   ├── theme.js                     # Token warna light/dark mode + priority/status colors
│   ├── index.css                    # Font Poppins, reset CSS, keyframe animasi
│   └── App.js                       # Root component + routing
│
├── .env                             # Konfigurasi env (git-ignored)
└── package.json
```

---

## Fitur & Implementasi Teknis

### 1. Real-Time Sync via Socket.IO

Dashboard menerima update tiket secara real-time tanpa perlu refresh halaman.

| Event | Aksi |
|---|---|
| `tickets:created` | Refresh data tiket & metrik |
| `tickets:updated` | Refresh data tiket & metrik |
| `tickets:deleted` | Refresh data tiket & metrik |
| `comments:added` | Refresh komentar (jika panel detail terbuka) |

### 2. Push Notification (Pusher Beams)

Notifikasi push browser via Pusher Beams. Setelah login, pengguna otomatis terdaftar sebagai penerima notifikasi.

- **Tiket baru** → `"Tiket Baru Ditugaskan"` + judul tiket
- **Tiket diperbarui** → `"Tiket Diperbarui"` + perubahan status/priority
- Opsional — jika tidak dikonfigurasi, aplikasi tetap berjalan normal

### 3. Drag-and-Drop Kanban (dnd-kit)

Papan kanban dengan drag-and-drop untuk mengubah status tiket secara instan.

- **Klik biasa** (< 8px pergerakan) → membuka detail tiket
- **Drag** (≥ 8px pergerakan) → memindahkan tiket ke kolom status lain
- Optimistic update — status langsung berubah di UI sebelum response server

### 4. Add Ticket per Kolom

Setiap kolom kanban memiliki tombol **"+ Add Ticket"** yang membuka modal create dengan status otomatis terisi sesuai kolom.

### 5. Filter Multi-Pill

Filter status dan priority menggunakan chip/pill style:
- Pilih banyak status sekaligus (misal: Open + In Progress)
- Pilih banyak priority sekaligus
- Active filters ditampilkan sebagai tag removable
- Filter dilakukan client-side — data tetap lengkap di memori

### 6. Priority Indicator

| Priority | Warna | Icon |
|---|---|---|
| Low | Hijau (`#22c55e`) | `ArrowDown` |
| Medium | Kuning (`#eab308`) | `AlertCircle` |
| High | Oranye (`#f97316`) | `Zap` |
| Critical | Merah (`#ef4444`) | `Flame` |

### 7. Custom Dropdown

Dropdown Category, Priority, Status, dan Assignees menggunakan custom dropdown (bukan native `<select>`) dengan:
- Animasi buka/tutup
- Warna indikator (dot)
- Avatar inisial pada dropdown assignee
- Searchable multi-select assignee (maks 5 user tampil, sisanya harus search)

### 8. Login & Register Screen

Split-screen layout dengan:
- Panel kiri: branding, tagline, daftar fitur
- Panel kanan: form login/register
- Animasi entrance (staggered fade-in)
- Background blob floating

### 9. Search dengan Debounce

Pencarian tiket menggunakan `use-debounce` (300ms delay) untuk menghindari filter ulang saat mengetik cepat.

---

## Instalasi & Menjalankan

### Development

1. Pasang dependensi:
```bash
npm install
```

2. Buat file `.env`:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api

# Pusher Beams (opsional)
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=
```

3. Jalankan aplikasi:
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Hasil build di folder `build/` — siap di-deploy ke webserver (Nginx, Apache, dll).

---

## Deployment dengan Nginx

1. Build frontend:
```bash
npm run build
```

2. Konfigurasi Nginx:
```nginx
server {
    listen 80;
    server_name ticket.domain-anda.com;
    root /var/www/ticket-fe/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Jika backend di server berbeda, pastikan `REACT_APP_API_BASE_URL` diisi domain backend.

---

## Catatan Pengembangan

- Pastikan **backend sudah running** sebelum menjalankan frontend.
- **Socket.IO** akan otomatis connect ke server dari `REACT_APP_API_BASE_URL` (tanpa suffix `/api`).
- **Pusher Beams** bersifat opsional. Jika dikosongkan, aplikasi tetap berjalan normal.
- **Custom scrollbar** menyesuaikan tema (light/dark).
- Font menggunakan **Poppins** dari Google Fonts.