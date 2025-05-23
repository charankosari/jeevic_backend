import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface IProduct {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema({
  name: String,
  email: String,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

ProductSchema.index.findByName = { by: "name" };
ProductSchema.index.findByCategoryId = { by: "category_id" };
ProductSchema.index.findBySubCategoryId = { by: "subcategory_id" };

const Product = ottoman.model<IProduct>("products", ProductSchema);

export { Product, type IProduct };
