import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IWishlist {
	id: string;
    user_id: string;
    product_id: string;
    created_at: Date;
    updated_at: Date;
}

const WishlistSchema = new Schema({
    user_id: String,
    product_id: String,
    created_at: Date,
    updated_at: Date,
});

WishlistSchema.index.findByUserId = { by: 'user_id' };

const Wishlist = ottoman.model<IWishlist>('wishlists', WishlistSchema);

export { Wishlist, type IWishlist };
