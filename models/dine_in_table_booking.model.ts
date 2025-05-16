import { Schema, Model, getModel } from 'ottoman';
import { ottoman } from '../config/ottoman';

export interface IDineInTableBookings {
  id: string;
  table_id?: string | null;
  user_id: string;
  booking_date: Date;
  booking_time: Date;
  from_time: Date;
  to_time?: Date | null;
  number_of_people?: number;
  is_confirmed: boolean;
  is_cancelled: boolean;
  is_completed: boolean;
  is_ready_to_bill: boolean;
  created_at: Date;
  updated_at: Date;
}

const DineInTableBookingsSchema = new Schema({
  table_id:         { type: String,  required: false, default: null },
  user_id:          { type: String,  required: true },
  booking_date:     { type: Date,    required: true },
  booking_time:     { type: Date,    required: true },
  from_time:        { type: Date,    required: true },
  to_time:          { type: Date,    required: false, default: null },
  number_of_people: { type: Number,  required: false },
  is_confirmed:     { type: Boolean, required: true,  default: false },
  is_cancelled:     { type: Boolean, required: true,  default: false },
  is_completed:     { type: Boolean, required: true,  default: false },
  is_ready_to_bill: { type: Boolean, required: true,  default: false },
  created_at:       { type: Date,    default: () => new Date() },
  updated_at:       { type: Date,    default: () => new Date() },
});

// Indexes
DineInTableBookingsSchema.index.findByTableId = { by: 'table_id', type: 'n1ql' };
DineInTableBookingsSchema.index.findByUserId = { by: 'user_id' };

// Model definition
const DineInTableBookings = ottoman.model('dine_in_table_bookings', DineInTableBookingsSchema);

export { DineInTableBookings };
