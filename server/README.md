# Trineo Tasks Backend API

Backend server for Trineo Tasks Mobile App.

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory (not in server/):

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trineo-tasks
JWT_SECRET=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
```

## Scripts

### Start Production Server
```bash
npm start
```

### Start Development Server (with auto-reload)
```bash
npm run dev
```

### Database Utilities
```bash
# Seed database with sample data
npm run seed

# Check users in database
npm run check-users

# Fix user passwords
npm run fix-passwords

# Create sample data
npm run sample-data
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get task statistics

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Team
- `GET /api/team/members` - Get team members
- `GET /api/team/stats` - Get team statistics
- `GET /api/team/members/:id/stats` - Get member statistics

### Health Check
- `GET /api/health` - Server health check

## Project Structure

```
server/
├── index.js           # Express server entry point
├── models/            # MongoDB Mongoose models
│   ├── User.js
│   ├── Task.js
│   └── Project.js
├── routes/            # API route handlers
│   ├── auth.js
│   ├── users.js
│   ├── tasks.js
│   ├── projects.js
│   └── team.js
└── [utility scripts]  # Database utilities
```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing

## Development

The server runs on port 5000 by default (configurable via `PORT` environment variable).

For development with auto-reload:
```bash
npm run dev
```

## Production

For production deployment:
```bash
NODE_ENV=production npm start
```

Or use a process manager like PM2:
```bash
pm2 start ecosystem.config.cjs
```

