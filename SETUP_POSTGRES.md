# Setting Up PostgreSQL for Recipe Organizer

## Prerequisites

1. **PostgreSQL** must be installed and running on your system
2. **Deno** must be installed

## Setup Steps

### 1. Create PostgreSQL Database

First, create a new database for the recipe organizer:

```bash
# Connect to PostgreSQL as your user
psql

# Create the database
CREATE DATABASE recipe_organizer;

# Exit psql
\q
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your database credentials:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection details:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_postgres_username
DATABASE_PASSWORD=your_postgres_password
DATABASE_NAME=recipe_organizer
```

### 3. Run Database Migrations

Create the database tables by running the migration:

```bash
deno task migrate:up
```

To rollback the migrations (if needed):

```bash
deno task migrate:down
```

### 4. Update Your React App

Since you're migrating from a Vite/React setup to Deno, you'll need to:

1. Convert your React app to work with Deno
2. Or continue using Vite for the frontend and create a Deno API backend

For now, the database layer is ready. You can:
- Use the `RecipeRepository` class directly in a Deno backend API
- Create REST endpoints that your React frontend can call
- Or fully migrate to Deno for both frontend and backend

## Testing the Database Connection

You can test your database setup by creating a simple test script:

```typescript
// test-db.ts
import { RecipeRepository } from './src/db/recipe-repository.ts';

const repo = new RecipeRepository();
const recipes = await repo.getAllRecipes();
console.log('Connected! Found', recipes.length, 'recipes');
```

Run it with:
```bash
deno run --allow-net --allow-read --allow-env test-db.ts
```

## Next Steps

1. Create a REST API using Deno to serve your recipe data
2. Update your React frontend to fetch data from the API instead of using local storage
3. Or migrate the entire frontend to Deno

The database layer is now ready to store and retrieve your recipes from PostgreSQL!