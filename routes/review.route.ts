import { Hono } from "hono";

import { ReviewController } from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const reviewRoute = new Hono();

reviewRoute.use(authMiddleware());

reviewRoute.get('/p/:product_id', ReviewController.getReviewsByProduct);
reviewRoute.get('/:review_id', ReviewController.getReview);
reviewRoute.post('/', ReviewController.createReview);
reviewRoute.patch('/:review_id', ReviewController.updateReview);
reviewRoute.delete('/:review_id', ReviewController.deleteReview);

reviewRoute.get('/avg/:product_id', ReviewController.getAverageRating);

export { reviewRoute };
