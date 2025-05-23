import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface FeaturedProducts {
  id: string;
  productIds: string[];
  created_at?: Date;
  updated_at?: Date;
}

const FeaturedProductsSchema = new Schema({
  id: String,
  productIds: [String],
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

const FeaturedProductsModel = ottoman.model<FeaturedProducts>(
  "FeaturedProducts",
  FeaturedProductsSchema
);

export { FeaturedProductsModel, type FeaturedProducts };
