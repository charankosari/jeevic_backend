import { Address } from "../models/address.model";
import { Order, type IOrder } from "../models/order.model";
import { User } from "../models/user.model";
import { ProductService } from "./product.service";
import { createOrder } from "../libs/shiprocket/shiprocket";
export class OrderService {
  public static readonly getOrdersByUserID = async (
    user_id: string
  ): Promise<IOrder[]> => {
    return await Order.find({
      user_id,
    }).then((orders) => {
      return orders.rows;
    });
  };

  public static readonly getOrderById = async (
    order_id: string
  ): Promise<IOrder | null> => {
    return await Order.find({
      id: order_id,
    }).then((order) => {
      return order.rows[0] || null;
    });
  };

  public static readonly createOrder = async (
    user_id: string,
    {
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
      products: {
        product_id: string;
        quantity: number;
        price: number;
        meta_data: Record<string, string>;
      }[];
      gift_options?: string[];
      status: string;
      payment_status: string;
      rzp_order_id: string;
      rzp_payment_id: string;
      rzp_signature: string;
      coupon_id?: string;
      gift_card_id?: string;
      discount_amount?: number;
      tax_amount: number;
      shipping_amount: number;
      total_amount: number;
      address_id: string;
      gift_info?: {
        message: string;
        meta_data: Record<string, string>;
      };
      meta_data: object;
    }
  ): Promise<string> => {
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
  };

  public static readonly updateOrder = async (
    order_id: string,
    order_data: {
      products?: {
        product_id: string;
        quantity: number;
        price: number;
        meta_data: Record<string, string>;
      }[];
      gift_options?: string[];
      status?: string;
      payment_status?: string;
      rzp_order_id?: string;
      rzp_payment_id?: string;
      rzp_signature?: string;
      coupon_id?: string;
      gift_card_id?: string;
      discount_amount?: number;
      tax_amount?: number;
      shipping_amount?: number;
      total_amount?: number;
      address_id?: string;
      gift_info?: {
        message: string;
        meta_data: Record<string, string>;
      };
      meta_data?: object;
    }
  ): Promise<{
    order_id: string;
    user_id: string;
  }> => {
    await Order.updateMany(
      {
        id: order_id,
      },
      {
        ...order_data,
        updated_at: new Date(),
      }
    );

    const order = await this.getOrderById(order_id);

    if (!order) {
      throw new Error("Order not found");
    }

    return {
      order_id: order.id,
      user_id: order.user_id,
    };
  };

  // updateProductStock
  public static readonly updateProductStock = async (
    order_id: string
  ): Promise<void> => {
    // Get order products
    const order = await this.getOrderById(order_id);

    if (!order) {
      throw new Error("Order not found");
    }

    // Update product stock
    for (const item of order.products) {
      const product = await ProductService.getProductById(item.product_id);

      if (!product) {
        throw new Error("Product not found");
      }

      await ProductService.updateProduct(product.id, {
        availability_count: product.availability_count - item.quantity,
      });
    }
  };
  public static async createShippingOrder(order_id: string) {
    const order = await this.getOrderById(order_id);
    if (!order) throw new Error("Order not found");

    // Get Address from Address collection
    const address = await Address.findById(order.address_id);
    if (!address) throw new Error("Address not found");

    // Get User from User collection
    const user = await User.findById(order.user_id);
    if (!user) throw new Error("User not found");

    // Get product details
    const products = await ProductService.getProductsByIds(
      order.products.map((p) => p.product_id)
    );

    // Build order items
    const order_items = order.products.map((prod) => {
      const product = products.find((p) => p.id === prod.product_id);
      if (!product)
        throw new Error(`Product not found for id ${prod.product_id}`);

      return {
        name: product.name,
        //   sku: product.sku || product.id,
        sku: product.id,
        units: prod.quantity, // from order.products
        selling_price: prod.price, // from order.products
        //   length: product.length,
        //   breadth: product.breadth,
        //   height: product.height,
        //   weight: product.weight
        length: 20,
        breadth: 20,
        height: 22,
        weight: 2,
      };
    });

    // Generate 6 digit random ship_order_id
    const ship_order_id = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save new Shipping Order
    const shiprocketOrderData = {
      order_id: ship_order_id,
      order_date: order.created_at,
      pickup_location: "Main Warehouse",
      billing_customer_name: user.first_name,
      billing_last_name: user.last_name || "",
      billing_address: address.address_line_1,
      billing_city: address.city,
      billing_pincode: address.postcode,
      billing_state: address.state,
      billing_country: address.country,
      billing_email: user.email,
      billing_phone: address.phone_number,
      shipping_is_billing: true,
      order_items,
      payment_method: "Prepaid",
      sub_total: order.total_amount,
      order_type: "adhoc",
    };
    console.log(shiprocketOrderData);
    const response = await createOrder(shiprocketOrderData);
    // Update existing Order with ship_order_id
    await Order.updateMany({ id: order.id }, { ship_order_id: ship_order_id });
    return response;
  }
}
