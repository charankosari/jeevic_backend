import { Hono } from "hono";

import { ProductController } from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const productRoute = new Hono();

productRoute.get("/newitems", ProductController.getLatestProducts);
productRoute.get("/c/:category_id", ProductController.getProductsByCategory);
productRoute.get(
  "/s/:subcategory_id",
  ProductController.getProductsBySubCategory
);
productRoute.get("/i/:product_id", ProductController.getProduct);
productRoute.get("/similarproducts/:id", ProductController.getSimilarProducts);
productRoute.get("/fetch", ProductController.getProductsByIds);

productRoute.use(authMiddleware());
// discover new products route
//just for you route
productRoute.get("/justforyou", ProductController.getUserProducts);

productRoute.get("/search", ProductController.searchProducts);

productRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

productRoute.post("/", ProductController.createProduct);
productRoute.patch("/:product_id", ProductController.updateProduct);
productRoute.delete("/:product_id", ProductController.deleteProduct);

export { productRoute };
