import { useState } from 'react';
import { useKV } from '@github/spark/hooks';
import { Recipe, RECIPE_CATEGORIES } from '@/lib/types';
import { filterRecipes } from '@/lib/recipe-utils';
import { SAMPLE_RECIPES } from '@/lib/sample-recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeDetail } from '@/components/RecipeDetail';
import { CookingMode } from '@/components/CookingMode';
import { DeleteRecipeDialog } from '@/components/DeleteRecipeDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { ChefHat, Plus, Search, Sparkle } from '@phosphor-icons/react';
import { toast } from 'sonner';

function App() {
  const [recipes, setRecipes] = useKV<Recipe[]>('recipes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showCooking, setShowCooking] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = filterRecipes(recipes, searchTerm, selectedCategory || undefined);

  const handleSaveRecipe = (recipe: Recipe) => {
    setRecipes(currentRecipes => {
      const existingIndex = currentRecipes.findIndex(r => r.id === recipe.id);
      if (existingIndex >= 0) {
        const updated = [...currentRecipes];
        updated[existingIndex] = recipe;
        return updated;
      } else {
        return [...currentRecipes, recipe];
      }
    });
    
    toast.success(editingRecipe ? 'Recipe updated!' : 'Recipe added!');
    setEditingRecipe(null);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowDetail(false);
    setShowForm(true);
  };

  const handleDeleteRecipe = (recipe: Recipe) => {
    setDeletingRecipe(recipe);
    setShowDetail(false);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = (recipe: Recipe) => {
    setRecipes(currentRecipes => currentRecipes.filter(r => r.id !== recipe.id));
    toast.success('Recipe deleted');
    setDeletingRecipe(null);
  };

  const handleStartCooking = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setShowDetail(false);
    setShowCooking(true);
  };

  const handleAddNew = () => {
    setEditingRecipe(null);
    setShowForm(true);
  };

  const handleLoadSampleRecipes = () => {
    setRecipes(SAMPLE_RECIPES);
    toast.success('Sample recipes loaded!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <ChefHat size={20} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Recipe Organizer</h1>
                <p className="text-sm text-muted-foreground">Your personal digital cookbook</p>
              </div>
            </div>
            <Button onClick={handleAddNew}>
              <Plus size={16} />
              Add Recipe
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search recipes or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {RECIPE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {recipes.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ChefHat size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No recipes yet</h2>
            <p className="text-muted-foreground mb-6">
              Start building your digital cookbook by adding your first recipe
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleAddNew}>
                <Plus size={16} />
                Add Your First Recipe
              </Button>
              <Button variant="outline" onClick={handleLoadSampleRecipes}>
                <Sparkle size={16} />
                Try Sample Recipes
              </Button>
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          // No Search Results
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or category filter
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          // Recipe Grid
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {selectedCategory || searchTerm 
                  ? `${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} found`
                  : `${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`
                }
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={handleSelectRecipe}
                  onStartCooking={handleStartCooking}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <RecipeForm
        recipe={editingRecipe}
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={handleSaveRecipe}
      />

      <RecipeDetail
        recipe={selectedRecipe}
        open={showDetail}
        onClose={() => setShowDetail(false)}
        onEdit={handleEditRecipe}
        onDelete={handleDeleteRecipe}
        onStartCooking={handleStartCooking}
      />

      <CookingMode
        recipe={selectedRecipe}
        open={showCooking}
        onClose={() => setShowCooking(false)}
      />

      <DeleteRecipeDialog
        recipe={deletingRecipe}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default App;