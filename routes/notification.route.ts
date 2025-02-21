import { Hono } from "hono";

import { NotificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const notificationRoute = new Hono();

notificationRoute.use(authMiddleware());

notificationRoute.get("/", NotificationController.getNotifications);
notificationRoute.get("/:notification_id", NotificationController.getNotificationById);
notificationRoute.patch("/:notification_id/read", NotificationController.markNotificationAsRead);
notificationRoute.patch("/read", NotificationController.markAllNotificationsAsRead);
notificationRoute.get("/unread", NotificationController.getUnreadNotifications);

export { notificationRoute };
