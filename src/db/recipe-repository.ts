import { db } from "./database.ts";
import { Ingredient, Recipe } from "../lib/types.ts";
import { v4 as uuidv4 } from "uuid";

export class RecipeRepository {
  // Get all recipes with their ingredients and instructions
  async getAllRecipes(): Promise<Recipe[]> {
    const recipesData = await db
      .selectFrom("recipes")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();

    const recipes: Recipe[] = [];

    for (const recipeData of recipesData) {
      // Get ingredients for this recipe
      const ingredients = await db
        .selectFrom("ingredients")
        .selectAll()
        .where("recipe_id", "=", recipeData.id)
        .orderBy("order_index")
        .execute();

      // Get instructions for this recipe
      const instructions = await db
        .selectFrom("instructions")
        .selectAll()
        .where("recipe_id", "=", recipeData.id)
        .orderBy("step_number")
        .execute();

      recipes.push({
        id: recipeData.id,
        title: recipeData.title,
        description: recipeData.description || undefined,
        category: recipeData.category,
        prepTime: recipeData.prep_time,
        cookTime: recipeData.cook_time,
        servings: recipeData.servings,
        ingredients: ingredients.map((ing) => ({
          id: ing.id,
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit,
        })),
        instructions: instructions.map((inst) => inst.instruction),
        createdAt: recipeData.created_at,
        updatedAt: recipeData.updated_at,
      });
    }

    return recipes;
  }

  // Get a single recipe by ID
  async getRecipeById(id: string): Promise<Recipe | null> {
    const recipeData = await db
      .selectFrom("recipes")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!recipeData) return null;

    const ingredients = await db
      .selectFrom("ingredients")
      .selectAll()
      .where("recipe_id", "=", id)
      .orderBy("order_index")
      .execute();

    const instructions = await db
      .selectFrom("instructions")
      .selectAll()
      .where("recipe_id", "=", id)
      .orderBy("step_number")
      .execute();

    return {
      id: recipeData.id,
      title: recipeData.title,
      description: recipeData.description || undefined,
      category: recipeData.category,
      prepTime: recipeData.prep_time,
      cookTime: recipeData.cook_time,
      servings: recipeData.servings,
      ingredients: ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
      })),
      instructions: instructions.map((inst) => inst.instruction),
      createdAt: recipeData.created_at,
      updatedAt: recipeData.updated_at,
    };
  }

  // Create a new recipe
  async createRecipe(
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
  ): Promise<Recipe> {
    const id = uuidv4();
    const now = new Date();

    // Start a transaction
    const result = await db.transaction().execute(async (trx) => {
      // Insert the recipe
      await trx
        .insertInto("recipes")
        .values({
          id,
          title: recipe.title,
          description: recipe.description || null,
          category: recipe.category,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          created_at: now,
          updated_at: now,
        })
        .execute();

      // Insert ingredients
      if (recipe.ingredients.length > 0) {
        await trx
          .insertInto("ingredients")
          .values(
            recipe.ingredients.map((ing, index) => ({
              id: uuidv4(),
              recipe_id: id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              order_index: index,
            })),
          )
          .execute();
      }

      // Insert instructions
      if (recipe.instructions.length > 0) {
        await trx
          .insertInto("instructions")
          .values(
            recipe.instructions.map((instruction, index) => ({
              id: uuidv4(),
              recipe_id: id,
              step_number: index + 1,
              instruction,
            })),
          )
          .execute();
      }

      return {
        ...recipe,
        id,
        createdAt: now,
        updatedAt: now,
      };
    });

    return result;
  }

  // Update an existing recipe
  async updateRecipe(
    id: string,
    recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt">,
  ): Promise<Recipe> {
    const now = new Date();

    const result = await db.transaction().execute(async (trx) => {
      // Update the recipe
      await trx
        .updateTable("recipes")
        .set({
          title: recipe.title,
          description: recipe.description || null,
          category: recipe.category,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          updated_at: now,
        })
        .where("id", "=", id)
        .execute();

      // Delete existing ingredients and instructions
      await trx.deleteFrom("ingredients").where("recipe_id", "=", id).execute();
      await trx.deleteFrom("instructions").where("recipe_id", "=", id)
        .execute();

      // Insert new ingredients
      if (recipe.ingredients.length > 0) {
        await trx
          .insertInto("ingredients")
          .values(
            recipe.ingredients.map((ing, index) => ({
              id: uuidv4(),
              recipe_id: id,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
              order_index: index,
            })),
          )
          .execute();
      }

      // Insert new instructions
      if (recipe.instructions.length > 0) {
        await trx
          .insertInto("instructions")
          .values(
            recipe.instructions.map((instruction, index) => ({
              id: uuidv4(),
              recipe_id: id,
              step_number: index + 1,
              instruction,
            })),
          )
          .execute();
      }

      // Get the original created_at
      const original = await trx
        .selectFrom("recipes")
        .select("created_at")
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

      return {
        ...recipe,
        id,
        createdAt: original.created_at,
        updatedAt: now,
      };
    });

    return result;
  }

  // Delete a recipe
  async deleteRecipe(id: string): Promise<void> {
    await db.deleteFrom("recipes").where("id", "=", id).execute();
  }

  // Load sample recipes (for initial data)
  async loadSampleRecipes(recipes: Recipe[]): Promise<void> {
    for (const recipe of recipes) {
      await this.createRecipe(recipe);
    }
  }
}
