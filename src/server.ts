import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { serveStatic } from '@hono/hono/deno';
import { RecipeRepository } from './db/recipe-repository.ts';
import { Recipe } from './lib/types.ts';

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors());

// API Routes
const api = new Hono();

// Get all recipes
api.get('/recipes', async (c) => {
  try {
    const recipeRepo = new RecipeRepository();
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
    const recipeRepo = new RecipeRepository();
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
    const recipeRepo = new RecipeRepository();
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
    const recipeRepo = new RecipeRepository();
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
    const recipeRepo = new RecipeRepository();
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
    const recipeRepo = new RecipeRepository();
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

// Serve static assets (JS, CSS, images, etc.)
app.use('/assets/*', serveStatic({ root: './dist' }));

// Serve index.html for all other routes (SPA routing)
app.get('*', async (c) => {
  // Skip if it's an API route
  if (c.req.path.startsWith('/api') || c.req.path === '/health') {
    return c.notFound();
  }
  
  try {
    const html = await Deno.readTextFile('./dist/index.html');
    return c.html(html);
  } catch (error) {
    console.error('Failed to serve index.html:', error);
    return c.text('Frontend build not found', 404);
  }
});

const port = parseInt(Deno.env.get('PORT') || '3000');

console.log(`🚀 Server running at http://localhost:${port}`);
console.log(`📡 API available at http://localhost:${port}/api`);

Deno.serve({ port }, app.fetch);