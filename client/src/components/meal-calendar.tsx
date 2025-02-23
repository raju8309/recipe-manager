import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Recipe, MealPlan, InsertMealPlan } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MealCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function MealCalendar({ selectedDate, onDateSelect }: MealCalendarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMealDate, setSelectedMealDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState("breakfast");
  const { toast } = useToast();

  const { data: recipes = [] } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes"],
  });

  const { data: mealPlans = [] } = useQuery<MealPlan[]>({
    queryKey: ["/api/meal-plans"],
  });

  const addMealMutation = useMutation({
    mutationFn: async (data: { date: Date; recipeId: number; mealType: string }) => {
      const mealPlanData = {
        date: data.date.toISOString(),
        recipeId: data.recipeId,
        mealType: data.mealType,
      };
      const res = await apiRequest("POST", "/api/meal-plans", mealPlanData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meal-plans"] });
      toast({
        title: "Meal added",
        description: "Your meal has been added to the plan.",
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const handleAddMeal = async (recipeId: number) => {
    if (!selectedMealDate) return;

    await addMealMutation.mutate({
      date: selectedMealDate,
      recipeId,
      mealType: selectedMealType,
    });
  };

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((date) => {
        const dayMealPlans = mealPlans.filter((plan) =>
          isSameDay(new Date(plan.date), date)
        );

        const isSelected = isSameDay(date, selectedDate);

        return (
          <Card
            key={date.toISOString()}
            className={`cursor-pointer transition-colors ${
              isSelected ? "border-primary" : ""
            }`}
            onClick={() => onDateSelect(date)}
          >
            <CardContent className="p-3">
              <div className="text-sm font-medium mb-2">
                {format(date, "EEE d")}
              </div>
              <div className="space-y-2">
                {["breakfast", "lunch", "dinner"].map((type) => {
                  const meal = dayMealPlans.find((p) => p.mealType === type);
                  const recipe = meal
                    ? recipes.find((r) => r.id === meal.recipeId)
                    : null;

                  return (
                    <div key={type} className="relative">
                      <div className="text-xs text-muted-foreground capitalize mb-1">
                        {type}
                      </div>
                      {recipe ? (
                        <div className="text-xs truncate">{recipe.name}</div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full h-6 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMealDate(date);
                            setSelectedMealType(type);
                            setDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Add meal for {selectedMealDate ? format(selectedMealDate, "MMMM d") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedMealType} onValueChange={setSelectedMealType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              {recipes.map((recipe) => (
                <Button
                  key={recipe.id}
                  variant="outline"
                  onClick={() => handleAddMeal(recipe.id)}
                >
                  {recipe.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}