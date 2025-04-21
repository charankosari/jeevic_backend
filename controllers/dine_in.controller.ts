import { type Context } from 'hono';

import { DineInService } from '../services/dine_in.service';

export class DineInController {
    public static readonly getTables = async (c: Context) => {
        try {
            const tables = await DineInService.getTables();
            return c.json({
                success: true,
                data: tables,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getTableById = async (c: Context) => {
        try {
            const table_id = c.req.param('table_id');
            const table = await DineInService.getTableById(table_id);
            if (!table) {
                return c.json({
                    success: false,
                    message: 'Table not found',
                }, 404);
            }
            return c.json({
                success: true,
                data: table,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getTableByTableNumber = async (c: Context) => {
        try {
            const table_no = c.req.param('table_no');
            const table = await DineInService.getTableByTableNumber(table_no);
            if (!table) {
                return c.json({
                    success: false,
                    message: 'Table not found',
                }, 404);
            }
            return c.json({
                success: true,
                data: table,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly createTable = async (c: Context) => {
        try {
            const table = await DineInService.createTable(await c.req.json());
            return c.json({
                success: true,
                data: table,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly updateTable = async (c: Context) => {
        try {
            const table_id = c.req.param('table_id');
            await DineInService.updateTable(table_id, await c.req.json());
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly deleteTable = async (c: Context) => {
        try {
            const table_id = c.req.param('table_id');
            await DineInService.deleteTable(table_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getBookings = async (c: Context) => {
        try {
            const bookings = await DineInService.getBookings();
            return c.json({
                success: true,
                data: bookings,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getBooking = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            const booking = await DineInService.getBooking(booking_id);
            if (!booking) {
                return c.json({
                    success: false,
                    message: 'Booking not found',
                }, 404);
            }
            return c.json({
                success: true,
                data: booking,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly createBooking = async (c: Context) => {
        try {
            const user_id = c.get('user_id');
            const {
                table_id,
                booking_date,
                booking_time,
                from_time,
                to_time,
                number_of_people,
            } = await c.req.json();
            const booking = await DineInService.createBooking({
                table_id,
                user_id,
                booking_date,
                booking_time,
                from_time,
                to_time,
                number_of_people,
            });
            return c.json({
                success: true,
                data: booking,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly updateBooking = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            const {
                table_id,
                user_id,
                booking_date,
                booking_time,
                from_time,
                to_time,
                number_of_people,
                is_confirmed,
                is_cancelled,
                is_completed,
            } = await c.req.json();
            await DineInService.updateBooking(booking_id, {
                table_id,
                user_id,
                booking_date,
                booking_time,
                from_time,
                to_time,
                number_of_people,
                is_confirmed,
                is_cancelled,
                is_completed,
            });
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly deleteBooking = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            await DineInService.deleteBooking(booking_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getAvailableTables = async (c: Context) => {
        try {
            const { from_time, to_time } = await c.req.json();
            const tables = await DineInService.getAvailableTables(from_time, to_time);
            return c.json({
                success: true,
                data: tables,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly markBookingAsCompleted = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            await DineInService.markBookingAsCompleted(booking_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly markBookingAsCancelled = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            await DineInService.markBookingAsCancelled(booking_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrders = async (c: Context) => {
        try {
            const orders = await DineInService.getOrders();
            return c.json({
                success: true,
                data: orders,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrderById = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            const order = await DineInService.getOrderById(order_id);
            return c.json({
                success: true,
                data: order,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrdersByBookingId = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            const orders = await DineInService.getOrdersByBookingId(booking_id);
            return c.json({
                success: true,
                data: orders,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrdersByUserId = async (c: Context) => {
        try {
            const user_id = c.get('user_id');
            const orders = await DineInService.getOrdersByUserId(user_id);
            return c.json({
                success: true,
                data: orders,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrdersByTableId = async (c: Context) => {
        try {
            const table_id = c.req.param('table_id');
            const orders = await DineInService.getOrdersByTableId(table_id);
            return c.json({
                success: true,
                data: orders,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly createOrder = async (c: Context) => {
        try {
            const user_id = c.get('user_id');
            const {
                table_id,
                dish_id,
                quantity,
                booking_id,
            } = await c.req.json();
            const order = await DineInService.createOrder({
                user_id,
                table_id,
                dish_id,
                quantity,
                booking_id,
            });
            return c.json({
                success: true,
                data: order,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly updateOrder = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            const data = await c.req.json();
            const order = await DineInService.updateOrder(order_id, data);
            return c.json({
                success: true,
                data: order,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    }

    public static readonly deleteOrder = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            await DineInService.deleteOrder(order_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getOrder = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            const order = await DineInService.getOrderById(order_id);
            return c.json({
                success: true,
                data: order,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly markOrderAsServed = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            await DineInService.markOrderAsServed(order_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly markOrderAsCancelled = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            await DineInService.markOrderAsCancelled(order_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly markOrderAsReady = async (c: Context) => {
        try {
            const order_id = c.req.param('order_id');
            await DineInService.markOrderAsReady(order_id);
            return c.json({
                success: true,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly createUserEndCheckout = async (c: Context) => {
        try {
            const data = await c.req.json();
            const order = await DineInService.createUserEndCheckout(data);
            return c.json({
                success: true,
                data: order,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getCheckoutById = async (c: Context) => {
        try {
            const checkout_id = c.req.param('checkout_id');
            const checkout = await DineInService.getCheckoutById(checkout_id);
            return c.json({
                success: true,
                data: checkout,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getCheckouts = async (c: Context) => {
        try {
            const checkouts = await DineInService.getCheckouts();
            return c.json({
                success: true,
                data: checkouts,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getCheckoutByBookingId = async (c: Context) => {
        try {
            const booking_id = c.req.param('booking_id');
            const checkout = await DineInService.getCheckoutByBookingId(booking_id);
            return c.json({
                success: true,
                data: checkout,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly updateCheckout = async (c: Context) => {
        try {
            const checkout_id = c.req.param('checkout_id');
            const data = await c.req.json();
            const checkout = await DineInService.updateCheckout(checkout_id, data);
            return c.json({
                success: true,
                data: checkout,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly deleteCheckout = async (c: Context) => {
        try {
            const checkout_id = c.req.param('checkout_id');
            await DineInService.deleteCheckout(checkout_id);
            return c.json({
                success: true,
                message: 'Checkout deleted successfully',
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getCheckoutByUserId = async (c: Context) => {
        try {
            const user_id = c.req.param('user_id');
            const checkout = await DineInService.getCheckoutByUserId(user_id);
            return c.json({
                success: true,
                data: checkout,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };

    public static readonly getCheckoutByTableId = async (c: Context) => {
        try {
            const table_id = c.req.param('table_id');
            const checkout = await DineInService.getCheckoutByTableId(table_id);
            return c.json({
                success: true,
                data: checkout,
            });
        }
        catch (err) {
            if(err instanceof Error){
                return c.json({
                    success: false,
                    message: err.message,
                }, 500);
            }
        }
    };
}