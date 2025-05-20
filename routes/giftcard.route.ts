import { Hono } from "hono";

import { GiftCardController } from "../controllers/giftcard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const giftCardRoute = new Hono();

giftCardRoute.use(authMiddleware());

giftCardRoute.put("/code", GiftCardController.getGiftCardByCode);
giftCardRoute.get("/", GiftCardController.getGiftCards);
giftCardRoute.get("/:giftcard_id", GiftCardController.getGiftCard);

giftCardRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

giftCardRoute.post("/", GiftCardController.createGiftCard);
giftCardRoute.patch("/:giftcard_id", GiftCardController.updateGiftCard);
giftCardRoute.delete("/:giftcard_id", GiftCardController.deleteGiftCard);

export { giftCardRoute };
