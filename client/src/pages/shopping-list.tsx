import { useQuery } from "@tanstack/react-query";
import type { Recipe, MealPlan } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

type IngredientTotal = {
  name: string;
  amount: number;
  unit: string;
};

export default function ShoppingList() {
  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: mealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  // Get all recipes that are part of meal plans
  const mealPlanRecipes = mealPlans.map(plan => 
    recipes.find(recipe => recipe.id === plan.recipeId)
  ).filter((recipe): recipe is Recipe => recipe !== undefined);

  // Aggregate ingredients across all recipes
  const ingredientTotals = mealPlanRecipes.reduce((totals, recipe) => {
    recipe.ingredients.forEach(ingredient => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      if (!totals[key]) {
        totals[key] = {
          name: ingredient.name,
          amount: 0,
          unit: ingredient.unit
        };
      }
      totals[key].amount += ingredient.amount;
    });
    return totals;
  }, {} as Record<string, IngredientTotal>);

  const sortedIngredients = Object.values(ingredientTotals).sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Shopping List</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingredients Needed</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedIngredients.length > 0 ? (
            <ul className="space-y-2">
              {sortedIngredients.map((ingredient, index) => (
                <li key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span>{ingredient.name}</span>
                  <span className="text-muted-foreground">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              No ingredients needed. Add some meals to your meal plan to generate a shopping list.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
