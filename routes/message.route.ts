import { Hono } from "hono";
import { MessageController } from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
const messageRoute = new Hono();

messageRoute.post("/", MessageController.createMessage);
messageRoute.use(authMiddleware());
messageRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

messageRoute.get("/", MessageController.getMessages);
messageRoute.get("/:message_id", MessageController.getMessageById);
messageRoute.patch("/:message_id/read", MessageController.markAsRead);
messageRoute.delete("/:message_id", MessageController.deleteMessage);

export { messageRoute };
