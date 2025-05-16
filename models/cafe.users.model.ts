import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface ICUser {
  id: string;
  country_code: string;
  phone_number: string;
  phone_otp: string;
  role: string;
  is_mobile_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

const CafeUserSchema = new Schema({
  country_code: String,
  phone_number: String,
  phone_otp: String,
  role: { type: String, default: "cafeuser" },
  is_mobile_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

CafeUserSchema.index.findByPhoneNumber = { by: "phone_number" };

const CUser = ottoman.model<ICUser>("cafeusers", CafeUserSchema);

export { CUser, type ICUser };
