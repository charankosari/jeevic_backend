import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface IReview {
  id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  dish_id: string;
  rating: number;
  comment?: string;
  meta_data: string;
  created_at: Date;
  updated_at: Date;
}

const ReviewSchema = new Schema({
  user_id: String,
  user_name: String,
  product_id: String,
  dish_id: String,
  rating: Number,
  comment: String,
  meta_data: Object,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

ReviewSchema.index.findByUserId = { by: "user_id" };
ReviewSchema.index.findByProductId = { by: "product_id" };
ReviewSchema.index.findByDishId = { by: "dish_id" };

const Review = ottoman.model<IReview>("reviews", ReviewSchema);

export { Review, type IReview };
