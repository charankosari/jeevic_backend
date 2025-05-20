import { Hono } from "hono";

import { SaleController } from "../controllers/sale.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const saleRoute = new Hono();

saleRoute.use(authMiddleware());

saleRoute.get("/", SaleController.getSales);
saleRoute.get("/:sale_id", SaleController.getSale);

saleRoute.get("/:sale_type/:sale_id/products", SaleController.getSaleProducts);
saleRoute.get("/over/:product_id", SaleController.getCurrentSalesOverProduct);

saleRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

saleRoute.post("/", SaleController.createSale);
saleRoute.patch("/:sale_id", SaleController.updateSale);
saleRoute.delete("/:sale_id", SaleController.deleteSale);

export { saleRoute };
