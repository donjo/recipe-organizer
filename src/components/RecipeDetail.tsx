import { Recipe } from '@/lib/types';
import { formatTime, getTotalTime } from '@/lib/recipe-utils';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ChefHat, ArrowLeft, Pencil, Trash } from '@phosphor-icons/react';

interface RecipeDetailProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
}

export function RecipeDetail({ recipe, open, onClose, onEdit, onDelete, onStartCooking }: RecipeDetailProps) {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ArrowLeft size={16} />
                </Button>
                <Badge variant="secondary">{recipe.category}</Badge>
              </div>
              <h1 className="text-2xl font-bold mb-2">{recipe.title}</h1>
              {recipe.description && (
                <p className="text-muted-foreground">{recipe.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(recipe)}>
                <Pencil size={16} />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDelete(recipe)}>
                <Trash size={16} />
                Delete
              </Button>
            </div>
          </div>

          {/* Recipe Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground" />
              <div>
                <span className="font-medium">Total: {formatTime(getTotalTime(recipe))}</span>
                <div className="text-muted-foreground">
                  Prep: {formatTime(recipe.prepTime)} • Cook: {formatTime(recipe.cookTime)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-muted-foreground" />
              <span>{recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <Separator />

          {/* Ingredients */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span>
                    <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>{' '}
                    {ingredient.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Instructions */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">
                    {index + 1}
                  </div>
                  <p className="flex-1 leading-relaxed">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={() => onStartCooking(recipe)} className="flex-1">
              <ChefHat size={16} />
              Start Cooking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}