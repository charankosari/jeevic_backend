import { Hono } from "hono";

import { CartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const cartRoute = new Hono();

cartRoute.use(authMiddleware());

cartRoute.post('/', CartController.addToCart);
cartRoute.patch('/', CartController.updateCart);
cartRoute.delete('/', CartController.removeFromCart);
cartRoute.get('/', CartController.getCart);

export { cartRoute };
