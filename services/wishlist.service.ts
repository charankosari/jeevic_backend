import { Wishlist, type IWishlist } from "../models/wishlist.model";

export class WishlistService {
    public static readonly getWishlist = async (
        user_id: string,
    ) : Promise<IWishlist[]>=> {
        return await Wishlist.find({
            user_id,
        }).then((wishlists) => {
            return wishlists.rows;
        });
    }

    public static readonly getWishlistById = async (
        wishlist_id: string,
    ) : Promise<IWishlist | null>=> {
        return await Wishlist
            .find({
                id: wishlist_id,
            })
            .then((wishlist) => {
                return wishlist.rows[0] || null;
            });
    }

    public static readonly addToWishlist = async (
        {
            user_id,
            product_id,
        }: {
            user_id: string;
            product_id: string;
        }
    ) : Promise<string>=> {
        const data = await Wishlist.create({
            user_id,
            product_id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly removeFromWishlist = async (
        user_id: string,
        product_id: string,
    ) : Promise<void>=> {
        await Wishlist.removeMany({
            user_id,
            product_id,
        });
    }
}