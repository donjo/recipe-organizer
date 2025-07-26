import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { RecipeRepository } from "./db/recipe-repository.ts";
import { Recipe } from "./lib/types.ts";

const app = new Hono();
const recipeRepo = new RecipeRepository();

// Enable CORS for all routes
app.use("/*", cors());

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

// Serve the main HTML file
app.get("/", (c) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recipe Organizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script>
      // Simple module system for development
      window.React = {};
      window.ReactDOM = {};
    </script>
    <script type="module">
      import React from 'react';
      import ReactDOM from 'react-dom/client';
      
      // Import our App component
      import App from '/src/App.tsx';
      
      // Render the app
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(React.StrictMode, null,
          React.createElement(App)
        )
      );
    </script>
  </body>
</html>`;
  return c.html(html);
});

// Handle TypeScript files
app.get("/src/*", async (c) => {
  const path = c.req.path;
  const filePath = `.${path}`;

  try {
    const content = await Deno.readTextFile(filePath);

    if (path.endsWith(".tsx") || path.endsWith(".ts")) {
      c.header("Content-Type", "application/javascript");
      // For now, just return the content - in a real setup you'd transpile
      return c.text(content);
    }

    if (path.endsWith(".css")) {
      c.header("Content-Type", "text/css");
      return c.text(content);
    }

    return c.text(content);
  } catch (error) {
    console.error("Error serving file:", error);
    return c.text("File not found", 404);
  }
});

// Handle client-side routing
app.get("/*", async (c) => {
  const html = await Deno.readTextFile("./public/index.html").catch(() => {
    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Recipe Organizer</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  });
  return c.html(html);
});

const port = parseInt(Deno.env.get("PORT") || "3000");

console.log(`🚀 Development server running at http://localhost:${port}`);
console.log(`📡 API available at http://localhost:${port}/api`);

Deno.serve({ port }, app.fetch);
