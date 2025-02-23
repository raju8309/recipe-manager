import { Progress } from "@/components/ui/progress";

interface NutritionInfoProps {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servings: number;
}

export const NutritionInfo = ({
  calories,
  protein,
  carbs,
  fat,
  servings,
}: NutritionInfoProps) => {
  const perServing = {
    calories: Math.round(calories / servings),
    protein: Math.round(protein / servings),
    carbs: Math.round(carbs / servings),
    fat: Math.round(fat / servings),
  };

  const total = perServing.protein + perServing.carbs + perServing.fat;
  const percentages = {
    protein: (perServing.protein / total) * 100,
    carbs: (perServing.carbs / total) * 100,
    fat: (perServing.fat / total) * 100,
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Nutrition per serving</span>
        <span className="text-muted-foreground">{perServing.calories} kcal</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Protein</span>
          <span className="text-muted-foreground">{perServing.protein}g</span>
        </div>
        <Progress value={percentages.protein} className="bg-blue-100" />

        <div className="flex justify-between text-sm">
          <span>Carbs</span>
          <span className="text-muted-foreground">{perServing.carbs}g</span>
        </div>
        <Progress value={percentages.carbs} className="bg-green-100" />

        <div className="flex justify-between text-sm">
          <span>Fat</span>
          <span className="text-muted-foreground">{perServing.fat}g</span>
        </div>
        <Progress value={percentages.fat} className="bg-red-100" />
      </div>
    </div>
  );
};

export default NutritionInfo;