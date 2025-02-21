import { Hono } from "hono";

import { CouponController } from "../controllers/coupon.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const couponRoute = new Hono();

couponRoute.use(authMiddleware());

couponRoute.put('/code', CouponController.getCouponByCode);

couponRoute.use(roleMiddleware(true));

couponRoute.get('/', CouponController.getCoupons);
couponRoute.get('/:coupon_id', CouponController.getCoupon);
couponRoute.post('/', CouponController.createCoupon);
couponRoute.patch('/:coupon_id', CouponController.updateCoupon);
couponRoute.delete('/:coupon_id', CouponController.deleteCoupon);

export { couponRoute };
