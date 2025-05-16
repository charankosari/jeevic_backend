import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

// Define the order item interface
interface IOrderItem {
    dish_id: string;
    quantity: number;
    instructions?: string;
    price?: number;
}

// Update the main order interface
interface IDineInOrders {
    id: string;
    booking_id: string;
    user_id: string;
    table_id: string;
    items: IOrderItem[]; // Replace single dish with array of items
    is_served: boolean;
    order_status: string;
    created_at: Date;
    updated_at: Date;
}

// Define the order item schema
const OrderItemSchema = new Schema({
    dish_id: String,
    quantity: Number,
    instructions: { type: String, required: false },
    price: { type: Number, required: false }
});

// Update the main order schema
const DineInOrdersSchema = new Schema({
    booking_id: String,
    user_id: String,
    table_id: String,
    items: [OrderItemSchema], // Use array of order items
    is_served: Boolean,
    order_status: String,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

DineInOrdersSchema.index.findByUserId = { by: 'user_id' };
DineInOrdersSchema.index.findByTableId = { by: 'table_id' };
DineInOrdersSchema.index.findByBookingId = { by: 'booking_id' };
DineInOrdersSchema.index.findByOrderStatus = { by: 'order_status' };

const DineInOrders = ottoman.model<IDineInOrders>('dine_in_orders', DineInOrdersSchema);

export { DineInOrders, type IDineInOrders, type IOrderItem };
