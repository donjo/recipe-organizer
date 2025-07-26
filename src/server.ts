import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { serveStatic } from '@hono/hono/deno';
import { RecipeRepository } from './db/recipe-repository.ts';
import { Recipe } from './lib/types.ts';

const app = new Hono();
const recipeRepo = new RecipeRepository();

// Enable CORS for all routes
app.use('/*', cors());

// API Routes
const api = new Hono();

// Get all recipes
api.get('/recipes', async (c) => {
  try {
    const recipes = await recipeRepo.getAllRecipes();
    return c.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return c.json({ error: 'Failed to fetch recipes' }, 500);
  }
});

// Get single recipe
api.get('/recipes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const recipe = await recipeRepo.getRecipeById(id);
    
    if (!recipe) {
      return c.json({ error: 'Recipe not found' }, 404);
    }
    
    return c.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return c.json({ error: 'Failed to fetch recipe' }, 500);
  }
});

// Create recipe
api.post('/recipes', async (c) => {
  try {
    const body = await c.req.json<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>();
    const recipe = await recipeRepo.createRecipe(body);
    return c.json(recipe, 201);
  } catch (error) {
    console.error('Error creating recipe:', error);
    return c.json({ error: 'Failed to create recipe' }, 500);
  }
});

// Update recipe
api.put('/recipes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>();
    const recipe = await recipeRepo.updateRecipe(id, body);
    return c.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    return c.json({ error: 'Failed to update recipe' }, 500);
  }
});

// Delete recipe
api.delete('/recipes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await recipeRepo.deleteRecipe(id);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return c.json({ error: 'Failed to delete recipe' }, 500);
  }
});

// Bulk create recipes (for sample data)
api.post('/recipes/bulk', async (c) => {
  try {
    const recipes = await c.req.json<Recipe[]>();
    
    for (const recipe of recipes) {
      await recipeRepo.createRecipe(recipe);
    }
    
    return c.json({ success: true, count: recipes.length });
  } catch (error) {
    console.error('Error bulk creating recipes:', error);
    return c.json({ error: 'Failed to create recipes' }, 500);
  }
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
app.route('/api', api);

// In development, serve files from public and src
const isDev = Deno.env.get('NODE_ENV') !== 'production';

if (isDev) {
  // Serve static files from public folder
  app.use('/public/*', serveStatic({ root: './public' }));
  
  // Serve the HTML file for the root route
  app.get('/', async (c) => {
    const html = await Deno.readTextFile('./public/index.html');
    return c.html(html);
  });
  
  // Handle client-side routing - serve index.html for all non-API routes
  app.get('/*', async (c) => {
    const html = await Deno.readTextFile('./public/index.html');
    return c.html(html);
  });
} else {
  // In production, serve built files
  // First, try to serve static files (JS, CSS, images, etc.)
  app.use('/*', async (c, next) => {
    const path = c.req.path;
    
    // Skip API and health routes
    if (path.startsWith('/api') || path === '/health') {
      return next();
    }
    
    // Try to serve the exact file if it exists
    if (path !== '/') {
      try {
        const filePath = `./dist${path}`;
        const stat = await Deno.stat(filePath);
        if (stat.isFile) {
          return serveStatic({ root: './dist' })(c, next);
        }
      } catch {
        // File doesn't exist, continue to next handler
      }
    }
    
    // For all other routes, serve index.html (SPA routing)
    try {
      const html = await Deno.readTextFile('./dist/index.html');
      return c.html(html);
    } catch (error) {
      console.error('Failed to serve index.html:', error);
      return c.text('Frontend not built. Run "deno task build" first.', 404);
    }
  });
}

const port = parseInt(Deno.env.get('PORT') || '3000');

console.log(`🚀 Server running at http://localhost:${port}`);
console.log(`📡 API available at http://localhost:${port}/api`);

Deno.serve({ port }, app.fetch);