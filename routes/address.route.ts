import { Hono } from "hono";

import { AddressController } from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const addressRoute = new Hono();

addressRoute.use(authMiddleware());

addressRoute.post("/", AddressController.createAddress);
addressRoute.patch("/:address_id", AddressController.updateAddress);
addressRoute.get("/:address_id", AddressController.getAddress);
addressRoute.get("/", AddressController.getAddresses);
addressRoute.delete("/:address_id", AddressController.deleteAddress);
addressRoute.put("/:address_id/default", AddressController.setDefaultAddress);

export { addressRoute };
