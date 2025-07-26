# Recipe Organizer - Production Deployment Guide

Your app is ready for production deployment! Here's everything you need to know.

## ✅ Your App is Production-Ready

The app already handles:
- ✅ Environment variable configuration for database
- ✅ Production vs development mode detection
- ✅ Static file serving for built frontend
- ✅ Database connection with both `DATABASE_URL` and individual variables
- ✅ CORS configuration
- ✅ Error handling and logging

## 🔧 Required Environment Variables

Configure these environment variables on your deployment platform:

### Database Configuration (Choose One Method)

**Option 1 - Single URL (Recommended for most platforms):**
```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

**Option 2 - Individual Variables:**
```bash
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=your-database-name
```

### Server Configuration
```bash
PORT=8000                    # Port for your app (platform default usually works)
NODE_ENV=production          # Enables production mode
```

## 📦 Deployment Steps

### 1. Build the Frontend
```bash
deno task build
```
This creates a `dist/` folder with your built React app.

### 2. Run Database Migrations
On your production server (one-time setup):
```bash
deno task migrate:up
```

### 3. Start the Production Server
```bash
deno task start
```

## 🚀 Platform-Specific Instructions

### Deno Deploy (Recommended)
1. Go to https://dash.deno.com and click "New Project"
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `deno task build`
   - **Build Output Directory**: `dist`
   - **Entry Point**: `src/server.ts`
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
5. Deploy!

> **Note**: See `DENO_DEPLOY_CONFIG.md` for detailed configuration guide.

### Railway
1. Connect your GitHub repository
2. Add environment variables in Railway dashboard
3. Railway will automatically detect and run your Deno app
4. Your app will be available at the provided Railway URL

### Heroku
1. Create a `Procfile`:
   ```
   web: deno task start
   ```
2. Add environment variables in Heroku dashboard
3. Deploy via Git or GitHub integration

### DigitalOcean App Platform
1. Connect your GitHub repository
2. Set build command: `deno task build`
3. Set run command: `deno task start`
4. Add environment variables in the app settings
5. Deploy!

## 🗄️ Production Database Setup

### Recommended Services:
- **Neon** (PostgreSQL): Great for Deno apps, provides `DATABASE_URL`
- **Supabase**: Full-featured with built-in auth and APIs
- **Railway PostgreSQL**: Simple, integrated with Railway hosting
- **DigitalOcean Managed PostgreSQL**: Reliable and scalable

### Database Setup Steps:
1. Create a PostgreSQL database on your chosen service
2. Get the connection URL (usually provided as `DATABASE_URL`)
3. Run migrations: `deno task migrate:up`
4. Your app is ready!

## 🔍 Health Check

Your app includes a health check endpoint:
```
GET /health
```
Returns: `{"status":"ok","timestamp":"2025-07-25T..."}`

## 📁 File Structure for Production

```
recipe-organizer/
├── dist/                    # Built frontend (created by `deno task build`)
├── src/
│   ├── server.ts           # Production server (serves API + static files)
│   ├── db/                 # Database layer
│   └── ...                 # Rest of your app
├── deno.json               # Deno configuration
└── DEPLOYMENT.md           # This file
```

## 🔧 Troubleshooting

### Database Connection Issues
- Ensure `DATABASE_URL` or individual DB variables are set correctly
- Check that your database allows connections from your deployment platform
- Verify SSL settings if required by your database provider

### Build Issues
- Run `deno task build` locally first to test
- Ensure all dependencies are in `deno.json` imports
- Check that TypeScript compilation passes

### Runtime Issues
- Check application logs for error details
- Verify environment variables are set on the platform
- Ensure database migrations have been run

## 🎯 Next Steps After Deployment

1. **Test your live app** - Visit your deployed URL
2. **Run migrations** - `deno task migrate:up` on production
3. **Load sample data** - Use the "Load Sample Recipes" button in the app
4. **Monitor logs** - Watch for any errors or issues
5. **Set up monitoring** - Consider adding application monitoring

Your Recipe Organizer is now ready for the world! 🎉