import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface ISale {
	id: string;
    name: string;
    image_url: string[];
    description: string;
    start_date: Date;
    end_date: Date;
    discount_percentage: number;
    sale_type: 'product' | 'category' | 'subcategory';
    product_ids: string[];
    category_ids: string[];
    subcategory_ids: string[];
    meta_data: object;
    created_at: Date;
    updated_at: Date;
}

const SaleSchema = new Schema({
    name: String,
    image_url: [String],
    description: String,
    start_date: Date,
    end_date: Date,
    discount_percentage: Number,
    sale_type: String,
    product_ids: [String],
    category_ids: [String],
    subcategory_ids: [String],
    meta_data: Object,
    created_at: Date,
    updated_at: Date,
});

SaleSchema.index.findByName = { by: 'name' };

const Sale = ottoman.model<ISale>('sales', SaleSchema);

export { Sale, type ISale };
