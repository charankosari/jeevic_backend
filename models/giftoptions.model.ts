import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IGiftOptions {
	id: string;
    name: string;
    image_url: string[];
    description: string;
    price: number;
    products: string[];
    meta_data: Record<string, string>;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const GiftOptionsSchema = new Schema({
    name: String,
    image_url: String,
    description: String,
    price: Number,
    products: [String],
    meta_data: Object,
    is_active: Boolean,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

GiftOptionsSchema.index.findByName = { by: 'name' };

const GiftOptions = ottoman.model<IGiftOptions>('gift_options', GiftOptionsSchema);

export { GiftOptions, type IGiftOptions };
