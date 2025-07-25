# Recipe Organizer - Deno Migration

Your Recipe Organizer app has been successfully migrated to use Deno with PostgreSQL and Kysely!

## What Changed

✅ **Database**: Migrated from GitHub Spark's `useKV` to PostgreSQL with Kysely ORM  
✅ **Backend**: Created REST API endpoints using Hono framework  
✅ **Frontend**: Updated React components to use fetch API instead of local storage  
✅ **Dependencies**: All packages now use npm: imports in deno.json  

## Setup Complete

Your local PostgreSQL database is ready:
- Database: `recipe_organizer`
- Tables: `recipes`, `ingredients`, `instructions`
- Credentials configured in `.env`

## Running the Application

### Quick Start (Recommended)
```bash
./start-dev.sh
```

### Manual Start (Two terminals)
Terminal 1 - API Server:
```bash
deno task api
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Access URLs:**
- Frontend: http://localhost:5173 (Vite dev server)
- API: http://localhost:3001/api (Deno server)

### Database Commands
```bash
# Run migrations (already done)
deno task migrate:up

# Rollback migrations (if needed)
deno task migrate:down
```

## API Endpoints

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/bulk` - Bulk create recipes (for sample data)

## Project Structure

```
src/
├── db/
│   ├── database.ts          # Database connection
│   ├── recipe-repository.ts # Data access layer
│   └── migrations/          # Database migrations
├── hooks/
│   └── useRecipes.ts        # Updated to use API
├── components/              # React components (unchanged)
├── lib/                     # Utility functions (unchanged)
├── dev-server.ts           # Development server
└── server.ts               # Production server

deno.json                   # Deno configuration with imports
.env                        # Database credentials
```

## Next Steps

1. **Test the Migration**: Start the dev server and verify everything works
2. **Add Features**: The database layer is ready for new features
3. **Deploy**: Use the production server (`src/server.ts`) for deployment

Your app is now fully migrated to Deno with PostgreSQL! 🎉