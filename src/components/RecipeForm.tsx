import { useState } from "react";
import { Ingredient, Recipe, RECIPE_CATEGORIES } from "@/lib/types.ts";
import { generateId } from "@/lib/recipe-utils.ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

interface RecipeFormProps {
  recipe?: Recipe;
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export function RecipeForm({ recipe, open, onClose, onSave }: RecipeFormProps) {
  const [title, setTitle] = useState(recipe?.title || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [category, setCategory] = useState(recipe?.category || "");
  const [prepTime, setPrepTime] = useState(recipe?.prepTime?.toString() || "");
  const [cookTime, setCookTime] = useState(recipe?.cookTime?.toString() || "");
  const [servings, setServings] = useState(recipe?.servings?.toString() || "");
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients ||
      [{ id: generateId(), name: "", amount: "", unit: "" }],
  );
  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions || [""],
  );

  const addIngredient = () => {
    setIngredients([...ingredients, {
      id: generateId(),
      name: "",
      amount: "",
      unit: "",
    }]);
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!title.trim() || !category || !prepTime || !cookTime || !servings) {
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.name.trim());
    const validInstructions = instructions.filter((inst) => inst.trim());

    if (validIngredients.length === 0 || validInstructions.length === 0) {
      return;
    }

    const now = new Date();
    const savedRecipe: Recipe = {
      id: recipe?.id || generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      prepTime: parseInt(prepTime),
      cookTime: parseInt(cookTime),
      servings: parseInt(servings),
      ingredients: validIngredients,
      instructions: validInstructions,
      createdAt: recipe?.createdAt || now,
      updatedAt: now,
    };

    onSave(savedRecipe);
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setPrepTime("");
    setCookTime("");
    setServings("");
    setIngredients([{ id: generateId(), name: "", amount: "", unit: "" }]);
    setInstructions([""]);
  };

  const handleClose = () => {
    if (!recipe) {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {recipe ? "Edit Recipe" : "Add New Recipe"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Recipe Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter recipe title"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Optional)
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the recipe"
                rows={2}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {RECIPE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings" className="text-sm font-medium">
                  Servings
                </Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="4"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Time (minutes)
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="prep-time"
                    type="number"
                    min="0"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="Prep"
                    className="h-10"
                  />
                  <Input
                    id="cook-time"
                    type="number"
                    min="0"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    placeholder="Cook"
                    className="h-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <Card variant="compact">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={ingredient.id} className="flex gap-2 items-center">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-medium shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      <Input
                        placeholder="1"
                        value={ingredient.amount}
                        onChange={(e) =>
                          updateIngredient(index, "amount", e.target.value)}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="cup"
                        value={ingredient.unit}
                        onChange={(e) =>
                          updateIngredient(index, "unit", e.target.value)}
                        className="h-9 text-sm"
                      />
                      <Input
                        placeholder="Ingredient name"
                        value={ingredient.name}
                        onChange={(e) =>
                          updateIngredient(index, "name", e.target.value)}
                        className="h-9 text-sm col-span-2"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        removeIngredient(index)}
                      disabled={ingredients.length === 1}
                      className="h-9 w-9 p-0"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addIngredient}
                size="sm"
                className="h-9 text-sm"
              >
                + Add Ingredient
              </Button>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card variant="compact">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <Textarea
                        placeholder={`Describe step ${index + 1}...`}
                        value={instruction}
                        onChange={(e) =>
                          updateInstruction(index, e.target.value)}
                        rows={2}
                        className="flex-1 text-sm resize-none"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          removeInstruction(index)}
                        disabled={instructions.length === 1}
                        className="h-9 w-9 p-0 mt-1"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addInstruction}
                size="sm"
                className="h-9 text-sm"
              >
                + Add Step
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
          >
            {recipe ? "Update Recipe" : "Save Recipe"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
