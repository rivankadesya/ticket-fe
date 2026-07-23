# IT Support Tickets Frontend

Interactive, high-fidelity React frontend dashboard built with Poppins styling.

## Tech Stack & Tools
- **Framework:** React 19
- **Routing:** React Router DOM (v7)
- **HTTP Client:** Axios
- **State Management:** Zustand (theme configuration)
- **Drag-and-Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Icons:** Lucide React

## Folder Architecture
- `src/components/` - Reusable layouts, buttons, dropdowns, and modals.
- `src/context/` - Auth session context.
- `src/screens/` - Dashboard layout and auth screens.
- `src/store/` - Zustand global state.
- `src/theme.js` - Light & Dark theme config tokens.
- `src/index.css` - Reset CSS and Poppins fonts.

## Installation & Running

1. Install package dependencies:
```bash
npm install
```

2. Create a `.env` configuration file in this directory:
```env
REACT_APP_API_BASE_URL=http://localhost:5001/api
REACT_APP_PUSHER_BEAMS_INSTANCE_ID=<YOUR_PUSHER_BEAMS_INSTANCE_ID>
```

3. Launch the development server:
```bash
npm start
```
The application will run on `http://localhost:3000`.
