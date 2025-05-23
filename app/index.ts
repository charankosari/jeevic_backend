import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { poweredBy } from "hono/powered-by";

import { authRoute } from "../routes/auth.route";
import { addressRoute } from "../routes/address.route";
import { categoryRoute } from "../routes/category.route";
import { cartRoute } from "../routes/cart.route";
import { couponRoute } from "../routes/coupon.route";
import { giftCardRoute } from "../routes/giftcard.route";
import { giftoptionRoute } from "../routes/giftoptions.route";
import { notificationRoute } from "../routes/notification.route";
import { orderRoute } from "../routes/order.route";
import { productRoute } from "../routes/product.route";
import { reviewRoute } from "../routes/review.route";
import { saleRoute } from "../routes/sale.route";
import { subcategoryRoute } from "../routes/subcategory.route";
import { wishlistRoute } from "../routes/wishlist.route";
import { dishRoute } from "../routes/dish.route";
import { dineInRoute } from "../routes/dine_in.route";
import { uploadRoute } from "../routes/upload.route";
import { cafeAuthRoute } from "../routes/cafe.auth.route";
import { bannerRoute } from "../routes/banner.route";
import { adminRoute } from "../routes/admin.route";
import { messageRoute } from "../routes/message.route";
import { promotionalRoute } from "../routes/promotion.route";
import { featuredRoute } from "../routes/featured.route";
const app = new Hono();

app.use(logger());
app.use(
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    // allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    // exposeHeaders: ["Content-Type", "Content-Length"],
  })
);
app.use(prettyJSON());
app.use(poweredBy());

app.all("/health", async (c) => {
  return c.text("OK!");
});

app.get("/", async (c) => {
  return c.json({
    message: "Hello, Dev!",
  });
});

app.route("/auth", authRoute);
app.route("/address", addressRoute);
app.route("/cart", cartRoute);
app.route("/category", categoryRoute);
app.route("/coupon", couponRoute);
app.route("/giftcard", giftCardRoute);
app.route("/giftoption", giftoptionRoute);
app.route("/notification", notificationRoute);
app.route("/order", orderRoute);
app.route("/product", productRoute);
app.route("/review", reviewRoute);
app.route("/sale", saleRoute);
app.route("/subcategory", subcategoryRoute);
app.route("/wishlist", wishlistRoute);
app.route("/dish", dishRoute);
app.route("/dine-in", dineInRoute);
app.route("/upload", uploadRoute);
app.route("/cafe/auth", cafeAuthRoute);
app.route("/banner", bannerRoute);
app.route("/message", messageRoute);
app.route("/promotionalemails", promotionalRoute);
app.route("/featured", featuredRoute);
// admin routes

app.route("/admin", adminRoute);
showRoutes(app);

export { app };
