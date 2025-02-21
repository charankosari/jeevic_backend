import { Notification, type INotification } from "../models/notification.model";

export class NotificationService {
    public static readonly getNotifications = async () : Promise<INotification[]>=> {
        return await Notification.find({}).then((notifications) => {
            return notifications.rows;
        });
    }

    public static readonly getNotificationById = async (
        notification_id: string,
    ) : Promise<INotification | null>=> {
        return await Notification
            .find({
                id: notification_id,
            })
            .then((notification) => {
                return notification.rows[0] || null;
            });
    }

    public static readonly createNotification = async (
        {
            user_id,
            title,
            message,
            meta_data,
        }: {
            user_id: string;
            title: string;
            message: string;
            meta_data: Record<string, string>;
        }
    ) : Promise<string>=> {
        const data = await Notification.create({
            user_id,
            title,
            message,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly markNotificationAsRead = async (
        notification_id: string,
    ) : Promise<void>=> {
        await Notification.updateMany({
            id: notification_id,
        }, {
            is_read: true,
            updated_at: new Date(),
        });
    }

    public static readonly markAllNotificationsAsRead = async (
        user_id: string,
    ) : Promise<void>=> {
        await Notification.updateMany({
            user_id,
        }, {
            is_read: true,
            updated_at: new Date(),
        });
    }

    public static readonly getUnreadNotifications = async (
        user_id: string,
    ) : Promise<INotification[]>=> {
        return await Notification.find({
            user_id,
            is_read: false,
        }).then((notifications) => {
            return notifications.rows;
        });
    }
}
