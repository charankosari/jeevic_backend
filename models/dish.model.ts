import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IDish {
    id: string;
    name: string;
    price: number;
    picture: string;
    dish_category_id: string;
    is_available: boolean;
    is_non_veg: boolean;
    meta_data: object;
    created_at: Date;
    updated_at: Date;
}

const DishSchema = new Schema({
    name: String,
    price: Number,
    picture: String,
    dish_category_id: String,
    is_available: Boolean,
    is_non_veg: Boolean,
    meta_data: Object,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

DishSchema.index.findByUserId = { by: 'user_id' };

const Dish = ottoman.model<IDish>('dishes', DishSchema);

export { Dish, type IDish };
