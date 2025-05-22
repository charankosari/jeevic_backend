import type { Context } from "hono";

import { Message, type IMessage } from "../models/message.model";

export class MessageController {
  public static readonly createMessage = async (ctx: Context) => {
    try {
      const { message, email, name } = await ctx.req.json();
      const newMessage = await Message.create({ message, email, name });
      return ctx.json({ success: true, data: newMessage });
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message }, 500);
    }
  };

  public static readonly getMessageById = async (ctx: Context) => {
    try {
      const message_id = ctx.req.param("message_id");
      const message = (await Message.find({
        id: message_id,
      })) as {
        rows: IMessage[];
      };
      return ctx.json({ success: true, data: message });
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message }, 500);
    }
  };
  public static readonly getMessages = async (ctx: Context) => {
    try {
      const messages = await Message.find({});
      return ctx.json({ success: true, data: messages });
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message }, 500);
    }
  };

  public static readonly markAsRead = async (ctx: Context) => {
    try {
      const { message_id } = ctx.req.param();
      const message = await Message.findById(message_id);
  
      if (!message) {
        return ctx.json({ success: false, message: "Message not found" }, 404);
      }
  
      if (message.is_read) {
        return ctx.json({ success: true, message: "Message already marked as read" });
      }
  
      await Message.updateById(message_id, { is_read: true });
      return ctx.json({ success: true, message: "Message marked as read" });
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message }, 500);
    }
  };

  public static readonly deleteMessage = async (ctx: Context) => {
    try {
      const { message_id } = ctx.req.param();
      await Message.findOneAndRemove({ id: message_id });
      return ctx.json({ success: true, message: "Message deleted" });
    } catch (error: any) {
      return ctx.json({ success: false, message: error.message }, 500);
    }
  };
}
