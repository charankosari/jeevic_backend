import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IOrder {
	id: string;
    user_id: string;
    products: {
        product_id: string;
        quantity: number;
        price: number;
        meta_data: object;
    }[],
    gift_options: string[];
    status: string;
    payment_status: string;
    rzp_order_id: string;
    rzp_payment_id: string;
    rzp_signature: string;
    coupon_id: string;
    gift_card_id: string;
    discount_amount: number;
    tax_amount: number;
    shipping_amount: number;
    total_amount: number;
    address_id: string;
    gift_info: {
        message: string;
        meta_data: object;
    },
    meta_data: object,
    created_at: Date,
    updated_at: Date,
}

const OrderSchema = new Schema({
    user_id: String,
    products: [{
        product_id: String,
        quantity: Number,
        price: Number,
        meta_data: Object,
    }],
    gift_options: [String],
    status: String,
    payment_status: String,
    rzp_order_id: String,
    rzp_payment_id: String,
    rzp_signature: String,
    coupon_id: String,
    gift_card_id: String,
    discount_amount: Number,
    tax_amount: Number,
    shipping_amount: Number,
    total_amount: Number,
    address_id: String,
    gift_info: {
        message: String,
        meta_data: Object,
    },
    meta_data: Object,
    created_at: Date,
    updated_at: Date,
});

OrderSchema.index.findByUserId = { by: 'user_id' };
OrderSchema.index.findByRzpOrderId = { by: 'rzp_order_id' };
OrderSchema.index.findByRzpPaymentId = { by: 'rzp_payment_id' };

const Order = ottoman.model<IOrder>('orders', OrderSchema);

export { Order, type IOrder };
