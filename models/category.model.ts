import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface ICategory {
	id: string;
    name: string;
    image_url: string[];
    created_at: Date;
    updated_at: Date;
}

const CategorySchema = new Schema({
    name: String,
    image_url: [String],
    created_at: Date,
    updated_at: Date,
});

CategorySchema.index.findByName = { by: 'name' };

const Category = ottoman.model<ICategory>('categories', CategorySchema);

export { Category, type ICategory };
