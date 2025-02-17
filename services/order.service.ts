import { Order, type IOrder } from "../models/order.model";

export class OrderService {
    public static readonly getOrders = async (
        user_id: string,
    ) : Promise<IOrder[]>=> {
        return await Order.find({
            user_id,
        }).then((orders) => {
            return orders.rows;
        });
    }

    public static readonly getOrderById = async (
        order_id: string,
    ) : Promise<IOrder | null>=> {
        return await Order
            .find({
                id: order_id,
            })
            .then((order) => {
                return order.rows[0] || null;
            });
    }

    public static readonly createOrder = async (
        {
            user_id,
            products,
            gift_options,
            status,
            payment_status,
            rzp_order_id,
            rzp_payment_id,
            rzp_signature,
            coupon_id,
            gift_card_id,
            discount_amount,
            tax_amount,
            shipping_amount,
            total_amount,
            address_id,
            gift_info,
            meta_data,
        }: {
            user_id: string;
            products: {
                product_id: string;
                quantity: number;
                price: number;
                meta_data: Record<string, string>;
            }[],
            gift_options: string[];
            status: string;
            payment_status: string;
            rzp_order_id: string;
            rzp_payment_id: string;
            rzp_signature: string;
            coupon_id: string;
            gift_card_id: string;
            discount_amount: number;
            tax_amount: number;
            shipping_amount: number;
            total_amount: number;
            address_id: string;
            gift_info: {
                message: string;
                meta_data: Record<string, string>;
            },
            meta_data: object,
        }
    ) : Promise<string>=> {
        const data = await Order.create({
            user_id,
            products,
            gift_options,
            status,
            payment_status,
            rzp_order_id,
            rzp_payment_id,
            rzp_signature,
            coupon_id,
            gift_card_id,
            discount_amount,
            tax_amount,
            shipping_amount,
            total_amount,
            address_id,
            gift_info,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }
}