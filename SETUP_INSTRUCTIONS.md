# Setup Instructions - MongoDB Backend Integration

## ✅ What's Been Added

1. **Backend Server** (`server/` folder)
   - Express.js API server
   - MongoDB models (User, Task, Project)
   - RESTful API routes
   - JWT authentication

2. **Frontend API Service** (`src/services/api.ts`)
   - Centralized API client
   - Automatic token management
   - Type-safe API calls

3. **Updated Components**
   - HomeScreen now fetches real data from MongoDB
   - Ready for full integration

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/trineo-tasks`

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/trineo-tasks`)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/trineo-tasks
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trineo-tasks

PORT=5000
JWT_SECRET=your-super-secret-key-change-this
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Development (both frontend and backend):**
```bash
npm run dev:all
```

**Or separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get statistics

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update user

## 🔐 Authentication

- Register/Login stores JWT token in localStorage
- All API calls (except auth) require `Authorization: Bearer <token>` header
- Token expires after 7 days

## 📝 Next Steps

1. **Update LoginScreen** - Connect to auth API
2. **Update AddTaskScreen** - Save tasks to database
3. **Update TasksScreen** - Fetch tasks from API
4. **Update TaskDetailScreen** - Load task details
5. **Update ProfileScreen** - Load user data

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running (local) or connection string is correct (Atlas)
- Verify network access (Atlas whitelist)

**API Not Working:**
- Check backend is running on port 5000
- Verify CORS is enabled
- Check browser console for errors

**Token Issues:**
- Clear localStorage and login again
- Check JWT_SECRET is set in .env

## 📚 Files Created

- `server/index.js` - Main server file
- `server/models/` - MongoDB models
- `server/routes/` - API routes
- `src/services/api.ts` - Frontend API client
- `.env.example` - Environment variables template


