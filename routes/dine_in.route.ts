import { Hono } from "hono";

import { DineInController } from "../controllers/dine_in.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { AssistanceController } from "../controllers/assistance.controller";

const dineInRoute = new Hono();

dineInRoute.use(authMiddleware());

dineInRoute.get(
  "/check-booking/:booking_id",
  DineInController.checkBookingStatus
);
dineInRoute.get("/tables", DineInController.getTables);
dineInRoute.get("/tables/:table_id", DineInController.getTableById);
dineInRoute.get(
  "/tables/by-no/:table_no",
  DineInController.getTableByTableNumber
);
// dinein assistance
dineInRoute.post("/assistance", AssistanceController.createAssistance);
dineInRoute.get("/bookings/:booking_id", DineInController.getBooking);
dineInRoute.post("/bookings", DineInController.createBooking);
dineInRoute.patch("/bookings/:booking_id", DineInController.updateBooking);
dineInRoute.post(
  "/bookings/cancel/:booking_id",
  DineInController.markBookingAsCancelled
);
dineInRoute.post(
  "/bookings/complete/:booking_id",
  DineInController.markBookingAsCompleted
);

dineInRoute.get("/orders/:order_id", DineInController.getOrderById);
dineInRoute.get(
  "/orders/booking/:booking_id",
  DineInController.getOrdersByBookingId
);
dineInRoute.get("/orders/user", DineInController.getOrdersByUserId);
dineInRoute.get("/orders/table/:table_id", DineInController.getOrdersByTableId);
dineInRoute.post("/orders", DineInController.createOrder);
dineInRoute.patch("/orders/:order_id", DineInController.updateOrder);

dineInRoute.post(
  "/orders/cancel/:order_id",
  DineInController.markOrderAsCancelled
);

dineInRoute.get("/checkouts/:checkout_id", DineInController.getCheckoutById);
dineInRoute.get(
  "/checkouts/booking/:booking_id",
  DineInController.getCheckoutByBookingId
);
dineInRoute.get(
  "/checkouts/user/:user_id",
  DineInController.getCheckoutByUserId
);
dineInRoute.get(
  "/checkouts/table/:table_id",
  DineInController.getCheckoutByTableId
);
dineInRoute.post("/checkouts", DineInController.createUserEndCheckout);

dineInRoute.post("/available-tables", DineInController.getAvailableTables);
dineInRoute.use(roleMiddleware(["admin", "ecommerce_admin"]));

dineInRoute.get("/table-stats", DineInController.getTableStats);
dineInRoute.get("/reservations", DineInController.getReservations);
dineInRoute.patch(
  "/orders/update/:order_id",
  DineInController.updateOrDeleteOrder
);
dineInRoute.get("/checkouts", DineInController.getCheckouts);
dineInRoute.patch("/checkouts/:checkout_id", DineInController.updateCheckout);
dineInRoute.delete("/checkouts/:checkout_id", DineInController.deleteCheckout);

dineInRoute.get("/orders", DineInController.getOrders);
dineInRoute.post("/orders/ready/:order_id", DineInController.markOrderAsReady);
dineInRoute.post("/orders/serve/:order_id", DineInController.markOrderAsServed);
dineInRoute.post(
  "/orders/prepare/:order_id",
  DineInController.markOrderAsPreparing
);
dineInRoute.delete("/orders/:order_id", DineInController.deleteOrder);

dineInRoute.get("/bookings", DineInController.getBookings);
dineInRoute.delete("/bookings/:booking_id", DineInController.deleteBooking);

dineInRoute.post("/tables", DineInController.createTable);
dineInRoute.patch("/tables/:table_id", DineInController.updateTable);
dineInRoute.delete("/tables/:table_id", DineInController.deleteTable);
dineInRoute.post(
  "/tables/cleaned/:table_id",
  DineInController.markTableAsCleaned
);
dineInRoute.post(
  "/tables/cleaned/:table_id",
  DineInController.markTableAsCleaned
);

// Assistance routes

dineInRoute.get("/assistance", AssistanceController.getAllAssistance);
dineInRoute.delete("/assistance/:id", AssistanceController.deleteAssistance);

export { dineInRoute };
