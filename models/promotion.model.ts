import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface IPromotion {
  id: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

const PromotionSchema = new Schema({
  name: String,
  email: String,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

const promotion = ottoman.model<IPromotion>("promotion", PromotionSchema);

export { promotion, type IPromotion };
