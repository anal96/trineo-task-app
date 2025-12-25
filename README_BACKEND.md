# Trineo Tasks - Backend Setup

This app now includes a full MongoDB backend with Express.js API.

## Prerequisites

1. **MongoDB** - Install MongoDB locally or use MongoDB Atlas (cloud)
   - Local: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Atlas: Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Node.js** - Version 18 or higher

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string
   - Update `VITE_API_URL` in `.env` (for frontend)

3. **Start MongoDB:**
   - Local: Make sure MongoDB service is running
   - Atlas: Use the connection string provided

## Running the Application

### Development Mode

**Option 1: Run frontend and backend separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:server
```

**Option 2: Run both together**
```bash
npm run dev:all
```

### Production Mode

```bash
# Build frontend
npm run build

# Start backend
npm run server
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks (query: ?status=in-progress&projectId=xxx)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/trineo-tasks
PORT=5000
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:5000/api
```

## MongoDB Models

### User
- name, email, password, avatar

### Project
- name, type, color, userId, tasksCompleted, totalTasks, progress

### Task
- title, description, projectId, userId, status, priority, estimatedTime, timeSpent, progress, dueDate

## Frontend Integration

The frontend uses the API service in `src/services/api.ts`. All API calls are handled through this service with automatic token management.

## Notes

- All API routes (except auth) require authentication via JWT token
- Token is stored in localStorage after login
- Token expires after 7 days
- Passwords are hashed using bcrypt


