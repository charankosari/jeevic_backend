import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface INotification {
	id: string;
    user_id: string;
    title: string;
    message: string;
    meta_data: Record<string, string>;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

const NotificationSchema = new Schema({
    user_id: String,
    title: String,
    message: String,
    meta_data: Object,
    is_read: { type: Boolean, default: false },
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

NotificationSchema.index.findByUserId = { by: 'user_id' };

const Notification = ottoman.model<INotification>('notification', NotificationSchema);

export { Notification, type INotification };
