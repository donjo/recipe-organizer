import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { RecipeRepository } from "./db/recipe-repository.ts";
import { Recipe } from "./lib/types.ts";

const app = new Hono();
const recipeRepo = new RecipeRepository();

// Enable CORS for all routes
app.use(
  "/*",
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Vite dev server and production
    credentials: true,
  }),
);

// API Routes
const api = new Hono();

// Get all recipes
api.get("/recipes", async (c) => {
  try {
    const recipes = await recipeRepo.getAllRecipes();
    return c.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return c.json({ error: "Failed to fetch recipes" }, 500);
  }
});

// Get single recipe
api.get("/recipes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const recipe = await recipeRepo.getRecipeById(id);

    if (!recipe) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    return c.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return c.json({ error: "Failed to fetch recipe" }, 500);
  }
});

// Create recipe
api.post("/recipes", async (c) => {
  try {
    const body = await c.req.json<
      Omit<Recipe, "id" | "createdAt" | "updatedAt">
    >();
    const recipe = await recipeRepo.createRecipe(body);
    return c.json(recipe, 201);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return c.json({ error: "Failed to create recipe" }, 500);
  }
});

// Update recipe
api.put("/recipes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json<
      Omit<Recipe, "id" | "createdAt" | "updatedAt">
    >();
    const recipe = await recipeRepo.updateRecipe(id, body);
    return c.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return c.json({ error: "Failed to update recipe" }, 500);
  }
});

// Delete recipe
api.delete("/recipes/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await recipeRepo.deleteRecipe(id);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return c.json({ error: "Failed to delete recipe" }, 500);
  }
});

// Bulk create recipes (for sample data)
api.post("/recipes/bulk", async (c) => {
  try {
    const recipes = await c.req.json<Recipe[]>();

    for (const recipe of recipes) {
      await recipeRepo.createRecipe(recipe);
    }

    return c.json({ success: true, count: recipes.length });
  } catch (error) {
    console.error("Error bulk creating recipes:", error);
    return c.json({ error: "Failed to create recipes" }, 500);
  }
});

// Mount API routes
app.route("/api", api);

// Health check
app.get(
  "/health",
  (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

const port = parseInt(Deno.env.get("API_PORT") || "3001");

console.log(`🔌 API server running at http://localhost:${port}`);
console.log(`📡 API endpoints available at http://localhost:${port}/api`);

Deno.serve({ port }, app.fetch);
