import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IDineInCheckout {
    id: string;
    user_id: string;
    booking_id: string;
    table_id: string;
    order_ids: string[];
    total_price: number;
    payment_status: string;
    payment_date: Date;
    is_checked_out: boolean;
    created_at: Date;
    updated_at: Date;
}

const DineInCheckoutSchema = new Schema({
    user_id: String,
    booking_id: String,
    table_id: String,
    order_ids: [String],
    total_price: Number,
    payment_status: String,
    payment_date: Date,
    is_checked_out: Boolean,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

DineInCheckoutSchema.index.findByUserId = { by: 'user_id' };
DineInCheckoutSchema.index.findByBookingId = { by: 'booking_id' };
DineInCheckoutSchema.index.findByTableId = { by: 'table_id' };

const DineInCheckout = ottoman.model<IDineInCheckout>('dine_in_checkout', DineInCheckoutSchema);

export { DineInCheckout, type IDineInCheckout };
