import { Recipe } from './types';

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}min`;
}

export function getTotalTime(recipe: Recipe): number {
  return recipe.prepTime + recipe.cookTime;
}

export function filterRecipes(recipes: Recipe[], searchTerm: string, category?: string): Recipe[] {
  return recipes.filter(recipe => {
    const matchesSearch = !searchTerm || 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesCategory = !category || recipe.category === category;
    
    return matchesSearch && matchesCategory;
  });
}