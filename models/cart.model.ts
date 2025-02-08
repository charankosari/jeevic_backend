import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface ICart {
	id: string;
    user_id: string;
    product_id: string;
    quantity: number;
    meta_data: object;
    created_at: Date;
    updated_at: Date;
}

const CartSchema = new Schema({
    user_id: String,
    product_id: String,
    quantity: Number,
    meta_data: Object,
    created_at: Date,
    updated_at: Date,
});

CartSchema.index.findByUserId = { by: 'user_id' };

const Cart = ottoman.model<ICart>('carts', CartSchema);

export { Cart, type ICart };
