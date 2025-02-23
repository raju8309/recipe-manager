import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Recipe, MealPlan } from "@shared/schema";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { RecipeForm } from "@/components/recipe-form";

type MealType = "breakfast" | "lunch" | "dinner";

export const MealPlanner = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const { toast } = useToast();

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: mealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  const addMealMutation = useMutation({
    mutationFn: async ({ recipeId, mealType }: { recipeId: number; mealType: MealType }) => {
      const mealPlanData = {
        date: date.toISOString(),
        recipeId,
        mealType,
      };
      const res = await apiRequest("POST", "/api/meal-plans", mealPlanData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      setIsAddMealOpen(false);
      toast({
        title: "Meal added",
        description: "Your meal has been added to the plan.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const dailyMealPlans = mealPlans.filter(
    (plan) => format(new Date(plan.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];

  const handleAddMeal = (recipeId: number) => {
    addMealMutation.mutate({
      recipeId,
      mealType: selectedMealType,
    });
  };

  const handleCreateRecipeSuccess = () => {
    setIsCreateRecipeOpen(false);
    queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Meal Planner</h1>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md border"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Meals for {format(date, "MMMM d, yyyy")}
          </h2>

          {mealTypes.map((mealType) => {
            const mealPlan = dailyMealPlans.find(
              (plan) => plan.mealType === mealType
            );
            const recipe = mealPlan
              ? recipes.find((r) => r.id === mealPlan.recipeId)
              : undefined;

            return (
              <Card key={mealType}>
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <h3 className="capitalize text-lg font-medium mb-2">
                      {mealType}
                    </h3>
                    {recipe ? (
                      <p className="text-muted-foreground">{recipe.name}</p>
                    ) : (
                      <p className="text-muted-foreground">No meal planned</p>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedMealType(mealType);
                      setIsAddMealOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Meal
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedMealType} onValueChange={(value: MealType) => setSelectedMealType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Select Recipe</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreateRecipeOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Recipe
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {recipes.map((recipe) => (
                  <Button
                    key={recipe.id}
                    variant="outline"
                    onClick={() => handleAddMeal(recipe.id)}
                    className="justify-start"
                  >
                    {recipe.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateRecipeOpen} onOpenChange={setIsCreateRecipeOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create New Recipe</DialogTitle>
          </DialogHeader>
          <RecipeForm onSuccess={handleCreateRecipeSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MealPlanner;