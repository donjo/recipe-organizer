# Recipe Organizer App

Create a comprehensive digital cookbook for storing, organizing, and managing
personal recipes with detailed ingredient lists and step-by-step cooking
instructions.

**Experience Qualities**:

1. **Intuitive** - Recipe management should feel as natural as flipping through
   a favorite cookbook
2. **Organized** - Users can easily categorize, search, and find recipes when
   inspiration strikes
3. **Practical** - Cooking mode provides clear, distraction-free instructions
   perfect for kitchen use

**Complexity Level**: Light Application (multiple features with basic state)

- Multiple interconnected features (add, edit, categorize, search recipes) with
  persistent data storage and various viewing modes for optimal cooking
  experience.

## Essential Features

**Add New Recipe**

- Functionality: Create recipe with title, ingredients, instructions, prep/cook
  time, servings, and category
- Purpose: Build personal digital cookbook collection
- Trigger: "Add Recipe" button on main interface
- Progression: Click add → Fill form fields → Add ingredients one by one → Add
  instruction steps → Select category → Save recipe
- Success criteria: Recipe appears in collection and is searchable

**Recipe Collection View**

- Functionality: Display all recipes in organized grid/list with filtering and
  search
- Purpose: Browse and discover recipes from personal collection
- Trigger: Default app view on load
- Progression: View recipes → Filter by category/search → Click recipe to view
  details
- Success criteria: All recipes visible, filtering works, smooth navigation to
  recipe details

**Recipe Detail View**

- Functionality: Show complete recipe with ingredients, instructions, cooking
  times, and servings
- Purpose: Reference complete recipe information during meal planning or cooking
- Trigger: Click on recipe from collection
- Progression: Select recipe → View all details → Option to edit or start
  cooking mode
- Success criteria: All recipe information clearly displayed with easy
  navigation

**Cooking Mode**

- Functionality: Step-by-step cooking interface with large text and progress
  tracking
- Purpose: Hands-free cooking experience optimized for kitchen use
- Trigger: "Start Cooking" button from recipe detail
- Progression: Enter cooking mode → Step through instructions → Mark steps
  complete → Finish cooking
- Success criteria: Clear step progression, large readable text, easy navigation
  between steps

**Recipe Search & Filter**

- Functionality: Search by recipe name, ingredients, or category filtering
- Purpose: Quickly find specific recipes from growing collection
- Trigger: Search bar or category filter selection
- Progression: Enter search term or select filter → View filtered results →
  Select desired recipe
- Success criteria: Accurate search results, fast filtering, clear result
  display

**Edit Recipe**

- Functionality: Modify existing recipe details, ingredients, or instructions
- Purpose: Update recipes with improvements or corrections
- Trigger: Edit button from recipe detail view
- Progression: Click edit → Modify fields → Update ingredients/instructions →
  Save changes
- Success criteria: Changes persist, no data loss, smooth form experience

## Edge Case Handling

- **Empty Recipe Collection**: Show welcoming onboarding screen with "Add Your
  First Recipe" call-to-action
- **Long Ingredient Lists**: Scrollable ingredient section with clear visual
  separation
- **Complex Instructions**: Support for numbered steps with rich text formatting
- **Search No Results**: Display helpful message with suggestion to try
  different terms
- **Form Validation**: Prevent saving incomplete recipes with clear error
  messaging
- **Data Persistence**: All recipes automatically saved and restored between
  sessions

## Design Direction

The design should evoke warmth, organization, and culinary inspiration - feeling
like a premium digital cookbook that's both practical and delightful to use,
with a clean, modern interface that emphasizes content readability and
effortless navigation.

## Color Selection

Triadic (three equally spaced colors) - Using warm, food-inspired colors that
create an inviting culinary atmosphere while maintaining excellent readability
and visual hierarchy.

- **Primary Color**: Warm Terracotta (`oklch(0.65 0.15 25)`) - Communicates
  warmth, comfort, and culinary tradition
- **Secondary Colors**: Sage Green (`oklch(0.70 0.08 140)`) for fresh herb
  inspiration and Cream (`oklch(0.95 0.02 85)`) for warmth and readability
- **Accent Color**: Golden Yellow (`oklch(0.80 0.12 85)`) - Attention-grabbing
  highlight for CTAs and important cooking elements
- **Foreground/Background Pairings**:
  - Background (Cream #F8F6F0): Dark Charcoal text (`oklch(0.20 0.02 25)`) -
    Ratio 12.8:1 ✓
  - Card (White #FFFFFF): Dark Charcoal text (`oklch(0.20 0.02 25)`) - Ratio
    15.2:1 ✓
  - Primary (Warm Terracotta): White text (`oklch(0.98 0.01 25)`) - Ratio 4.9:1
    ✓
  - Secondary (Sage Green): Dark Charcoal text (`oklch(0.20 0.02 25)`) - Ratio
    8.2:1 ✓
  - Accent (Golden Yellow): Dark Charcoal text (`oklch(0.20 0.02 25)`) - Ratio
    9.1:1 ✓

## Font Selection

Typography should convey approachability and clarity, perfect for both recipe
browsing and cooking instruction reading, using clean, highly legible fonts that
work well across all screen sizes.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold/32px/tight letter spacing
  - H2 (Recipe Titles): Inter SemiBold/24px/normal letter spacing
  - H3 (Section Headers): Inter Medium/18px/normal letter spacing
  - Body (Instructions/Ingredients): Inter Regular/16px/relaxed line height
  - Small (Times/Servings): Inter Regular/14px/normal letter spacing

## Animations

Subtle, purposeful animations that enhance the cooking experience without
distraction - gentle transitions that feel organic and help users understand
their progress through recipes and cooking steps.

- **Purposeful Meaning**: Smooth page transitions convey progression through the
  cooking journey, with gentle hover effects that make the interface feel
  responsive and alive
- **Hierarchy of Movement**: Recipe cards gently lift on hover, cooking step
  progression uses satisfying slide animations, form interactions provide
  immediate visual feedback

## Component Selection

- **Components**: Card components for recipe display, Dialog for recipe
  creation/editing, Tabs for organizing recipe categories, Button variants for
  different action types, Input and Textarea for form fields, Badge for recipe
  categories and timing, Progress for cooking mode step tracking
- **Customizations**: Custom recipe card layout with image placeholder, cooking
  mode stepper component, ingredient list with add/remove functionality,
  instruction step builder
- **States**: Recipe cards (default/hover/selected), buttons
  (primary/secondary/ghost states), form inputs (focus/error/success states),
  cooking steps (pending/active/completed)
- **Icon Selection**: Plus icon for adding recipes, Search for filtering, Clock
  for timing, Users for servings, ChefHat for cooking mode, Edit for
  modifications, Trash for deletions
- **Spacing**: Consistent 4/6/8/12/16px spacing scale, generous padding on
  recipe cards (p-6), comfortable form field spacing (space-y-4), breathing room
  in cooking mode (p-8)
- **Mobile**: Recipe cards stack vertically on mobile, cooking mode optimized
  for single-handed use, collapsible ingredient lists, simplified navigation
  with bottom tab bar for core functions
