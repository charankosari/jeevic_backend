import { Cart, type ICart } from '../models/cart.model';
import { NotificationService } from './notification.service';
import { ProductService } from './product.service';

export class CartService {
    // AddToCart
    public static readonly addToCart = async (
        user_id: string,
        product_id: string,
        quantity: number,
        meta_data: Record<string, string>,
    ) : Promise<string>=> {
        const data = await Cart.create({
            user_id,
            product_id,
            quantity,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        const product = await ProductService.getProductById(product_id);

        // Add Notification
        await NotificationService.createNotification({
            user_id,
            message: `Product added to cart: ${product?.name}`,
            meta_data: {
                product_id,
                quantity: quantity.toString(),
            },
            title: 'Product Added to Cart',
        })

        return data.id;
    }

    // RemoveFromCart
    public static readonly removeFromCart = async (
        user_id: string,
        product_id: string,
    ) : Promise<void>=> {
        await Cart.removeMany({
            user_id,
            product_id,
        });
    }

    // ClearCart
    public static readonly clearCart = async (
        user_id: string,
    ) : Promise<void>=> {
        await Cart.removeMany({
            user_id,
        });
    }

    // GetCart
    public static readonly getCart = async (
        user_id: string,
    ) : Promise<ICart[]>=> {
        return await Cart.find({
            user_id,
        }).then((cart) => {
            return cart.rows;
        });
    }
    
    // UpdateCart
    public static readonly updateCart = async (
        user_id: string,
        product_id: string,
        quantity: number,
        meta_data: Record<string, string>,
    ) : Promise<void>=> {
        await Cart.updateMany({
            user_id,
            product_id,
        }, {
            quantity,
            meta_data,
            updated_at: new Date(),
        });
    }
}
