import type { Context } from "hono";

import { createHmac } from "node:crypto";

import { OrderService } from "../services/order.service";
import { CartService } from "../services/cart.service";
import { CouponService } from "../services/coupon.service";
import { GiftCardService } from "../services/giftcard.service";
import { ProductService } from "../services/product.service";
import { RazorpayService } from "../libs/payments/razorpay";
import { SaleService } from "../services/sale.service";
import { getAllOrders, trackByOrder } from "../libs/shiprocket/shiprocket";
import { config } from "../config/env";
export class OrderController {
  public static readonly getOrdersByUserID = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");

      const response = await OrderService.getOrdersByUserID(user_id);

      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly getOrder = async (ctx: Context) => {
    try {
      const { order_id } = ctx.req.param();

      const response = await OrderService.getOrderById(order_id);

      return ctx.json(response);
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly createOrder = async (ctx: Context) => {
    try {
      const user_id = ctx.get("user_id");
      // Consider Free Shipping
      const shipping_amount = 0;
      const {
        address_id,
        coupon_code,
        gift_card_code,
        gift_options,
        gift_info,
        meta_data,
      } = await ctx.req.json();

      // Get User Cart Items
      const cartItems = await CartService.getCart(user_id);

      if (cartItems.length === 0) {
        throw new Error("Cart is empty!");
      }

      // Get order value
      let order_value = 0;
      let products: {
        product_id: string;
        quantity: number;
        price: number;
        meta_data: Record<string, string>;
      }[] = [];

      for (const item of cartItems) {
        const product = await ProductService.getProductById(item.product_id);

        if (product) {
          const price = product.price;
          order_value += price * item.quantity;

          products.push({
            product_id: product.id,
            quantity: item.quantity,
            price: product.price,
            meta_data: product.meta_data,
          });
        }
      }

      let discount_amount = 0;

      let coupon_data: {
        coupon_id?: string;
        discount_type?: "fixed" | "percentage";
        discount_value?: number;
        minimumCartValue?: number;
      } = {};

      // Get Coupon ID
      if (coupon_code) {
        const coupon = await CouponService.getCouponByCode(coupon_code);

        if (coupon && coupon.expires_on > new Date() && coupon.no_of_uses > 0) {
          coupon_data = {
            coupon_id: coupon.id,
            discount_type: coupon.meta_data.discountType as
              | "fixed"
              | "percentage",
            discount_value: coupon.meta_data
              .discountAmount as unknown as number,
            minimumCartValue: coupon.meta_data
              .minimumCartValue as unknown as number,
          };

          await CouponService.applyCoupon(coupon.id);

          if (coupon.is_one_time) {
            await CouponService.updateCoupon(coupon.id, {
              code: coupon.code,
              expires_on: coupon.expires_on,
              is_one_time: coupon.is_one_time,
              meta_data: coupon.meta_data,
              no_of_uses: 0,
            });
          }

          if (order_value >= Number(coupon.meta_data.minimumCartValue)) {
            let coupon_discount_amount: number = 0;

            coupon_discount_amount =
              coupon.meta_data.discountType === "fixed"
                ? Number(coupon.meta_data.discountAmount)
                : (order_value * Number(coupon.meta_data.discountAmount)) / 100;

            discount_amount += coupon_discount_amount;
          }
        }
      }

      let gift_card_data: {
        gift_card_id?: string;
        discount_amount?: number;
      } = {};

      // Get Gift Card ID
      if (gift_card_code) {
        const gift_card =
          await GiftCardService.getGiftCardByCode(gift_card_code);

        if (
          gift_card &&
          gift_card.expires_on > new Date() &&
          !gift_card.is_redeemed
        ) {
          gift_card_data = {
            gift_card_id: gift_card.id,
            discount_amount: gift_card.meta_data.amount as unknown as number,
          };

          // Add Discount Amount
          discount_amount += gift_card_data.discount_amount!;
        }
      }

      // 18% GST
      const tax_amount = order_value * 0.18;

      const total_amount =
        order_value + tax_amount + shipping_amount - discount_amount;

      const response = await OrderService.createOrder(user_id, {
        address_id,
        coupon_id: coupon_data.coupon_id ?? "",
        discount_amount:
          coupon_data.discount_type === "fixed"
            ? coupon_data.discount_value!
            : 0,
        gift_card_id: gift_card_data.gift_card_id ?? "",
        products,
        gift_options: gift_options ?? "",
        gift_info: gift_info ?? "",
        meta_data: meta_data ?? "",
        payment_status: "pending",
        shipping_amount,
        tax_amount,
        total_amount,
        rzp_order_id: "",
        rzp_payment_id: "",
        rzp_signature: config.RAZORPAY_HOOK_SECRET,
        status: "placed",
      });
      console.log(response);

      // Create Razorpay Order
      const razorpayOrder = await RazorpayService.createOrder({
        order_id: response,
        amount: total_amount,
        shipping_fee: shipping_amount,
      });

      // Update Order with Razorpay Order ID
      await OrderService.updateOrder(response, {
        rzp_order_id: razorpayOrder.id,
      });

      return ctx.json({
        order_id: response,
        razorpay: {
          order_id: razorpayOrder.id,
          currency: razorpayOrder.currency,
          amount: razorpayOrder.amount,
          status: razorpayOrder.status,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            message: error.message,
          },
          400
        );
      }
    }
  };

  public static readonly captureHook = async (ctx: Context) => {
    try {
      const webhook_headers = ctx.req.header();
      const rawPayload = await ctx.req.text();
      console.log("razerpay hook", rawPayload, webhook_headers);
      const signature = webhook_headers["x-razorpay-signature"];

      const is_valid = await this.validateSignature({
        webhook_signature: signature,
        webhook_secret: config.RAZORPAY_HOOK_SECRET,
        payload: rawPayload, // pass raw payload directly
      });
      console.log(is_valid);
      const webhook_payload = JSON.parse(rawPayload);
      await OrderController.handleRazorpayEvent(webhook_payload, is_valid);

      return ctx.json({
        message: "Hook captured",
      });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json(
          {
            error: error.message,
          },
          400
        );
      }
    }
  };

  private static async handleRazorpayEvent(
    webhook_payload: {
      payload: {
        payment: {
          entity: {
            amount: number;
            currency: string;
            id: string;
            notes: {
              platform_order_id: string;
            };
          };
        };
      };
      event: string;
    },
    is_valid: boolean
  ) {
    switch (webhook_payload.event) {
      case "payment.authorized": {
        await OrderController.handlePaymentAuthorized(
          webhook_payload,
          is_valid
        );
        console.log("authorized");
        break;
      }
      case "payment.failed": {
        await OrderController.handlePaymentFailed(webhook_payload, is_valid);
        console.log("failed");
        break;
      }
      case "payment.captured": {
        await OrderController.handlePaymentCaptured(webhook_payload, is_valid);
        const order_id =
          webhook_payload.payload.payment.entity.notes.platform_order_id;
        await OrderService.createShippingOrder(order_id);
        console.log("captured");
        break;
      }
      default: {
        console.log("Unhandled event:", webhook_payload.event);
        break;
      }
    }
  }

  private static async handlePaymentAuthorized(
    webhook_payload: {
      payload: {
        payment: {
          entity: {
            amount: number;
            id: string;
          };
        };
      };
    },
    is_valid: boolean
  ) {
    if (is_valid) {
      const capturedData = await RazorpayService.capturePayment({
        amount: webhook_payload.payload.payment.entity.amount,
        payment_id: webhook_payload.payload.payment.entity.id,
      });

      if (capturedData) {
        console.log("Payment captured successfully");
      }
    }
  }

  private static async handlePaymentFailed(
    webhook_payload: {
      payload: {
        payment: {
          entity: {
            notes: {
              platform_order_id: string;
            };
          };
        };
      };
    },
    is_valid: boolean
  ) {
    if (is_valid) {
      const order_id =
        webhook_payload.payload.payment.entity.notes.platform_order_id;
      await OrderService.updateOrder(order_id, {
        status: "failed",
      });
    }
  }

  private static async handlePaymentCaptured(
    webhook_payload: {
      payload: {
        payment: {
          entity: {
            id: string;
            notes: {
              platform_order_id: string;
            };
          };
        };
      };
    },
    is_valid: boolean
  ) {
    // if (is_valid) {
    const order_id =
      webhook_payload.payload.payment.entity.notes.platform_order_id;
    const payment_id = webhook_payload.payload.payment.entity.id;
    const { user_id } = await OrderService.updateOrder(order_id, {
      status: "completed",
      payment_status: "completed",
      rzp_payment_id: payment_id,
    });

    // Clear Cart
    await CartService.clearCart(user_id);

    // Update Product Stock
    await OrderService.updateProductStock(order_id);
    // }
  }

  static async validateSignature({
    webhook_signature,
    webhook_secret,
    payload,
  }: {
    webhook_signature: string;
    webhook_secret: string;
    payload: string;
  }) {
    const hmac = createHmac("sha256", webhook_secret);

    hmac.update(payload);

    const generated_signature = hmac.digest("hex");

    return webhook_signature === generated_signature;
  }
  public static readonly getAllOrders = async (ctx: Context) => {
    try {
      const orders = await getAllOrders();
      return ctx.json({ success: true, data: orders });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
  public static readonly trackOrderById = async (ctx: Context) => {
    try {
      const { orderId } = ctx.req.param();
      const trackingInfo = await trackByOrder(orderId);
      console.log(trackingInfo);
      return ctx.json({ success: true, data: trackingInfo });
    } catch (error) {
      if (error instanceof Error) {
        return ctx.json({ success: false, error: error.message }, 400);
      }
    }
  };
}
