import { Hono } from "hono";

import { WishlistController } from "../controllers/wishlist.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const wishlistRoute = new Hono();

wishlistRoute.use(authMiddleware());

wishlistRoute.get("/", WishlistController.getWishlist);
wishlistRoute.post("/", WishlistController.addToWishlist);
wishlistRoute.delete("/", WishlistController.removeFromWishlist);

export { wishlistRoute };
