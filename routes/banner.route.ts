import { Hono } from "hono";
import { BannersController } from "../controllers/banners.controller";

const bannerRoute = new Hono();

bannerRoute.post("/create", BannersController.createBanner);
bannerRoute.get("/", BannersController.getBanners);
bannerRoute.delete("/:id", BannersController.deleteBanner);
bannerRoute.delete("/all", BannersController.deleteAllBanners);

bannerRoute.post("/createmain", BannersController.createMainBanner);
bannerRoute.patch("/updatemain/:id", BannersController.updateMainBanner);

bannerRoute.get("/mainbanner", BannersController.getMainBanner);
bannerRoute.delete("/mainbanner/:id", BannersController.deleteMainBanner);
bannerRoute.delete("/mainbanner/all", BannersController.deleteAllMainBanners);

bannerRoute.post("/createfeatured", BannersController.createFeaturedSection);
bannerRoute.get("/featured", BannersController.getFeaturedSections);
bannerRoute.delete("/featured/:id", BannersController.deleteFeaturedSection);
bannerRoute.delete(
  "/featured/all",
  BannersController.deleteAllFeaturedSections
);
bannerRoute.patch("/featured/:id", BannersController.updateFeaturedSection);

export { bannerRoute };
