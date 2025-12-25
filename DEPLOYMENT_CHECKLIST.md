# Deployment Checklist

Use this checklist to ensure your app is ready for production deployment.

## Pre-Deployment

### Environment Setup
- [ ] Created `.env` file from `.env.example`
- [ ] Set `NODE_ENV=production`
- [ ] Configured `MONGODB_URI` (production database)
- [ ] Generated secure `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Set `ALLOWED_ORIGINS` for CORS (production domains)
- [ ] Verified all environment variables are set

### Code Preparation
- [ ] All code committed to version control
- [ ] No console.log statements in production code (optional)
- [ ] Error handling implemented
- [ ] API endpoints tested
- [ ] Frontend builds successfully (`npm run build`)

### Security
- [ ] Changed default JWT_SECRET
- [ ] MongoDB has authentication enabled
- [ ] CORS configured for specific origins
- [ ] HTTPS/SSL certificate ready
- [ ] Environment variables not committed to git
- [ ] `.env` file in `.gitignore`

### Database
- [ ] MongoDB database created
- [ ] Database connection string verified
- [ ] Database backups configured
- [ ] Initial data seeded (if needed)

## Deployment Steps

### Build
- [ ] Run `npm install` to install dependencies
- [ ] Run `npm run build` to build frontend
- [ ] Verify `dist/` directory created
- [ ] Check build output for errors

### Server
- [ ] Server starts successfully (`npm start`)
- [ ] Health check endpoint works (`/api/health`)
- [ ] Static files served correctly
- [ ] API endpoints accessible

### Testing
- [ ] Login functionality works
- [ ] Tasks can be created/updated/deleted
- [ ] Projects can be created/updated/deleted
- [ ] Team progress displays correctly
- [ ] Notifications work (if enabled)
- [ ] Dark mode works
- [ ] Mobile responsive design works

## Post-Deployment

### Monitoring
- [ ] Server logs accessible
- [ ] Error tracking set up
- [ ] Health check monitoring configured
- [ ] Database connection monitoring

### Performance
- [ ] Page load times acceptable
- [ ] API response times acceptable
- [ ] Database queries optimized
- [ ] Static assets cached properly

### Backup
- [ ] Database backup schedule configured
- [ ] Backup restore tested
- [ ] Code backup (Git) verified

## Platform-Specific

### Heroku
- [ ] Procfile created
- [ ] Buildpacks configured
- [ ] Environment variables set in dashboard
- [ ] Dyno scaling configured

### Docker
- [ ] Dockerfile tested locally
- [ ] docker-compose.yml configured
- [ ] Images built successfully
- [ ] Containers run correctly

### Vercel/Netlify
- [ ] Build command configured
- [ ] Environment variables set
- [ ] Domain configured
- [ ] SSL certificate active

## Rollback Plan
- [ ] Previous version tagged in Git
- [ ] Database migration rollback plan
- [ ] Backup restoration procedure documented

## Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Team members have access to documentation

---

**Last Updated:** $(date)
**Deployed By:** ________________
**Deployment Date:** ________________

