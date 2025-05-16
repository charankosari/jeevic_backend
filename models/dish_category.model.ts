import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface IDishCategory {
  id: string;
  name: string;
  picture: string;
  created_at: Date;
  updated_at: Date;
}

const DishCategorySchema = new Schema({
  name: String,
  picture: String,
  rating: String,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

DishCategorySchema.index.findByUserId = { by: "user_id" };

const DishCategory = ottoman.model<IDishCategory>(
  "dish_categories",
  DishCategorySchema
);

export { DishCategory, type IDishCategory };
