# 🚀 Quick Deployment Guide

## Step 1: Environment Setup

1. **Create `.env` file** (copy from `env.example.txt`):
   ```bash
   # On Windows PowerShell:
   Copy-Item env.example.txt .env
   
   # On Linux/Mac:
   cp env.example.txt .env
   ```

2. **Edit `.env`** with your production values:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trineo-tasks
   JWT_SECRET=your-secure-secret-here
   ```

   **Generate secure JWT secret:**
   ```bash
   # Linux/Mac:
   openssl rand -base64 32
   
   # Windows PowerShell:
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Build the Application

```bash
npm run build
```

This creates the `dist/` folder with optimized production files.

## Step 4: Start the Server

```bash
npm start
```

The app will be available at `http://localhost:5000`

## 🐳 Docker Deployment (Easiest)

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📦 Other Deployment Options

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

### Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Railway/Render
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically

## ✅ Verify Deployment

1. **Health Check:**
   ```
   GET http://localhost:5000/api/health
   ```

2. **Test the App:**
   - Open browser: `http://localhost:5000`
   - Try logging in
   - Create a task
   - Check team progress

## 🔒 Security Checklist

- [ ] Changed `JWT_SECRET` to secure random value
- [ ] Set `NODE_ENV=production`
- [ ] MongoDB has authentication
- [ ] CORS configured (`ALLOWED_ORIGINS`)
- [ ] Using HTTPS in production
- [ ] `.env` file not committed to git

## 📚 More Information

- **Full Guide:** See `DEPLOYMENT.md`
- **Checklist:** See `DEPLOYMENT_CHECKLIST.md`
- **Troubleshooting:** Check server logs

## 🆘 Common Issues

**Build fails:**
- Check Node.js version (18+)
- Clear `node_modules` and reinstall

**Server won't start:**
- Check MongoDB connection
- Verify environment variables
- Check port availability

**Static files not loading:**
- Ensure `npm run build` completed
- Check `dist/` folder exists

