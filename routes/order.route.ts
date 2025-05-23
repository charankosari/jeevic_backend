import { Hono } from "hono";

import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const orderRoute = new Hono();

orderRoute.post('/capture_hook', OrderController.captureHook);
orderRoute.get("/all", OrderController.getAllOrders);
orderRoute.get("/track/:orderId", OrderController.trackOrderById);
orderRoute.use(authMiddleware());

orderRoute.get('/user', OrderController.getOrdersByUserID);
orderRoute.get('/i/:order_id', OrderController.getOrder);
orderRoute.post('/', OrderController.createOrder);

export { orderRoute };
