# IT Support Tickets - Frontend Application

Aplikasi klien dashboard tiket IT Support yang dibangun menggunakan React 19, Poppins typography, dan visual modern (Glassmorphism & priority accents).

---

## Teknologi & Dependensi Utama

- **Framework:** React 19
- **State Management:** Zustand (untuk menyimpan preferensi tema pengguna ke `localStorage`)
- **Drag-and-Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
- **HTTP Client:** Axios (dilengkapi interceptor otomatis untuk menyertakan JWT Bearer Token)
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React

---

## Struktur Folder Rinci

```
frontend/
├── src/
│   ├── components/
│   │   ├── Text.js              # Komponen tipografi Poppins global (h1 - mono)
│   │   ├── ConfirmModal.js      # Modal konfirmasi kustom (pengganti browser alert/confirm)
│   │   ├── TicketModal.js       # Modal create/edit tiket dengan searchable dropdown assignees
│   │   ├── TicketModal.styles.js# Style terpisah untuk TicketModal
│   │   ├── KanbanColumn.js      # Kolom penampung kartu status kanban
│   │   └── KanbanCard.js        # Kartu tiket kanban (dilengkapi visual priority border)
│   │
│   ├── context/
│   │   └── AuthContext.js       # Manajemen sesi JWT Login/Register pengguna
│   │
│   ├── screens/
│   │   └── Dashboard/
│   │       ├── component.js     # Layar utama dashboard (Metrik, Tabel, Kanban, Sidebar detail)
│   │       └── styles.js        # Style terpisah untuk DashboardComponent
│   │
│   ├── store/
│   │   └── themeStore.js        # State global dark/light mode via Zustand
│   │
│   ├── services/
│   │   └── api.js               # Klien Axios & pemanggilan endpoint API backend
│   │
│   ├── theme.js                 # Token warna light/dark mode
│   ├── index.css                # Font face Poppins & reset CSS
│   └── App.js                   # Konfigurasi rute halaman klien
├── .env                         # Konfigurasi env lokal (git-ignored)
└── package.json
```

---

## Fitur & Implementasi Teknis Rinci

### 1. Sinkronisasi Real-Time & Polling
Untuk memastikan data tersinkronisasi antar user tanpa setup WebSocket server yang rumit:
- **Tiket:** Data metrik dan list tiket ditarik ulang secara background menggunakan *short-polling* setiap **5 detik**.
- **Komentar:** Saat panel detail tiket dibuka, komentar disinkronkan setiap **3 detik** sehingga diskusi antar agen berjalan secara real-time.

### 2. Notifikasi Push (Pusher Beams)
Frontend diintegrasikan dengan SDK Pusher Beams menggunakan Instance ID klien (`b348e873-658f-4747-beff-60b6841ef86d`) untuk menerima banner notifikasi push langsung ke browser pengguna melalui pendaftaran Service Worker.

### 3. Solusi Masalah Drag-and-Drop (dnd-kit constraint)
Secara bawaan, dnd-kit menelan semua event pointer klik pada kartu kanban. Untuk mengatasinya, kami menerapkan konfigurasi sensor pointer:
```javascript
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // Drag baru aktif setelah digeser sejauh 8px
    },
  })
);
```
Dengan ini, klik biasa pada kartu (untuk membuka detail) maupun pada tombol edit/hapus tetap dapat berfungsi normal tanpa terganggu gestur drag.

---

## Instalasi & Menjalankan

1. Pasang semua dependensi npm:
```bash
npm install
```

2. Buat file konfigurasi `.env` di folder root frontend:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=b348e873-658f-4747-beff-60b6841ef86d
```

3. Jalankan aplikasi di mode development:
```bash
npm start
```
Aplikasi akan otomatis berjalan pada alamat `http://localhost:3000`.
