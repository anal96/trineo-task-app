# Deployment Guide for Trineo Tasks Mobile App

This guide will help you deploy the Trineo Tasks application to production.

## Prerequisites

- Node.js 18+ and npm installed
- MongoDB database (local or cloud like MongoDB Atlas)
- A server/hosting provider (Heroku, Railway, Render, Vercel, etc.)

## Quick Start

### 1. Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your production values:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secure-random-secret-key
ALLOWED_ORIGINS=https://yourdomain.com
```

**Important:** Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Application

```bash
npm run build
```

This will:
- Build the React frontend to the `dist/` directory
- Optimize and minify assets for production

### 4. Start the Production Server

```bash
npm start
```

The server will:
- Serve the built React app from `dist/`
- Handle API requests at `/api/*`
- Run on the port specified in `PORT` environment variable

## Deployment Options

### Option 1: Single Server Deployment (Recommended)

Deploy both frontend and backend on the same server:

1. Build the frontend: `npm run build`
2. Start the server: `npm start`
3. The server serves both API and static files

**Pros:**
- Simple setup
- No CORS issues
- Single deployment process

### Option 2: Separate Frontend/Backend

Deploy frontend and backend separately:

**Backend:**
- Deploy `server/` directory
- Set environment variables
- Run: `npm start` (backend only)

**Frontend:**
- Build: `npm run build`
- Deploy `dist/` to static hosting (Vercel, Netlify, etc.)
- Set `VITE_API_URL` to your backend URL

## Platform-Specific Guides

### Heroku

1. Install Heroku CLI
2. Create `Procfile`:
```
web: npm start
```
3. Set environment variables in Heroku dashboard
4. Deploy:
```bash
git push heroku main
```

### Railway

1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will auto-detect and deploy

### Render

1. Create a new Web Service
2. Connect your repository
3. Build command: `npm run build`
4. Start command: `npm start`
5. Set environment variables

### Vercel (Frontend Only)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard

### DigitalOcean App Platform

1. Connect your repository
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Configure environment variables

## Environment Variables

### Required Variables

- `NODE_ENV`: Set to `production`
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens

### Optional Variables

- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins
- `VITE_API_URL`: Frontend API URL (for separate deployments)

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to `MONGODB_URI` in `.env`

### Option 2: Self-Hosted MongoDB

1. Install MongoDB on your server
2. Set `MONGODB_URI=mongodb://localhost:27017/trineo-tasks`

## Security Checklist

- [ ] Change `JWT_SECRET` to a secure random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` for CORS
- [ ] Use HTTPS in production
- [ ] Enable MongoDB authentication
- [ ] Set up firewall rules
- [ ] Enable rate limiting (consider adding)
- [ ] Set up SSL/TLS certificates
- [ ] Regular security updates

## Post-Deployment

### 1. Seed Initial Data (Optional)

```bash
npm run seed
```

### 2. Create Admin User

```bash
npm run check-users
```

### 3. Verify Deployment

- Check health endpoint: `https://yourdomain.com/api/health`
- Test login functionality
- Verify static files are served correctly

## Monitoring

### Health Check Endpoint

Monitor: `GET /api/health`

Response:
```json
{
  "status": "ok",
  "message": "Trineo Tasks API is running",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Logs

Check server logs for:
- MongoDB connection status
- API request logs
- Error messages

## Troubleshooting

### Build Fails

- Check Node.js version (18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors

### Server Won't Start

- Verify MongoDB connection string
- Check port availability
- Review environment variables

### Static Files Not Loading

- Verify `dist/` directory exists
- Check file permissions
- Ensure build completed successfully

### CORS Errors

- Set `ALLOWED_ORIGINS` in environment variables
- Verify frontend URL matches allowed origins

### Database Connection Issues

- Verify MongoDB URI format
- Check network connectivity
- Verify MongoDB credentials

## Performance Optimization

1. **Enable Compression:**
   - Consider adding `compression` middleware
   - Enable gzip in your reverse proxy (nginx, etc.)

2. **Use CDN:**
   - Serve static assets from CDN
   - Use services like Cloudflare

3. **Database Indexing:**
   - Add indexes for frequently queried fields
   - Monitor query performance

4. **Caching:**
   - Implement Redis for session storage
   - Cache frequently accessed data

## Scaling

### Horizontal Scaling

- Use load balancer
- Multiple server instances
- Shared MongoDB database
- Session storage in Redis

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Enable database connection pooling

## Backup Strategy

1. **Database Backups:**
   - Regular MongoDB backups
   - Automated backup scripts
   - Test restore procedures

2. **Code Backups:**
   - Version control (Git)
   - Regular commits
   - Tag releases

## Support

For issues or questions:
- Check logs for error messages
- Review environment configuration
- Verify all dependencies are installed

