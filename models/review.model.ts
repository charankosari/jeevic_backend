import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IReview {
	id: string;
    user_id: string;
    product_id: string;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

const ReviewSchema = new Schema({
    user_id: String,
    product_id: String,
    rating: Number,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

ReviewSchema.index.findByUserId = { by: 'user_id' };
ReviewSchema.index.findByProductId = { by: 'product_id' };

const Review = ottoman.model<IReview>('reviews', ReviewSchema);

export { Review, type IReview };
