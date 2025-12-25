# Quick Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your production values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-secret-key
```

### 3. Build
```bash
npm run build
```

### 4. Start
```bash
npm start
```

## 📦 Deployment Options

### Docker Deployment
```bash
docker-compose up -d
```

### PM2 (Process Manager)
```bash
npm install -g pm2
pm2 start ecosystem.config.cjs --env production
```

### Heroku
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-uri
git push heroku main
```

## 🔒 Security Notes

- **Always** change `JWT_SECRET` in production
- Use strong MongoDB credentials
- Enable HTTPS in production
- Set `ALLOWED_ORIGINS` for CORS

See `DEPLOYMENT.md` for detailed instructions.

