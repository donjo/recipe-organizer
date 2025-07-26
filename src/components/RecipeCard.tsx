import { Recipe } from "@/lib/types";
import { formatTime, getTotalTime } from "@/lib/recipe-utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChefHat, Clock, Users } from "@phosphor-icons/react";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onStartCooking: (recipe: Recipe) => void;
}

export function RecipeCard(
  { recipe, onSelect, onStartCooking }: RecipeCardProps,
) {
  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onSelect(recipe)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {recipe.title}
            </h3>
            {recipe.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {recipe.description}
              </p>
            )}
          </div>
          <Badge variant="secondary" className="ml-2 shrink-0">
            {recipe.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{formatTime(getTotalTime(recipe))}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>
              {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          size="sm"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onStartCooking(recipe);
          }}
        >
          <ChefHat size={16} />
          Start Cooking
        </Button>
      </CardFooter>
    </Card>
  );
}
