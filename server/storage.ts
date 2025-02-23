import { Recipe, InsertRecipe, MealPlan, InsertMealPlan } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { recipes, mealPlans } from "@shared/schema";

export interface IStorage {
  // Recipe operations
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: number): Promise<Recipe | undefined>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;
  updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined>;
  deleteRecipe(id: number): Promise<boolean>;

  // Meal plan operations
  getMealPlans(): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  deleteMealPlan(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes);
  }

  async getRecipe(id: number): Promise<Recipe | undefined> {
    const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id));
    return recipe;
  }

  async createRecipe(recipe: InsertRecipe): Promise<Recipe> {
    const [newRecipe] = await db.insert(recipes).values(recipe).returning();
    return newRecipe;
  }

  async updateRecipe(id: number, recipe: Partial<InsertRecipe>): Promise<Recipe | undefined> {
    const [updatedRecipe] = await db
      .update(recipes)
      .set(recipe)
      .where(eq(recipes.id, id))
      .returning();
    return updatedRecipe;
  }

  async deleteRecipe(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning();
    return !!deleted;
  }

  async getMealPlans(): Promise<MealPlan[]> {
    return await db.select().from(mealPlans);
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    // Convert the date string to a Date object before inserting
    const [newMealPlan] = await db.insert(mealPlans).values({
      ...mealPlan,
      date: new Date(mealPlan.date)
    }).returning();
    return newMealPlan;
  }

  async deleteMealPlan(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(mealPlans)
      .where(eq(mealPlans.id, id))
      .returning();
    return !!deleted;
  }
}

export const storage = new DatabaseStorage();