# Render Deployment Guide for OrbitTrackerDeck

## 🚀 Quick Deploy to Render

### 1. One-Click Deploy

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/NextMonthLab/OrbitTrackerDeck)

### 2. Manual Deploy Steps

#### Step 1: Database Setup
1. Create a PostgreSQL database on Render
2. Note the database connection string

#### Step 2: Web Service Setup
1. Connect your GitHub repository to Render
2. Create a new Web Service with these settings:

**Build & Deploy Settings:**
- **Build Command**: `npm ci --legacy-peer-deps && npm run build`
- **Start Command**: `npm start`
- **Environment**: `Node`
- **Plan**: `Starter` (or higher)

**Environment Variables:**
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DATABASE_URL=postgresql://username:password@host:port/database
FRONTEND_URL=https://your-app-name.onrender.com
LOG_LEVEL=info
```

#### Step 3: Deploy
1. Click "Deploy" - this will automatically build and deploy your app
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.onrender.com`

## 🔧 Build Configuration

### Package.json Scripts
The key scripts for deployment:
```json
{
  "scripts": {
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --external:fsevents",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### Dependencies
All runtime dependencies are in the `dependencies` section and will be available during production:
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token management
- `express`: Web framework
- `cors`: Cross-origin resource sharing
- `helmet`: Security headers
- `winston`: Logging
- All other production dependencies

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot find package 'bcryptjs'" Error
**Solution**: Ensure all dependencies are in the `dependencies` section (not `devDependencies`):
```bash
# Check if dependencies are properly installed
npm list bcryptjs
npm list jsonwebtoken
npm list express
```

#### 2. Build Fails
**Solution**: Use the correct build command:
```bash
npm ci --legacy-peer-deps && npm run build
```

#### 3. Database Connection Issues
**Solution**: Verify your `DATABASE_URL` environment variable:
```bash
# Example format:
DATABASE_URL=postgresql://user:password@host:port/database
```

#### 4. Port Issues
**Solution**: Render automatically assigns the port via `process.env.PORT`. The app is configured to use port 5000 by default.

### Debug Steps
1. Check Render build logs for errors
2. Verify all environment variables are set
3. Test the build locally:
   ```bash
   npm run build
   DATABASE_URL=postgresql://... JWT_SECRET=test npm start
   ```

## 🔍 Health Check

Once deployed, verify your app is working:
```bash
curl https://your-app-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "metrics": {
    "totalRequests": 0,
    "activeRequests": 0,
    "averageResponseTime": 0,
    "memoryUsage": {
      "used": 45,
      "rss": 128,
      "heapUsed": 64,
      "heapTotal": 128
    }
  }
}
```

## 🎯 Production Checklist

Before deploying:
- [ ] Database created and connection string obtained
- [ ] JWT_SECRET generated (32+ characters)
- [ ] All environment variables configured
- [ ] Build command tested locally
- [ ] Health check endpoint tested

After deploying:
- [ ] App accessible at your Render URL
- [ ] Health check returns 200 OK
- [ ] Database connection working
- [ ] Authentication endpoints functional
- [ ] Logs show no errors

## 📊 Monitoring

### Render Dashboard
- Monitor app performance in Render dashboard
- Check build logs for any issues
- Monitor resource usage

### Application Logs
- View application logs in Render console
- Check for authentication errors
- Monitor database connection status

### Custom Metrics
- Health check: `GET /api/health`
- Metrics (requires auth): `GET /api/metrics`

## 🔒 Security

### Environment Variables
Never commit sensitive values to your repository:
- `JWT_SECRET`: Use Render's environment variable feature
- `DATABASE_URL`: Automatically provided by Render database service
- Other secrets: Use Render's secure environment variables

### HTTPS
- Render automatically provides HTTPS
- App redirects HTTP to HTTPS
- SSL certificates are automatically managed

## 🚀 Scaling

### Vertical Scaling
- Upgrade to higher Render plan for more resources
- Monitor memory and CPU usage in dashboard

### Horizontal Scaling
- Use Render's autoscaling features
- Consider Redis for session storage across multiple instances

## 📈 Performance

### Optimization Tips
- Use Render's CDN for static assets
- Enable compression (already configured)
- Monitor response times via health check
- Use PostgreSQL connection pooling

### Bundle Size
The app is optimized with:
- Code splitting for client-side JavaScript
- Lazy loading for React components
- Optimized build configuration
- Compression for all assets

## 🔄 Updates

### Automatic Deployment
- Enable auto-deploy on Render
- Push to main branch triggers deployment
- Monitor deployment status in dashboard

### Manual Deployment
- Trigger manual deploy from Render dashboard
- Monitor build logs for any issues
- Verify health check after deployment

## 🆘 Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test build locally
4. Check database connectivity
5. Review application logs

For Render-specific issues, consult [Render Documentation](https://render.com/docs)