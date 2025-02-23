import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UtensilsCrossed, Calendar, ShoppingCart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Smart Recipe Manager
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your personal kitchen assistant for recipe management, meal planning, and nutritional tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" />
                Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create, manage and scale your favorite recipes with automatic nutritional calculations
              </p>
              <Link href="/recipes">
                <Button className="w-full">View Recipes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Meal Planner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Plan your meals for the week and track your nutritional goals
              </p>
              <Link href="/meal-planner">
                <Button className="w-full">Plan Meals</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Automatically generate shopping lists from your meal plan
              </p>
              <Link href="/shopping-list">
                <Button className="w-full">View Shopping List</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}