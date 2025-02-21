import { type Context } from 'hono';

import { NotificationService } from '../services/notification.service';

export class NotificationController {
    public static readonly getNotifications = async (ctx: Context) => {
        try {
            const response = await NotificationService.getNotifications();

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getNotificationById = async (ctx: Context) => {
        try {
            const { notification_id } = ctx.req.param();

            const response = await NotificationService.getNotificationById(notification_id);

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly markNotificationAsRead = async (ctx: Context) => {
        try {
            const { notification_id } = ctx.req.param();

            await NotificationService.markNotificationAsRead(notification_id);

            return ctx.json({
                message: 'Notification marked as read successfully!',
            });
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly markAllNotificationsAsRead = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            await NotificationService.markAllNotificationsAsRead(user_id);

            return ctx.json({
                message: 'All notifications marked as read successfully!',
            });
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getUnreadNotifications = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const response = await NotificationService.getUnreadNotifications(user_id);

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };
}
