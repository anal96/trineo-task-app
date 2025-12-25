# Trineo Tasks Mobile App - Project Structure

## 📁 Complete Directory Structure

```
Trineo Tasks Mobile App UI/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies and scripts
│   ├── package-lock.json          # Locked dependency versions
│   ├── vite.config.ts             # Vite build configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   ├── .gitignore                 # Git ignore rules
│   ├── .env                       # Environment variables (NOT in repo)
│   ├── env.example.txt            # Environment template
│   └── tsconfig.json              # TypeScript configuration (if exists)
│
├── 🐳 Deployment Files
│   ├── Dockerfile                 # Docker container configuration
│   ├── docker-compose.yml         # Docker Compose setup
│   ├── Procfile                   # Heroku deployment config
│   └── ecosystem.config.cjs       # PM2 process manager config
│
├── 📚 Documentation
│   ├── README.md                  # Main project documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── MONGODB_SETUP.md          # MongoDB setup instructions
│   ├── GITHUB_SETUP.md           # GitHub push guide
│   └── [Other documentation files]
│
├── 🌐 Frontend (React + TypeScript)
│   └── src/
│       ├── main.tsx               # React app entry point
│       │
│       ├── app/                   # Main application code
│       │   ├── App.tsx            # Root component & routing
│       │   │
│       │   ├── screens/           # Screen components
│       │   │   ├── SplashScreen.tsx
│       │   │   ├── OnboardingScreen.tsx
│       │   │   ├── LoginScreen.tsx
│       │   │   ├── HomeScreen.tsx
│       │   │   ├── TasksScreen.tsx
│       │   │   ├── TaskDetailScreen.tsx
│       │   │   ├── AddTaskScreen.tsx
│       │   │   ├── TeamProgressScreen.tsx
│       │   │   └── ProfileScreen.tsx
│       │   │
│       │   ├── components/       # Reusable components
│       │   │   ├── trineo/        # App-specific components
│       │   │   │   ├── BottomNav.tsx
│       │   │   │   ├── TaskCard.tsx
│       │   │   │   ├── ProjectCard.tsx
│       │   │   │   ├── CircularProgress.tsx
│       │   │   │   ├── ProgressChart.tsx
│       │   │   │   ├── MemberProgressCard.tsx
│       │   │   │   ├── TeamStatsCard.tsx
│       │   │   │   ├── InstallPrompt.tsx
│       │   │   │   └── TrineoIcon.tsx
│       │   │   │
│       │   │   ├── ui/            # UI component library (shadcn/ui)
│       │   │   │   ├── button.tsx
│       │   │   │   ├── card.tsx
│       │   │   │   ├── input.tsx
│       │   │   │   ├── dialog.tsx
│       │   │   │   └── [50+ UI components]
│       │   │   │
│       │   │   └── figma/        # Figma-specific components
│       │   │       └── ImageWithFallback.tsx
│       │   │
│       │   └── contexts/         # React contexts
│       │       └── ThemeContext.tsx  # Dark/Light theme
│       │
│       ├── services/              # API and service layer
│       │   ├── api.ts            # API client (REST calls)
│       │   └── notifications.ts  # Push notification service
│       │
│       └── styles/                # Global styles
│           ├── index.css          # Main stylesheet
│           ├── tailwind.css       # Tailwind CSS
│           ├── theme.css          # Theme variables
│           └── fonts.css          # Font definitions
│
├── 🖥️ Backend (Node.js + Express)
│   └── server/
│       ├── index.js               # Express server entry point
│       │
│       ├── models/                # MongoDB Mongoose models
│       │   ├── User.js            # User schema
│       │   ├── Task.js            # Task schema
│       │   └── Project.js         # Project schema
│       │
│       ├── routes/                # API route handlers
│       │   ├── auth.js            # Authentication routes
│       │   ├── users.js           # User management routes
│       │   ├── tasks.js           # Task CRUD routes
│       │   ├── projects.js        # Project CRUD routes
│       │   └── team.js            # Team/analytics routes
│       │
│       └── scripts/               # Utility scripts
│           ├── seed.js            # Database seeding
│           ├── check-users.js     # User verification
│           ├── fix-passwords.js   # Password reset utility
│           └── create-sample-data.js  # Sample data generator
│
├── 📦 Public Assets
│   └── public/
│       ├── icon-192.png           # PWA icon (192x192)
│       ├── icon-512.png           # PWA icon (512x512)
│       ├── manifest.json          # PWA manifest
│       ├── sw.js                  # Service worker
│       ├── icon-generator.html    # Icon generator tool
│       └── ICONS_README.md       # Icon documentation
│
├── 🏗️ Build Output (Generated)
│   └── dist/                      # Production build (gitignored)
│       └── [Compiled assets]
│
└── 📦 Dependencies
    └── node_modules/              # npm packages (gitignored)
```

## 📂 Key Directories Explained

### `/src` - Frontend Source Code
- **Main entry**: `main.tsx` - Initializes React app
- **App logic**: `app/App.tsx` - Main routing and state management
- **Screens**: Full-page components for each route
- **Components**: Reusable UI components
- **Services**: API communication and notifications
- **Styles**: Global CSS and theme configuration

### `/server` - Backend API
- **Entry point**: `index.js` - Express server setup
- **Models**: Database schemas (Mongoose)
- **Routes**: REST API endpoints
- **Scripts**: Database utilities and helpers

### `/public` - Static Assets
- PWA icons and manifest
- Service worker for offline support
- Public files served directly

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | npm dependencies and scripts |
| `vite.config.ts` | Build tool configuration |
| `.env` | Environment variables (sensitive) |
| `.gitignore` | Files excluded from Git |
| `Dockerfile` | Container configuration |
| `docker-compose.yml` | Multi-container setup |

## 📱 Application Flow

```
User → React App (src/app/App.tsx)
  ↓
Screens (src/app/screens/)
  ↓
Components (src/app/components/)
  ↓
API Service (src/services/api.ts)
  ↓
Express Server (server/index.js)
  ↓
Routes (server/routes/)
  ↓
Models (server/models/)
  ↓
MongoDB Database
```

## 🎨 Component Hierarchy

```
App.tsx
├── SplashScreen
├── OnboardingScreen
├── LoginScreen
└── Main App (with BottomNav)
    ├── HomeScreen
    │   ├── TaskCard
    │   └── ProjectCard
    ├── TasksScreen
    │   └── TaskCard
    ├── TaskDetailScreen
    ├── AddTaskScreen
    ├── TeamProgressScreen
    │   ├── MemberProgressCard
    │   ├── ProgressChart
    │   └── TeamStatsCard
    └── ProfileScreen
```

## 🔌 API Structure

```
/api
├── /auth
│   ├── POST /register
│   └── POST /login
├── /users
│   ├── GET /me
│   └── PUT /me
├── /tasks
│   ├── GET / (list all)
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   ├── DELETE /:id
│   └── GET /stats/summary
├── /projects
│   ├── GET /
│   ├── GET /:id
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
└── /team
    ├── GET /members
    ├── GET /stats
    └── GET /members/:id/stats
```

## 📦 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🚀 Build Process

1. **Development**: `npm run dev` → Vite dev server
2. **Build**: `npm run build` → Creates `dist/` folder
3. **Production**: `npm start` → Serves `dist/` + API

## 📝 File Count Summary

- **Screens**: 9 files
- **Components**: 60+ files (UI library + custom)
- **API Routes**: 5 route files
- **Models**: 3 schema files
- **Services**: 2 service files
- **Total Source Files**: ~100+ TypeScript/JavaScript files

## 🔒 Security Files (Not in Repo)

- `.env` - Contains MongoDB URI and JWT secret
- `node_modules/` - Dependencies (too large)
- `dist/` - Build output (regenerated)

## 📚 Documentation Files

- `README.md` - Main documentation
- `DEPLOYMENT.md` - Deployment guide
- `MONGODB_SETUP.md` - Database setup
- `GITHUB_SETUP.md` - Version control
- Various troubleshooting guides

---

**Last Updated**: Project structure as of deployment preparation

