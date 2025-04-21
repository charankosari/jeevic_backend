import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IDineInOrders {
    id: string;
    booking_id: string;
    user_id: string;
    table_id: string;
    dish_id: string;
    quantity: number;
    is_served: boolean;
    order_status: string;
    created_at: Date;
    updated_at: Date;
}

const DineInOrdersSchema = new Schema({
    booking_id: String,
    user_id: String,
    table_id: String,
    dish_id: String,
    quantity: Number,
    is_served: Boolean,
    order_status: String,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

DineInOrdersSchema.index.findByUserId = { by: 'user_id' };
DineInOrdersSchema.index.findByTableId = { by: 'table_id' };
DineInOrdersSchema.index.findByDishId = { by: 'dish_id' };
DineInOrdersSchema.index.findByBookingId = { by: 'booking_id' };
DineInOrdersSchema.index.findByOrderStatus = { by: 'order_status' };

const DineInOrders = ottoman.model<IDineInOrders>('dine_in_orders', DineInOrdersSchema);

export { DineInOrders, type IDineInOrders };
