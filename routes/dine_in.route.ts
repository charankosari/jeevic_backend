import { Hono } from "hono";

import { DineInController } from "../controllers/dine_in.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const dineInRoute = new Hono();

dineInRoute.use(authMiddleware());

dineInRoute.get('/tables', DineInController.getTables);
dineInRoute.get('/tables/:table_id', DineInController.getTableById);
dineInRoute.get('/tables/by-no/:table_no', DineInController.getTableByTableNumber);

dineInRoute.get('/bookings/:booking_id', DineInController.getBooking);
dineInRoute.post('/bookings', DineInController.createBooking);
dineInRoute.patch('/bookings/:booking_id', DineInController.updateBooking);
dineInRoute.post('/bookings/cancel/:booking_id', DineInController.markBookingAsCancelled);
dineInRoute.post('/bookings/complete/:booking_id', DineInController.markBookingAsCompleted);

dineInRoute.get('/orders/:order_id', DineInController.getOrderById);
dineInRoute.get('/orders/booking/:booking_id', DineInController.getOrdersByBookingId);
dineInRoute.get('/orders/user', DineInController.getOrdersByUserId);
dineInRoute.get('/orders/table/:table_id', DineInController.getOrdersByTableId);
dineInRoute.post('/orders', DineInController.createOrder);
dineInRoute.post('/orders/cancel/:order_id', DineInController.markOrderAsCancelled);

dineInRoute.get('/checkouts/:checkout_id', DineInController.getCheckoutById);
dineInRoute.get('/checkouts/booking/:booking_id', DineInController.getCheckoutByBookingId);
dineInRoute.get('/checkouts/user/:user_id', DineInController.getCheckoutByUserId);
dineInRoute.get('/checkouts/table/:table_id', DineInController.getCheckoutByTableId);
dineInRoute.post('/checkouts', DineInController.createUserEndCheckout);

dineInRoute.get('/available-tables', DineInController.getAvailableTables);




dineInRoute.use(roleMiddleware(true));

dineInRoute.get('/checkouts', DineInController.getCheckouts);
dineInRoute.patch('/checkouts/:checkout_id', DineInController.updateCheckout);
dineInRoute.delete('/checkouts/:checkout_id', DineInController.deleteCheckout);

dineInRoute.get('/orders', DineInController.getOrders);
dineInRoute.post('/orders/ready/:order_id', DineInController.markOrderAsReady);
dineInRoute.post('/orders/serve/:order_id', DineInController.markOrderAsServed);
dineInRoute.patch('/orders/:order_id', DineInController.updateOrder);
dineInRoute.delete('/orders/:order_id', DineInController.deleteOrder);

dineInRoute.get('/bookings', DineInController.getBookings);
dineInRoute.delete('/bookings/:booking_id', DineInController.deleteBooking);

dineInRoute.post('/tables', DineInController.createTable);
dineInRoute.patch('/tables/:table_id', DineInController.updateTable);
dineInRoute.delete('/tables/:table_id', DineInController.deleteTable);

export { dineInRoute };
