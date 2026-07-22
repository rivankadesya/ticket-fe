# IT Support Tickets - Frontend

Professional React-based frontend for the IT Support Ticket Dashboard with modern UI and complete ticket management features.

## Features

- User authentication (login/register)
- Dashboard with metrics and ticket list
- Create, view, edit, and delete tickets
- Filter tickets by status and priority
- Add comments to tickets
- Responsive design
- Protected routes with JWT

## Prerequisites

- Node.js v14+
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Update the API base URL in `src/services/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Running the Application

**Development mode:**
```bash
npm start
```

Frontend will run on `http://localhost:3000`

**Production build:**
```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── screens/
│   │   ├── Login/
│   │   │   ├── index.js
│   │   │   ├── component.js
│   │   │   └── styles.js
│   │   ├── Register/
│   │   │   ├── index.js
│   │   │   ├── component.js
│   │   │   └── styles.js
│   │   ├── Dashboard/
│   │   │   ├── index.js
│   │   │   ├── component.js
│   │   │   └── styles.js
│   │   ├── CreateTicket/
│   │   │   ├── index.js
│   │   │   ├── component.js
│   │   │   └── styles.js
│   │   └── TicketDetail/
│   │       ├── index.js
│   │       ├── component.js
│   │       └── styles.js
│   ├── context/
│   │   └── AuthContext.js      # Authentication state management
│   ├── services/
│   │   └── api.js              # API client & service methods
│   ├── App.js                  # Main app with routing
│   └── index.js                # React entry point
├── package.json
└── README.md
```

## Screen Structure Pattern

Each screen follows a reusable pattern:

- **index.js** - Export component
- **component.js** - React component with logic
- **styles.js** - Inline styles object

### Example Usage

```javascript
// index.js
import LoginComponent from './component';
export default LoginComponent;

// component.js
import styles from './styles';

const LoginComponent = () => {
  return <div style={styles.container}>...</div>;
};

// styles.js
const styles = {
  container: { ... },
  // ...
};
export default styles;
```

## Available Screens

### Login Screen
- User email and password input
- Error handling
- Link to registration
- JWT token storage

### Register Screen
- User name, email, and password input
- Password validation (min 8 characters)
- Error handling
- Link to login

### Dashboard Screen
- Display metrics (total, open, in progress, high priority tickets)
- Filter by status and priority
- Ticket list with actions (view/delete)
- Create new ticket button
- User logout

### Create Ticket Screen
- Form for creating new tickets
- Fields: title, description, category, priority, assign to
- Validation
- Cancel and submit buttons

### Ticket Detail Screen
- View full ticket information
- Edit ticket details
- View and add comments
- Status update capability
- Back to dashboard button

## API Integration

All API calls are managed through `src/services/api.js`:

```javascript
import { ticketService, commentService, authService } from './services/api';

// Create ticket
await ticketService.createTicket(ticketData);

// Get all tickets
await ticketService.getTickets({ status: 'Open' });

// Add comment
await commentService.addComment(ticketId, { comment: 'text' });
```

## Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token automatically added to API requests via interceptor
4. Protected routes check token existence
5. Logout clears token and redirects to login

## Styling Approach

- Inline CSS objects in `styles.js`
- Consistent design system
- Responsive layouts using CSS Grid and Flexbox
- Color scheme:
  - Primary: #007bff (blue)
  - Success: #28a745 (green)
  - Danger: #dc3545 (red)
  - Warning: #ffc107 (yellow)
  - Secondary: #6c757d (gray)

## Performance Considerations

- React Router for efficient navigation
- Context API for state management
- Axios for HTTP requests with interceptors
- Lazy loading of routes possible

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env` file:
```
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
```

### Hosting Options
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
