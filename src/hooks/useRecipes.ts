import { useState, useEffect } from 'react';
import { Recipe } from '@/lib/types';

const API_BASE_URL = '/api';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load recipes on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      console.log('Loading recipes from:', `${API_BASE_URL}/recipes`);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/recipes`);
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      console.log('Loaded recipes:', data);
      setRecipes(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load recipes:', err);
      setError('Failed to load recipes. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async (recipe: Recipe) => {
    try {
      let response: Response;
      
      // Check if this is an update or create
      const existingRecipe = recipes.find(r => r.id === recipe.id);
      
      if (existingRecipe) {
        // Update existing recipe
        response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe),
        });
      } else {
        // Create new recipe
        response = await fetch(`${API_BASE_URL}/recipes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(recipe),
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save recipe');
      }
      
      const savedRecipe = await response.json();
      
      if (existingRecipe) {
        setRecipes(recipes.map(r => r.id === recipe.id ? savedRecipe : r));
      } else {
        setRecipes([...recipes, savedRecipe]);
      }
      
      return savedRecipe;
    } catch (err) {
      console.error('Failed to save recipe:', err);
      throw new Error('Failed to save recipe. Please try again.');
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete recipe');
      }
      
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      throw new Error('Failed to delete recipe. Please try again.');
    }
  };

  const loadSampleRecipes = async (sampleRecipes: Recipe[]) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/recipes/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sampleRecipes),
      });
      
      if (!response.ok) {
        throw new Error('Failed to load sample recipes');
      }
      
      await loadRecipes(); // Reload all recipes
    } catch (err) {
      console.error('Failed to load sample recipes:', err);
      throw new Error('Failed to load sample recipes. Please try again.');
    }
  };

  const clearAllRecipes = async () => {
    try {
      // Delete all recipes one by one
      for (const recipe of recipes) {
        const response = await fetch(`${API_BASE_URL}/recipes/${recipe.id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete recipe');
        }
      }
      setRecipes([]);
    } catch (err) {
      console.error('Failed to clear recipes:', err);
      throw new Error('Failed to clear recipes. Please try again.');
    }
  };

  return {
    recipes,
    loading,
    error,
    saveRecipe,
    deleteRecipe,
    loadSampleRecipes,
    clearAllRecipes,
    refreshRecipes: loadRecipes,
  };
}