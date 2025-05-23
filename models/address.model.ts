import { Schema } from "ottoman";
import { ottoman } from "../config/ottoman";

interface IAddress {
  id: string;
  user_id: string;
  country: string;
  city: string;
  state: string;
  address_line_1: string;
  address_line_2: string;
  postcode: string;
  phone_number: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new Schema({
  user_id: String,
  country: String,
  city: String,
  state: String,
  address_line_1: String,
  address_line_2: String,
  postcode: String,
  phone_number: String,
  is_default: Boolean,
  created_at: { type: Date, default: () => new Date() },
  updated_at: { type: Date, default: () => new Date() },
});

UserSchema.index.findByUserId = { by: "user_id" };

const Address = ottoman.model<IAddress>("addresses", UserSchema);

export { Address, type IAddress };
