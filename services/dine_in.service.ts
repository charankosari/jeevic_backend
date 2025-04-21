import { DineInCheckout, type IDineInCheckout } from '../models/dine_in_checkout.model';
import { DineInTables, type IDineInTables } from '../models/dine_in_table.model';
import { DineInOrders, type IDineInOrders } from '../models/dine_in_order.model';
import { DineInTableBookings, type IDineInTableBookings } from '../models/dine_in_table_booking.model';
import { Dish, type IDish } from '../models/dish.model';

export class DineInService {
    // tables
    public static readonly getTables = async () : Promise<IDineInTables[]>=> {
        return await DineInTables.find({}).then((tables) => {
            return tables.rows;
        });
    }

    public static readonly getTableById = async (
        table_id: string,
    ) : Promise<IDineInTables | null>=> {
        return await DineInTables.find({
            id: table_id,
        }).then((table) => {
            return table.rows[0] ?? null;
        });
    }

    public static readonly createTable = async (
        {
            table_number,
            capacity,
            meta_data,
        }: {
            table_number: string;
            capacity: number;
            meta_data: object;
        },
    ) : Promise<IDineInTables>=> {
        return await DineInTables.create({
            table_number,
            capacity,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    public static readonly updateTable = async (
        table_id: string,
        {
            table_number,
            capacity,
            meta_data,
        }: {
            table_number: string;
            capacity: number;
            meta_data: object;
        },
    ) : Promise<void>=> {
        await DineInTables.updateMany({
            id: table_id,
        }, {
            table_number,
            capacity,
            meta_data,
            updated_at: new Date(),
        });
    }

    public static readonly deleteTable = async (
        table_id: string,
    ) : Promise<void>=> {
        await DineInTables.deleteMany({
            id: table_id,
        });
    }

    public static readonly getTableByTableNumber = async (
        table_number: string,
    ) : Promise<IDineInTables | null>=> {
        return await DineInTables.find({
            table_number,
        }).then((table) => {
            return table.rows[0] ?? null;
        });
    }

    // booking -> offline booking | online booking
    public static readonly getBookings = async () : Promise<IDineInTableBookings[]>=> {
        return await DineInTableBookings.find(
            {},
            {
                sort: {
                    created_at: "DESC",
                }
            }
        ).then((bookings) => {
            return bookings.rows;
        });
    }

    public static readonly getBooking = async (
        booking_id: string,
    ) : Promise<IDineInTableBookings | null>=> {
        return await DineInTableBookings.find({
            id: booking_id,
        }).then((booking) => {
            return booking.rows[0] ?? null;
        });
    }

    public static readonly createBooking = async (
        {
            table_id,
            user_id,
            booking_date,
            booking_time,
            from_time,
            to_time,
            number_of_people,
        }: {
            table_id: string;
            user_id: string;
            booking_date: Date;
            booking_time: Date;
            from_time: Date;
            to_time?: Date;
            number_of_people?: number;
            is_confirmed?: boolean;
            is_cancelled?: boolean;
            is_completed?: boolean;
        },
    ) : Promise<IDineInTableBookings>=> {
        return await DineInTableBookings.create({
            table_id,
            user_id,
            booking_date,
            booking_time,
            from_time,
            to_time,
            number_of_people,
            is_confirmed: false,
            is_cancelled: false,
            is_completed: false,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    public static readonly updateBooking = async (
        booking_id: string,
        {
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
        }: {
            table_id?: string;
            user_id?: string;
            booking_date?: Date;
            booking_time?: Date;
            from_time?: Date;
            to_time?: Date;
            number_of_people?: number;
            is_confirmed?: boolean;
            is_cancelled?: boolean;
            is_completed?: boolean;
        },
    ) : Promise<void>=> {
        await DineInTableBookings.updateMany({
            id: booking_id,
        }, {
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
            updated_at: new Date(),
        });
    }

    public static readonly deleteBooking = async (
        booking_id: string,
    ) : Promise<void>=> {
        await DineInTableBookings.deleteMany({
            id: booking_id,
        });
    }

    public static readonly getAvailableTables = async (
        from_time: Date,
        to_time: Date,
    ) : Promise<IDineInTables[]>=> {
        const tables: {
            rows: IDineInTables[];
        } = await DineInTables.find({});

        const bookings : {
            rows: IDineInTableBookings[];
        } = await DineInTableBookings.find({
            from_time: {
                $lte: to_time,
            },
            to_time: {
                $gte: from_time,
            },
        });

        const booked_table_ids = bookings.rows.map((booking) => booking.table_id);

        const available_tables = tables.rows.filter((table) => {
            return !booked_table_ids.includes(table.id);
        });

        return available_tables;
    }

    public static readonly markBookingAsCompleted = async (
        booking_id: string,
    ) : Promise<void>=> {
        await DineInTableBookings.updateMany({
            id: booking_id,
        }, {
            is_completed: true,
            updated_at: new Date(),
        });
    }

    public static readonly markBookingAsCancelled = async (
        booking_id: string,
    ) : Promise<void>=> {
        await DineInTableBookings.updateMany({
            id: booking_id,
        }, {
            is_cancelled: true,
            updated_at: new Date(),
        });
    }

    // orders
    public static readonly getOrders = async () : Promise<IDineInOrders[]>=> {
        return await DineInOrders.find({}, {
            sort: {
                created_at: 'DESC',
            },
        }).then((orders) => {
            return orders.rows;
        });
    }

    public static readonly getOrderById = async (
        order_id: string,
    ) : Promise<IDineInOrders | null>=> {
        return await DineInOrders.findById(order_id);
    }

    public static readonly getOrdersByBookingId = async (
        booking_id: string,
    ) : Promise<IDineInOrders[] | null>=> {
        return await DineInOrders.find({
            booking_id,
        }).then((orders) => {
            return orders.rows;
        });
    }

    public static readonly getOrdersByUserId = async (
        user_id: string,
    ) : Promise<IDineInOrders[] | null>=> {
        return await DineInOrders.find({
            user_id,
        }).then((orders) => {
            return orders.rows;
        });
    }

    public static readonly getOrdersByTableId = async (
        table_id: string,
    ) : Promise<IDineInOrders[] | null>=> {
        return await DineInOrders.find({
            table_id,
        }).then((orders) => {
            return orders.rows;
        });
    }

    public static readonly createOrder = async (
        {
            user_id,
            table_id,
            dish_id,
            quantity,
            booking_id
        }: {
            user_id: string;
            table_id: string;
            dish_id: string;
            quantity: number;
            booking_id: string;
        },
    ) : Promise<IDineInOrders>=> {
        return await DineInOrders.create({
            user_id,
            table_id,
            dish_id,
            quantity,
            is_served: false,
            booking_id,
            order_status: 'pending',
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    public static readonly updateOrder = async (
        order_id: string,
        data: Partial<IDineInOrders>,
    ) : Promise<IDineInOrders | null>=> {
        return await DineInOrders.updateById(
            order_id,
            data,
        ).then((order) => {
            return order;
        });
    }

    public static readonly deleteOrder = async (
        order_id: string,
    ) : Promise<void>=> {
        await DineInOrders.deleteMany({
            id: order_id,
        });
    }

    public static readonly markOrderAsServed = async (
        order_id: string,
    ) : Promise<void>=> {
        await DineInOrders.updateMany({
            id: order_id,
        }, {
            order_status: 'served',
            is_served: true,
            updated_at: new Date(),
        });
    }

    public static readonly markOrderAsCancelled = async (
        order_id: string,
    ) : Promise<void>=> {
        await DineInOrders.updateMany({
            id: order_id,
        }, {
            order_status: 'cancelled',
            updated_at: new Date(),
        });
    }

    public static readonly markOrderAsReady = async (
        order_id: string,
    ) : Promise<void>=> {
        await DineInOrders.updateMany({
            id: order_id,
        }, {
            order_status: 'ready',
            updated_at: new Date(),
        });
    }

    // checkout
    public static readonly createUserEndCheckout = async (
        booking_id: string,
    ) : Promise<IDineInCheckout>=> {
        // fetch all the orders for the booking
        const orders: {
            rows: IDineInOrders[];
        } = await DineInOrders.find({
            booking_id,
        });
        const order_ids = orders.rows.map((order) => order.id);
        const dish_ids = orders.rows.map((order) => order.dish_id);

        // fetch the booking
        const booking = await DineInTableBookings.findById(booking_id);
        if (!booking) {
            throw new Error('Booking not found');
        }

        const dishs : {
            rows: IDish[];
        } = await Dish.find({
            id: {
                $in: dish_ids,
            },
        });

        let total_amount = 0;
        
        for(const order of orders.rows) {
            const dish = dishs.rows.find((dish) => dish.id === order.dish_id);
            if (!dish) {
                continue;
            }
            total_amount += dish.price * order.quantity;
        }
     
        // create a new checkout
        return await DineInCheckout.create({
            user_id: booking.user_id,
            booking_id,
            table_id: booking.table_id,
            order_ids,
            total_price: total_amount,
            payment_status: 'pending',
            is_checked_out: false,
            created_at: new Date(),
            updated_at: new Date(),
        });
    }

    public static readonly getCheckoutById = async (
        checkout_id: string,
    ) : Promise<IDineInCheckout | null>=> {
        return await DineInCheckout.findById(checkout_id);
    }

    public static readonly getCheckouts = async () : Promise<IDineInCheckout[]>=> {
        return await DineInCheckout.find({}, {
            sort: {
                created_at: 'DESC',
            },
        }).then((checkouts) => {
            return checkouts.rows;
        });
    }

    public static readonly getCheckoutByBookingId = async (
        booking_id: string,
    ) : Promise<IDineInCheckout | null>=> {
        return await DineInCheckout.findOne({
            booking_id,
        });
    }

    public static readonly updateCheckout = async (
        checkout_id: string,
        data: Partial<IDineInCheckout>,
    ) : Promise<IDineInCheckout | null>=> {
        return await DineInCheckout.updateOne({
            id: checkout_id,
        }, data);
    }

    public static readonly deleteCheckout = async (
        checkout_id: string,
    ) : Promise<boolean>=> {
        return await DineInCheckout.deleteOne({
            id: checkout_id,
        });
    }

    public static readonly getCheckoutByUserId = async (
        user_id: string,
    ) : Promise<IDineInCheckout[] | null>=> {
        const data : {
            rows: IDineInCheckout[];
        } = await DineInCheckout.find({
            user_id,
        });

        return data.rows;
    }

    public static readonly getCheckoutByTableId = async (
        table_id: string,
    ) : Promise<IDineInCheckout[] | null>=> {
        const data : {
            rows: IDineInCheckout[];
        } = await DineInCheckout.find({
            table_id,
        });

        return data.rows;
    }
}