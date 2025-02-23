import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertRecipeSchema, insertMealPlanSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Recipe routes
  app.get("/api/recipes", async (_req, res) => {
    const recipes = await storage.getRecipes();
    res.json(recipes);
  });

  app.get("/api/recipes/:id", async (req, res) => {
    const recipe = await storage.getRecipe(Number(req.params.id));
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.post("/api/recipes", async (req, res) => {
    const parsed = insertRecipeSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid recipe data" });
    }
    const recipe = await storage.createRecipe(parsed.data);
    res.status(201).json(recipe);
  });

  app.patch("/api/recipes/:id", async (req, res) => {
    const parsed = insertRecipeSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid recipe data" });
    }
    const recipe = await storage.updateRecipe(Number(req.params.id), parsed.data);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  });

  app.delete("/api/recipes/:id", async (req, res) => {
    const success = await storage.deleteRecipe(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(204).send();
  });

  // Meal plan routes
  app.get("/api/meal-plans", async (_req, res) => {
    const mealPlans = await storage.getMealPlans();
    res.json(mealPlans);
  });

  app.post("/api/meal-plans", async (req, res) => {
    const parsed = insertMealPlanSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid meal plan data" });
    }
    const mealPlan = await storage.createMealPlan(parsed.data);
    res.status(201).json(mealPlan);
  });

  app.delete("/api/meal-plans/:id", async (req, res) => {
    const success = await storage.deleteMealPlan(Number(req.params.id));
    if (!success) {
      return res.status(404).json({ message: "Meal plan not found" });
    }
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
