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
  table_id:         String,
  user_id:          String,
  booking_date:     Date,
  booking_time:     Date,
  from_time:        Date,
  to_time:          Date, 
  number_of_people: Number,
  is_confirmed:     Boolean,
  is_cancelled:     Boolean,
  is_completed:     Boolean,
  is_ready_to_bill: Boolean,
  created_at:       { type: Date,    default: () => new Date() },
  updated_at:       { type: Date,    default: () => new Date() },
});

// Indexes
DineInTableBookingsSchema.index.findByTableId = { by: 'table_id' };
DineInTableBookingsSchema.index.findByUserId = { by: 'user_id' };

// Model definition
const DineInTableBookings = ottoman.model('dine_in_table_bookings', DineInTableBookingsSchema);

export { DineInTableBookings };
