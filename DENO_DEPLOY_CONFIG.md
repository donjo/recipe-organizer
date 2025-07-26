# Deno Deploy Configuration Guide

## Build Configuration for Deno Deploy

### Step 1: Connect Your Repository
1. Go to https://dash.deno.com
2. Click "New Project"
3. Connect your GitHub repository

### Step 2: Configure Build Settings

In the Deno Deploy dashboard, use these settings:

**Build Configuration:**
- **Build Command**: `deno task build`
- **Build Output Directory**: `dist`
- **Root Directory**: `.` (leave as default)

**Deployment Configuration:**
- **Entry Point**: `src/server.ts`
- **Deno.json Path**: `deno.json` (auto-detected)

### Step 3: Environment Variables

Add these environment variables in the Deno Deploy dashboard:

```
DATABASE_URL=<your-database-connection-string>
NODE_ENV=production
```

Your database URL should look like:
```
postgresql://username:password@host:port/database_name
```

### Step 4: Deploy

1. Click "Deploy"
2. Deno Deploy will:
   - Install dependencies
   - Run `deno task build` to build your frontend
   - Start your server from `src/server.ts`
   - Serve your app

## Important Notes

1. **Build Process**: The `deno task build` command runs Vite to build your React frontend into the `dist` folder.

2. **Static Files**: Your server.ts is configured to serve:
   - API routes at `/api/*`
   - Static assets from `dist/assets/*`
   - The main index.html for all other routes (SPA routing)

3. **Database**: Make sure your database allows connections from Deno Deploy's IP addresses.

## Troubleshooting

### Frontend Not Loading
- Check the build logs for any errors
- Ensure `deno task build` runs successfully locally
- Verify the `dist` folder contains `index.html` and assets

### API Not Working
- Check environment variables are set correctly
- Look at the runtime logs for database connection errors
- Test the `/health` endpoint first

### Build Failing
- Run `deno task build` locally to debug
- Check for TypeScript errors
- Ensure all dependencies are in `deno.json`

## Alternative: GitHub Actions Build

If the build step times out or has issues, you can pre-build using GitHub Actions:

1. Add this workflow to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Deno Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: denoland/setup-deno@v1
        with:
          deno-version: v1.x
      
      - name: Build frontend
        run: deno task build
      
      - name: Deploy to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: your-project-name
          entrypoint: src/server.ts
          root: .
```

2. Then in Deno Deploy, disable the build step and deploy from GitHub Actions instead.