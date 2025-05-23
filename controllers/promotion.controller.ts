import type { Context } from "hono";

import { promotion, type IPromotion } from "../models/promotion.model";
export class ProductController {
  public static readonly createNewPromotionalMail = async (ctx: Context) => {
    try {
      const { email } = await ctx.req.json();

      const response = await promotion.create({
        email,
      });

      return ctx.json(response);
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message });
    }
  };
  public static readonly getAllPromotionalMails = async (ctx: Context) => {
    try {
      const response = await promotion.find({});

      return ctx.json(response);
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message });
    }
  };
  public static readonly deletePromotionalMail = async (ctx: Context) => {
    try {
      const body = await ctx.req.json();
      const { email } = body;

      const response = await promotion.findOneAndRemove({ email: email });

      return ctx.json(response);
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message });
    }
  };
}
