# Recipe Organizer - GitHub Copilot Instructions

Recipe Organizer is a full-stack web application built with Deno, React+Vite,
PostgreSQL, and Hono. It provides a recipe management system with a modern React
frontend and a Deno-based API backend.

**ALWAYS follow these instructions first and only fallback to search or bash
commands when you encounter unexpected information that does not match the
information here.**

## Quick Start (Fresh Clone)

**Follow these steps IN ORDER for a fresh repository clone:**

1. `curl -fsSL https://deno.land/install.sh | sh` - install Deno (if not already installed)
2. `cp .env.example .env` - copy environment file
3. `npm install --legacy-peer-deps` - install frontend dependencies (~20s)
4. `npm run build` - build the application (~11s)
5. `npm run preview` - test the built app at http://localhost:4173
6. `deno fmt && deno lint` - verify code quality (<1s each)

**For database functionality (optional):**
7. Install and start PostgreSQL
8. Create database: `createdb recipe_organizer`
9. Update `.env` with database credentials
10. `deno task migrate:up` - run database migrations

## Working Effectively

### Environment Setup

- Install Deno: `curl -fsSL https://deno.land/install.sh | sh` or download from
  https://github.com/denoland/deno/releases/latest
- Install Node.js: Use Node.js 20.x or later with npm
- Install PostgreSQL: Required for database functionality
- Copy environment file: `cp .env.example .env` and update with your database
  credentials

### Build Commands (TESTED AND VALIDATED)

All build commands are FAST and complete in under 30 seconds:

- **Primary build**: `npm run build` -- completes in ~11 seconds (includes
  TypeScript compilation). NEVER CANCEL.
- **Alternative build**: `deno task build` -- completes in ~7 seconds BUT only works before npm install. NEVER CANCEL.
- **Preview built app**: `npm run preview` -- serves built files on
  http://localhost:4173
- **Install npm dependencies**: `npm install --legacy-peer-deps` -- completes in
  ~20 seconds. The `--legacy-peer-deps` flag is REQUIRED due to React type
  conflicts.

**IMPORTANT**: After running `npm install`, always use `npm run build` instead of `deno task build` due to dependency resolution conflicts.

### Development Servers (TESTED AND VALIDATED)

All development servers start in under 10 seconds:

- **Frontend only (Vite)**: `deno task dev` OR `npm run dev` -- starts on
  http://localhost:5173
- **API server only**: `deno task api` -- starts on http://localhost:3001
  (requires database)
- **Full development environment**: `./start-dev.sh` -- starts both API and
  frontend servers

### Database Operations

- **Setup database**: Create PostgreSQL database named `recipe_organizer`
- **Run migrations**: `deno task migrate:up` -- creates all tables and indexes
- **Rollback migrations**: `deno task migrate:down` -- drops all tables
- **Database connection**: Uses environment variables from `.env` file

### Code Quality (TESTED AND VALIDATED)

- **Format code**: `deno fmt` -- completes in <1 second
- **Check formatting**: `deno fmt --check` -- completes in <1 second
- **Lint code**: `deno lint` -- completes in <1 second

## Validation Scenarios

**ALWAYS run these validation steps after making changes:**

### Basic Frontend Validation

1. Build the application: `deno task build`
2. Start preview server: `npm run preview`
3. Visit http://localhost:4173 and verify the Recipe Organizer loads
4. Check browser console for any errors

### Full Stack Validation (Requires Database)

1. Ensure PostgreSQL is running with `recipe_organizer` database
2. Run migrations: `deno task migrate:up`
3. Start API server: `deno task api`
4. In separate terminal, start frontend: `npm run dev`
5. Visit http://localhost:5173 and test:
   - Creating a new recipe
   - Viewing recipe list
   - Editing an existing recipe
   - Deleting a recipe

### Code Quality Validation

- **ALWAYS run before committing**: `deno fmt && deno lint`
- Both commands complete in under 1 second
- Fix any formatting issues before proceeding

## Common Issues and Solutions

### SSL Certificate Issues (Environment-Specific)

- In sandboxed environments, add `--unsafely-ignore-certificate-errors` to Deno
  commands if encountering certificate validation errors
- This is an environment limitation, not a code issue

### npm Dependency Issues

- **ALWAYS use**: `npm install --legacy-peer-deps`
- Required due to React 19 vs React 18 type conflicts in dependencies
- Never use plain `npm install` - it will fail

### Database Connection Issues

- Verify PostgreSQL is running: `sudo service postgresql status`
- Check `.env` file has correct database credentials
- Ensure database `recipe_organizer` exists

### Build Issues

- If Vite build fails, try clearing cache: `rm -rf node_modules/.vite`
- Ensure all dependencies are installed with `npm install --legacy-peer-deps`

## Important File Locations

### Configuration Files

- `deno.json` - Deno configuration and task definitions
- `package.json` - npm dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `.env` - Environment variables (copy from `.env.example`)

### Source Code Structure

- `src/server.ts` - Production server (serves API + static files)
- `src/api-server.ts` - Development API server
- `src/db/` - Database layer (migrations, repositories)
- `src/components/` - React UI components
- `src/hooks/` - React custom hooks
- `src/lib/` - Shared utilities and types

### Key Development Files

- `start-dev.sh` - Convenience script to start both servers
- `dist/` - Built frontend files (created by build commands)

## Command Reference

### Deno Tasks (Primary)

```bash
deno task build        # Build frontend (~7s)
deno task dev          # Start Vite dev server
deno task api          # Start API server (requires DB)
deno task start        # Start production server
deno task migrate:up   # Run database migrations
deno task migrate:down # Rollback migrations
```

### npm Scripts (Alternative)

```bash
npm install --legacy-peer-deps  # Install dependencies (~20s)
npm run build          # Build with TypeScript (~11s)
npm run dev            # Start Vite dev server
npm run preview        # Preview built app
```

### Code Quality

```bash
deno fmt              # Format all code (<1s)
deno fmt --check      # Check formatting (<1s)
deno lint             # Lint all code (<1s)
```

## Timeout Guidelines

**ALL commands in this repository are fast and complete within 30 seconds:**

- Build commands: 7-11 seconds
- Development servers: <10 seconds to start
- npm install: ~20 seconds
- Linting/formatting: <1 second
- Database migrations: <5 seconds

**NEVER set timeouts longer than 60 seconds for any command in this
repository.**

## Development Workflow

### For Frontend Changes

1. `npm install --legacy-peer-deps` - install dependencies (first time only)
2. `npm run dev` - start development server
3. Make changes to React components in `src/`
4. Test at http://localhost:5173
5. `deno fmt && deno lint` - format and lint
6. `npm run build` - build for production
7. `npm run preview` - test built version

### For Backend Changes

1. `deno task api` - start API server (requires database setup)
2. Make changes to `src/db/` or `src/api-server.ts`
3. Server auto-reloads with `--watch` flag
4. Test API endpoints at http://localhost:3001/api
5. `deno fmt && deno lint` - format and lint

### For Database Changes

1. Create migration in `src/db/migrations/`
2. `deno task migrate:up` - apply migrations
3. Test with API server: `deno task api`
4. Validate with frontend: `npm run dev`

## Production Deployment

The application is production-ready and can be deployed to:

- Deno Deploy (recommended) - see `DENO_DEPLOY_CONFIG.md`
- Railway, Heroku, DigitalOcean - see `DEPLOYMENT.md`

Always run `npm run build` before deployment to create production assets.
