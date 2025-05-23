import { Hono } from "hono";
import { FeaturedController } from "../controllers/featured.controller";

const featuredRoute = new Hono();

featuredRoute.post("/create", FeaturedController.createFeaturedProducts);
featuredRoute.get("/", FeaturedController.getFeaturedProducts);
featuredRoute.patch("/:id", FeaturedController.updateFeaturedProducts);
featuredRoute.delete("/:id", FeaturedController.deleteFeaturedProducts);

export { featuredRoute };