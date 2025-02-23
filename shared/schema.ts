import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ingredientSchema = z.object({
  name: z.string(),
  amount: z.number(),
  unit: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number()
});

export type Ingredient = z.infer<typeof ingredientSchema>;

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  servings: integer("servings").notNull(),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time").notNull(),
  ingredients: jsonb("ingredients").$type<Ingredient[]>().notNull(),
  imageUrl: text("image_url"),
});

export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  recipeId: integer("recipe_id").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner
});

export const insertRecipeSchema = createInsertSchema(recipes).extend({
  ingredients: z.array(ingredientSchema)
});

// Update the meal plan schema to properly handle date strings
export const insertMealPlanSchema = createInsertSchema(mealPlans).extend({
  date: z.string().or(z.date()).transform(val => 
    typeof val === 'string' ? val : val.toISOString()
  ),
  mealType: z.enum(["breakfast", "lunch", "dinner"])
});

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;