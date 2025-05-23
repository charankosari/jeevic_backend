import { Hono } from "hono";
import { ProductController } from "../controllers/promotion.controller";
const promotionalRoute = new Hono();
promotionalRoute.get("/", ProductController.getAllPromotionalMails);
promotionalRoute.post("/", ProductController.createNewPromotionalMail);
promotionalRoute.delete("/", ProductController.deletePromotionalMail);
export { promotionalRoute };
