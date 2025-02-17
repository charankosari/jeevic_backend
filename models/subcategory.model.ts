import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface ISubCategory {
	id: string;
    name: string;
    category_id: string;
    created_at: Date;
    updated_at: Date;
}

const SubCategorySchema = new Schema({
    name: String,
    category_id: String,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

SubCategorySchema.index.findByName = { by: 'name' };
SubCategorySchema.index.findByCategoryId = { by: 'category_id' };

const SubCategory = ottoman.model<ISubCategory>('sub_categories', SubCategorySchema);

export { SubCategory, type ISubCategory };
