import { Address } from "../models/address.model";
import { Order, type IOrder } from "../models/order.model";
import { User } from "../models/user.model";
import { ProductService } from "./product.service";
import { createOrder } from "../libs/shiprocket/shiprocket";
import { EcomAdmin } from "../models/admin.model";
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
    function getDateKey(date = new Date()): string {
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    const order = await this.getOrderById(order_id);
    const result = await EcomAdmin.find({});
    let ecomAdmin = result.rows[0];

    // If admin doc doesn't exist, create an empty one
    if (!ecomAdmin) {
      ecomAdmin = new EcomAdmin({
        id: "ecom_admin::1",
        dailyProfits: {},
        totalProfit: 0,
        salesOfProducts: {},
        salesOfCategories: {},
        salesOfSubCategories: {},
        revenueHistory: {},
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
    const this_day = new Date();
    const today = getDateKey(this_day);
    const orderProfit = order?.total_amount;
    if (!ecomAdmin.dailyProfits[today]) {
      ecomAdmin.dailyProfits[today] = 0;
    }
    ecomAdmin.dailyProfits[today] += orderProfit;
    ecomAdmin.totalProfit += orderProfit;
    const this_yesterday = new Date();
    const yesterday = getDateKey(this_yesterday);
    const yesterdayRevenue = ecomAdmin.revenueHistory[yesterday] || 0;

    if (!ecomAdmin.revenueHistory[today]) {
      ecomAdmin.revenueHistory[today] = yesterdayRevenue;
    }
    ecomAdmin.revenueHistory[today] += orderProfit;

    if (!order) {
      throw new Error("Order not found");
    }

    // Update product stock
    for (const item of order.products) {
      const product = await ProductService.getProductById(item.product_id);
      if (!product) throw new Error("Product not found");

      // Reduce product stock
      await ProductService.updateProduct(product.id, {
        availability_count: product.availability_count - item.quantity,
      });

      const category = product.category_id;
      const subcategory = product.subcategory_id;

      // Update product sales
      if (!ecomAdmin.salesOfProducts[product.id]) {
        ecomAdmin.salesOfProducts[product.id] = 0;
      }
      ecomAdmin.salesOfProducts[product.id] += item.quantity;

      // Update category sales
      if (category) {
        if (!ecomAdmin.salesOfCategories[category]) {
          ecomAdmin.salesOfCategories[category] = 0;
        }
        ecomAdmin.salesOfCategories[category] += item.quantity;
      }

      // Update subcategory sales
      if (subcategory) {
        if (!ecomAdmin.salesOfSubCategories[subcategory]) {
          ecomAdmin.salesOfSubCategories[subcategory] = 0;
        }
        ecomAdmin.salesOfSubCategories[subcategory] += item.quantity;
      }
    }
    ecomAdmin.updated_at = new Date();
    await ecomAdmin.save();
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
    let totalLength = 0;
    let totalWeight = 0;
    let maxBreadth = 0;
    let maxHeight = 0;
    // Build order items
    const order_items = order.products.map((prod) => {
      const product = products.find((p) => p.id === prod.product_id);
      if (!product)
        throw new Error(`Product not found for id ${prod.product_id}`);
      const quantity = prod.quantity;

      // Length & Weight (sum, multiplied by quantity)
      totalLength += (Number(product?.meta_data.length) || 0) * quantity;
      totalWeight += (Number(product?.meta_data.weight) || 0) * quantity;
      if (Number(product?.meta_data.breadth) > maxBreadth)
        maxBreadth = Number(product?.meta_data.breadth);

      if (Number(product?.meta_data.height) > maxHeight)
        maxHeight = Number(product?.meta_data.height);
      return {
        name: product.name,
        //   sku: product.sku || product.id,
        sku: product.id,
        units: prod.quantity, // from order.products
        selling_price: prod.price, // from order.products
      };
    });

    // Generate 6 digit random ship_order_id
    const ship_order_id = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save new Shipping Order
    const orderDate = new Date(order.created_at);

    // Convert to IST
    const istOffset = 330; // IST is +5:30 in minutes
    const istTime = new Date(orderDate.getTime() + istOffset * 60000);

    // Format to "YYYY-MM-DD HH:mm"
    const formattedDate =
      istTime.getFullYear() +
      "-" +
      String(istTime.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(istTime.getDate()).padStart(2, "0") +
      " " +
      String(istTime.getHours()).padStart(2, "0") +
      ":" +
      String(istTime.getMinutes()).padStart(2, "0");

    const shiprocketOrderData = {
      order_id: ship_order_id,
      order_date: formattedDate,
      pickup_location: "Home",
      billing_customer_name: address.name,
      billing_last_name: user.last_name || "",
      billing_address: address.address_line_1,
      billing_city: address.city,
      billing_pincode: address.postcode,
      billing_state: address.state,
      billing_country: address.country,
      billing_email: address.email,
      billing_phone: address.phone_number,
      shipping_is_billing: true,
      order_items,
      payment_method: "Prepaid",
      sub_total: order.total_amount,
      length: totalLength,
      breadth: maxBreadth,
      height: maxHeight,
      weight: totalWeight,
    };
    const response = await createOrder(shiprocketOrderData);
    // Update existing Order with ship_order_id
    await Order.updateMany({ id: order.id }, { ship_order_id: ship_order_id });
    return response;
  }
}
