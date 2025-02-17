import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IProduct {
	id: string;
    name: string;
    description: string;
    price: number;
    image_url: string[];
    category_id: string;
    subcategory_id: string;
    meta_data: Record<string, string>;
    is_active: boolean;
    availability_count: number;
    created_at: Date;
    updated_at: Date;
}

const ProductSchema = new Schema({
    name: String,
    description: String,
    price: Number,
    image_url: [String],
    category_id: String,
    subcategory_id: String,
    meta_data: Object,
    is_active: Boolean,
    is_out_of_stock: Boolean,
    availability_count: Number,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

ProductSchema.index.findByName = { by: 'name' };
ProductSchema.index.findByCategoryId = { by: 'category_id' };
ProductSchema.index.findBySubCategoryId = { by: 'subcategory_id' };

const Product = ottoman.model<IProduct>('products', ProductSchema);

export { Product, type IProduct };
