import { Recipe } from '@/lib/types';
import { generateId } from '@/lib/recipe-utils';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: generateId(),
    title: "Classic Chocolate Chip Cookies",
    description: "Soft, chewy, and loaded with chocolate chips - the perfect comfort cookie",
    category: "Dessert",
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    ingredients: [
      { id: generateId(), name: "all-purpose flour", amount: "2¼", unit: "cups" },
      { id: generateId(), name: "baking soda", amount: "1", unit: "tsp" },
      { id: generateId(), name: "salt", amount: "1", unit: "tsp" },
      { id: generateId(), name: "butter, softened", amount: "1", unit: "cup" },
      { id: generateId(), name: "granulated sugar", amount: "¾", unit: "cup" },
      { id: generateId(), name: "brown sugar, packed", amount: "¾", unit: "cup" },
      { id: generateId(), name: "large eggs", amount: "2", unit: "" },
      { id: generateId(), name: "vanilla extract", amount: "2", unit: "tsp" },
      { id: generateId(), name: "chocolate chips", amount: "2", unit: "cups" }
    ],
    instructions: [
      "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
      "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
      "In a large bowl, cream together softened butter, granulated sugar, and brown sugar until light and fluffy, about 3-4 minutes.",
      "Beat in eggs one at a time, then stir in vanilla extract.",
      "Gradually mix in the flour mixture until just combined. Don't overmix.",
      "Fold in chocolate chips until evenly distributed.",
      "Drop rounded tablespoons of dough onto prepared baking sheets, spacing them about 2 inches apart.",
      "Bake for 9-11 minutes, or until edges are golden brown but centers still look soft.",
      "Cool on baking sheet for 5 minutes before transferring to a wire rack."
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Creamy Mushroom Risotto",
    description: "Rich and creamy Arborio rice with earthy mushrooms and Parmesan",
    category: "Dinner",
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    ingredients: [
      { id: generateId(), name: "Arborio rice", amount: "1½", unit: "cups" },
      { id: generateId(), name: "vegetable or chicken broth", amount: "6", unit: "cups" },
      { id: generateId(), name: "mixed mushrooms, sliced", amount: "8", unit: "oz" },
      { id: generateId(), name: "onion, diced", amount: "1", unit: "medium" },
      { id: generateId(), name: "garlic cloves, minced", amount: "3", unit: "" },
      { id: generateId(), name: "white wine", amount: "½", unit: "cup" },
      { id: generateId(), name: "butter", amount: "4", unit: "tbsp" },
      { id: generateId(), name: "olive oil", amount: "2", unit: "tbsp" },
      { id: generateId(), name: "Parmesan cheese, grated", amount: "¾", unit: "cup" },
      { id: generateId(), name: "fresh thyme", amount: "2", unit: "tsp" },
      { id: generateId(), name: "salt and pepper", amount: "to", unit: "taste" }
    ],
    instructions: [
      "Heat broth in a saucepan and keep warm on low heat throughout cooking.",
      "In a large skillet, heat 1 tbsp olive oil and sauté mushrooms until golden. Season with salt and pepper. Set aside.",
      "In the same pan, heat remaining oil and 1 tbsp butter. Add onion and cook until translucent, about 3-4 minutes.",
      "Add garlic and cook for another minute until fragrant.",
      "Add Arborio rice and stir to coat with oil. Toast for 2-3 minutes until edges become translucent.",
      "Pour in white wine and stir until absorbed.",
      "Add warm broth one ladle at a time, stirring constantly. Wait until each addition is absorbed before adding more.",
      "Continue this process for 18-20 minutes until rice is creamy but still has a slight bite.",
      "Stir in cooked mushrooms, remaining butter, Parmesan, and thyme.",
      "Season with salt and pepper to taste. Serve immediately while hot and creamy."
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: generateId(),
    title: "Fresh Berry Smoothie Bowl",
    description: "A nutritious and colorful breakfast packed with antioxidants",
    category: "Breakfast",
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    ingredients: [
      { id: generateId(), name: "frozen mixed berries", amount: "1½", unit: "cups" },
      { id: generateId(), name: "banana, sliced", amount: "1", unit: "large" },
      { id: generateId(), name: "Greek yogurt", amount: "½", unit: "cup" },
      { id: generateId(), name: "almond milk", amount: "¼", unit: "cup" },
      { id: generateId(), name: "honey", amount: "1", unit: "tbsp" },
      { id: generateId(), name: "granola", amount: "¼", unit: "cup" },
      { id: generateId(), name: "fresh berries", amount: "½", unit: "cup" },
      { id: generateId(), name: "coconut flakes", amount: "2", unit: "tbsp" },
      { id: generateId(), name: "chia seeds", amount: "1", unit: "tbsp" }
    ],
    instructions: [
      "Add frozen berries, half the banana, Greek yogurt, almond milk, and honey to a blender.",
      "Blend until smooth and thick, adding more almond milk if needed for desired consistency.",
      "Pour the smoothie mixture into two bowls.",
      "Top with remaining banana slices, fresh berries, granola, coconut flakes, and chia seeds.",
      "Serve immediately while cold and fresh."
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];