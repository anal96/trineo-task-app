# Troubleshooting Guide

## "Failed to Fetch" Error

If you're seeing a "Failed to fetch" error, it usually means the backend server is not running or there's a connection issue.

### Solution 1: Start the Backend Server

Make sure the backend server is running:

```bash
# In a separate terminal, run:
npm run dev:server
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### Solution 2: Check MongoDB Connection

Make sure MongoDB is running:

**Local MongoDB:**
- Start MongoDB service on your computer
- Check if it's running on `mongodb://localhost:27017`

**MongoDB Atlas:**
- Verify your connection string in `.env`
- Check network access settings in Atlas dashboard

### Solution 3: Check Environment Variables

Create a `.env` file in the root directory with:

```env
MONGODB_URI=mongodb://localhost:27017/trineo-tasks
PORT=5000
JWT_SECRET=your-secret-key
VITE_API_URL=http://localhost:5000/api
```

### Solution 4: Verify Backend is Accessible

Test if the backend is running by visiting:
- http://localhost:5000/api/health

You should see:
```json
{
  "status": "ok",
  "message": "Trineo Tasks API is running"
}
```

### Solution 5: Check CORS

The backend has CORS enabled, but if you're still having issues:
- Make sure you're accessing the frontend from `http://localhost:5173` (Vite default)
- Or update CORS settings in `server/index.js` if using a different port

### Solution 6: Run Both Frontend and Backend Together

Use the combined command:

```bash
npm run dev:all
```

This runs both frontend and backend simultaneously.

## Common Issues

### Issue: "Cannot connect to server"
**Solution:** Start the backend server with `npm run dev:server`

### Issue: "MongoDB connection error"
**Solution:** 
- Check if MongoDB is installed and running
- Verify the connection string in `.env`
- For Atlas, check network access whitelist

### Issue: "Invalid credentials"
**Solution:** 
- Make sure you've run `npm run seed` to create test users
- Use the correct email format: `anal@trineo.com`
- Use the correct password: `anal@123`

### Issue: Port already in use
**Solution:** 
- Change the PORT in `.env` to a different number (e.g., 5001)
- Or stop the process using port 5000

## Quick Start Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` file exists with correct values
- [ ] Backend server is running (`npm run dev:server`)
- [ ] Test users are created (`npm run seed`)
- [ ] Frontend is running (`npm run dev`)
- [ ] Using correct email format for login


