# URL Shortener - Full Stack Application

A modern, brutalist-themed URL shortener application with a React frontend and Spring Boot backend.

## 🎨 Features

- **Guest & Authenticated URL Creation**: Create short URLs without logging in, or register to track and manage your links
- **Custom Aliases**: Choose your own short codes for memorable URLs
- **Expiration Support**: Set URLs to expire after a specific duration (hours or days)
- **Live Stats**: Real-time hit counter with refresh capability
- **User Dashboard**: View your URLs and popular links
- **Brutalist Design**: Clean, bold black and yellow aesthetic

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and builds
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Space Mono** font for brutalist typography

### Backend
- **Spring Boot 3.5.7**
- **PostgreSQL 16**
- **Spring Security** with JWT (authentication framework in place)
- **Flyway** for database migrations
- **Docker** for containerization

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Java 21+** and Maven (for backend)
- **Docker** and Docker Compose (recommended for backend)

## 🚀 Quick Start

### Frontend Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Configure Backend URL**

The project uses environment variables for different environments:

**Development (automatic):** Uses `http://localhost:8081` via `.env.development`

**Production:** Update `.env.production` with your deployed backend URL:

```env
VITE_API_URL=https://urlshortener-app-8rw4.onrender.com
```

Or set it when building:
```bash
VITE_API_URL=https://your-api.com npm run build
```

3. **Run Development Server**
```bash
npm run dev
```

The app will start at `http://localhost:5173`

4. **Build for Production**
```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

### Backend Setup

Please refer to the backend repository's README for detailed setup instructions. The backend should be deployed and accessible before deploying the frontend.

**Key Backend Requirements:**
- PostgreSQL database
- Port 8081 (or configured port)
- CORS enabled for your frontend domain

## 📁 Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── axios.ts          # API client configuration
│   ├── components/
│   │   └── Navbar.tsx        # Navigation component
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication state management
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── Login.tsx         # Login page
│   │   └── Register.tsx      # Registration page
│   ├── App.tsx               # Root component
│   ├── index.css             # Global styles (brutalist theme)
│   └── main.tsx              # Entry point
├── public/                   # Static assets
├── dist/                     # Production build (generated)
├── package.json
└── vite.config.ts
```

## 🎯 Key Features Explained

### Guest URL Creation
Users can create short URLs without authentication. Simply enter a URL and optionally set:
- Custom alias
- Expiration time (in hours or days)

### User Dashboard
Authenticated users can:
- View all their created URLs
- See popular URLs across the platform
- Delete their URLs
- Refresh hit counts in real-time

### Duration-Based Expiration
Instead of picking a specific date/time, users specify "Expire after X hours/days", making it more intuitive.

### Live Hit Counter
Each URL card has a refresh button (🔄) to fetch the latest hit count without reloading the page.

## 🌐 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Update Production Backend URL** 

Edit `.env.production`:
```env
VITE_API_URL=https://urlshortener-app-8rw4.onrender.com
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy the `dist/` folder** to your hosting service

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Environment Configuration

The project uses Vite environment variables:

**`.env.development`** (for `npm run dev`):
```env
VITE_API_URL=http://localhost:8081
```

**`.env.production`** (for `npm run build`):
```env
VITE_API_URL=https://urlshortener-app-8rw4.onrender.com
```

You can also override at build time:
```bash
VITE_API_URL=https://api.example.com npm run build
```

## 🔧 Configuration

### API Base URL

The API URL is now configured via environment variables:

**Files:**
- `.env.development` - Development URL (localhost:8081)
- `.env.production` - Production URL (update before deployment)

**Code:** `src/api/axios.ts` automatically uses the environment variable:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Theme Customization

**Location:** `src/index.css`

The brutalist theme uses CSS variables. You can customize colors by editing:

```css
:root {
  --primary: #EAB308;      /* Yellow accent */
  --bg-primary: #000000;   /* Background */
  --text-primary: #e5e5e5; /* Text color */
  --border-color: #222222; /* Borders */
  /* ... other variables */
}
```

## 📝 API Integration

The frontend expects the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### URLs
- `POST /api/urls` - Create auto-generated short URL
- `POST /api/urls/custom` - Create custom short URL
- `GET /api/urls/{shortCode}` - Get URL details
- `DELETE /api/urls/{id}` - Delete URL
- `GET /api/users/{userId}/urls` - Get user's URLs
- `GET /api/urls/stats/popular` - Get popular URLs

### Users
- `GET /api/users/username/{username}` - Get user by username

## 🐛 Troubleshooting

### CORS Errors
Ensure your backend has CORS configured to allow requests from your frontend domain.

### Backend Connection Failed
1. Check that `baseURL` in `axios.ts` is correct
2. Verify the backend is running and accessible
3. Check browser console for detailed error messages

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```


## 🤝 Support

For issues or questions, please check the backend repository or raise an issue in the project repository.
