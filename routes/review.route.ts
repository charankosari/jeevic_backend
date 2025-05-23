import { Hono } from "hono";

import { ReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const reviewRoute = new Hono();

reviewRoute.get("/p/:product_id", ReviewController.getReviewsByProduct);
reviewRoute.get("/d/:dish_id", ReviewController.getReviewsByDish);
reviewRoute.get("/:review_id", ReviewController.getReview);

reviewRoute.get(
  "/avg/p/:product_id",
  ReviewController.getAverageRatingForProduct
);
reviewRoute.get("/avg/d/:dish_id", ReviewController.getAverageRatingForDish);
reviewRoute.use(authMiddleware());
reviewRoute.post("/p", ReviewController.createReview);
reviewRoute.post("/d", ReviewController.createDishReview);
reviewRoute.patch("/:review_id", ReviewController.updateReview);
reviewRoute.delete("/:review_id", ReviewController.deleteReview);

export { reviewRoute };
