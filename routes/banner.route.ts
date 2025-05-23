import { Hono } from "hono";
import { BannersController } from "../controllers/banners.controller";

const bannerRoute = new Hono();

bannerRoute.post("/create", BannersController.createBanner);
bannerRoute.get("/", BannersController.getBanners);
bannerRoute.delete("/:id", BannersController.deleteBanner);
bannerRoute.delete("/all", BannersController.deleteAllBanners);

bannerRoute.post("/createmain", BannersController.createMainBanner);
bannerRoute.patch("/updatemain", BannersController.updateMainBanner);

bannerRoute.get("/mainbanner", BannersController.getMainBanner);
bannerRoute.delete("/mainbanner/:id", BannersController.deleteMainBanner);
bannerRoute.delete("/mainbanner/all", BannersController.deleteAllMainBanners);
export { bannerRoute };
