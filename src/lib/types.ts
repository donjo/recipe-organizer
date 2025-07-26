export interface Recipe {
  id: string;
  title: string;
  description?: string;
  category: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export const RECIPE_CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Appetizer",
  "Snack",
  "Beverage",
  "Other",
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];
