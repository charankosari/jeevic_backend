import { Hono } from "hono";

import { GiftOptionsController } from "../controllers/giftoptions.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const giftoptionRoute = new Hono();

giftoptionRoute.use(authMiddleware());

giftoptionRoute.get("/", GiftOptionsController.getGiftOptions);
giftoptionRoute.get("/:giftoption_id", GiftOptionsController.getGiftOption);

giftoptionRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

giftoptionRoute.post("/", GiftOptionsController.createGiftOption);
giftoptionRoute.patch(
  "/:giftoption_id",
  GiftOptionsController.updateGiftOption
);
giftoptionRoute.delete(
  "/:giftoption_id",
  GiftOptionsController.deleteGiftOption
);

export { giftoptionRoute };
