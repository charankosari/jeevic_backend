import {
  DineInCheckout,
  type IDineInCheckout,
} from "../models/dine_in_checkout.model";
import {
  DineInTables,
  type IDineInTables,
} from "../models/dine_in_table.model";
import {
  DineInOrders,
  type IDineInOrders,
} from "../models/dine_in_order.model";
import {
  DineInTableBookings,
  type IDineInTableBookings,
} from "../models/dine_in_table_booking.model";
import { Dish, type IDish } from "../models/dish.model";
import { Admin, type IAdmin } from "../models/admin.model";
import { UserService } from "./user.service";
import type { IUser } from "../models/user.model";
interface TableMetaData {
  to_be_cleaned: boolean;
  status: string;
}
export class DineInService {
  // tables
  public static readonly getTables = async (): Promise<IDineInTables[]> => {
    return await DineInTables.find({}).then((tables) => {
      return tables.rows;
    });
  };

  public static readonly getTableById = async (
    table_id: string
  ): Promise<IDineInTables | null> => {
    return await DineInTables.find({
      id: table_id,
    }).then((table) => {
      return table.rows[0] ?? null;
    });
  };

  public static readonly createTable = async ({
    table_number,
    capacity,
    meta_data,
  }: {
    table_number: string;
    capacity: number;
    meta_data: object;
  }): Promise<IDineInTables> => {
    return await DineInTables.create({
      table_number,
      capacity,
      meta_data,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  public static readonly updateTable = async (
    table_id: string,
    {
      table_number,
      capacity,
      meta_data,
    }: {
      table_number: string;
      capacity: number;
      meta_data: TableMetaData;
    }
  ): Promise<void> => {
    await DineInTables.updateMany(
      {
        id: table_id,
      },
      {
        table_number,
        capacity,
        meta_data,
        updated_at: new Date(),
      }
    );
  };

  public static readonly deleteTable = async (
    table_id: string
  ): Promise<void> => {
    await DineInTables.findOneAndRemove({
      id: table_id,
    });
  };

  public static readonly getTableByTableNumber = async (
    table_number: string
  ): Promise<IDineInTables | null> => {
    return await DineInTables.find({
      table_number,
    }).then((table) => {
      return table.rows[0] ?? null;
    });
  };

  // booking -> offline booking | online booking
  public static readonly getBookings = async (): Promise<
    IDineInTableBookings[]
  > => {
    return await DineInTableBookings.find(
      {},
      {
        sort: {
          created_at: "DESC",
        },
      }
    ).then((bookings) => {
      return bookings.rows;
    });
  };

  public static readonly getBooking = async (
    booking_id: string
  ): Promise<IDineInTableBookings | null> => {
    return await DineInTableBookings.find({
      id: booking_id,
    }).then((booking) => {
      return booking.rows[0] ?? null;
    });
  };

  public static readonly createBooking = async ({
    table_id,
    user_id,
    booking_date,
    booking_time,
    from_time,
    to_time,
    number_of_people,
    name,
    phone,
  }: {
    table_id?: string; // <-- Make optional
    user_id: string;
    booking_date: Date;
    booking_time: Date;
    from_time: Date;
    to_time?: Date;
    number_of_people?: number;
    is_confirmed?: boolean;
    is_cancelled?: boolean;
    is_completed?: boolean;
    name?: string;
    phone?: string;
  }): Promise<IDineInTableBookings> => {
    // Only check for conflicts if table_id is provided
    if (table_id) {
      const preBooking: {
        rows: IDineInTableBookings[];
      } = await DineInTableBookings.find({
        table_id,
        is_completed: false,
        is_cancelled: false,
        is_confirmed: true,
      });

      if (preBooking.rows.length > 0) {
        throw new Error("Table is already booked");
      }
    }
    const adminDoc = await Admin.findOne({});
    if (!adminDoc) {
      throw new Error("Admin document not found");
    }
    const bookingDate = new Date(booking_time);
    const dateKey = `${bookingDate.getDate()}-${bookingDate.getMonth() + 1}-${bookingDate.getFullYear()}`;
    const hour = bookingDate.getHours();
    if (!adminDoc.peakHours) {
      adminDoc.peakHours = {};
    }
    if (!adminDoc.peakHours[dateKey]) {
      adminDoc.peakHours[dateKey] = {};
    }
    const updatedPeakHours = {
      ...adminDoc.peakHours,
      [dateKey]: {
        ...adminDoc.peakHours[dateKey],
        [hour]: (adminDoc.peakHours[dateKey]?.[hour] || 0) + 1,
      },
    };
    await Admin.updateById(adminDoc.id, {
      peakHours: updatedPeakHours,
      updated_at: new Date(),
    });

    // Increment the count for this hour
    return await DineInTableBookings.create({
      table_id,
      user_id,
      booking_date,
      booking_time,
      from_time,
      name,
      phone,
      to_time,
      number_of_people,
      is_confirmed: true,
      is_cancelled: false,
      is_completed: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
  };
  public static readonly isBookingActive = async (
    booking_id: string
  ): Promise<boolean> => {
    const booking = await DineInTableBookings.findById(booking_id);
    if (!booking) {
      return false;
    }
    return !booking.is_completed && !booking.is_cancelled;
  };

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
    }
  ): Promise<void> => {
    await DineInTableBookings.updateMany(
      {
        id: booking_id,
      },
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
        updated_at: new Date(),
      }
    );
  };

  public static readonly deleteBooking = async (
    booking_id: string
  ): Promise<void> => {
    await DineInTableBookings.findOneAndRemove({
      id: booking_id,
    });
  };

  public static readonly getAvailableTables = async (
    from_time: Date,
    to_time: Date
  ): Promise<IDineInTables[]> => {
    const tables: {
      rows: IDineInTables[];
    } = await DineInTables.find({});

    const bookings: {
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
  };

  public static readonly markBookingAsCompleted = async (
    booking_id: string
  ): Promise<void> => {
    await DineInTableBookings.updateMany(
      {
        id: booking_id,
      },
      {
        is_completed: true,
        to_time: new Date(),
        updated_at: new Date(),
      }
    );
  };

  public static readonly markBookingAsCancelled = async (
    booking_id: string
  ): Promise<void> => {
    await DineInTableBookings.updateMany(
      {
        id: booking_id,
      },
      {
        is_cancelled: true,
        updated_at: new Date(),
      }
    );
  };

  // orders
  public static readonly getOrders = async (): Promise<IDineInOrders[]> => {
    return await DineInOrders.find(
      {},
      {
        sort: {
          created_at: "DESC",
        },
      }
    ).then((orders) => {
      return orders.rows;
    });
  };

  public static readonly getOrderById = async (
    order_id: string
  ): Promise<IDineInOrders | null> => {
    return await DineInOrders.findById(order_id);
  };

  public static readonly getOrdersByBookingId = async (
    booking_id: string
  ): Promise<IDineInOrders[] | null> => {
    return await DineInOrders.find({
      booking_id,
    }).then((orders) => {
      return orders.rows;
    });
  };

  public static readonly getOrdersByUserId = async (
    user_id: string
  ): Promise<IDineInOrders[] | null> => {
    return await DineInOrders.find({
      user_id,
    }).then((orders) => {
      return orders.rows;
    });
  };

  public static readonly getOrdersByTableId = async (
    table_id: string
  ): Promise<IDineInOrders[] | null> => {
    return await DineInOrders.find({
      table_id,
    }).then((orders) => {
      return orders.rows;
    });
  };

  public static readonly createOrder = async ({
    user_id,
    table_id,
    booking_id,
    items,
    order_status,
    is_served,
  }: {
    user_id: string;
    table_id: string;
    booking_id: string;
    is_served: false;
    order_status: "pending";
    items: Array<{
      dish_id: string;
      quantity: number;
      instructions?: string;
      status?: string;
    }>;
  }): Promise<IDineInOrders> => {
    // Validate that items array is not empty
    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one item");
    }

    const dishes = await Dish.find({
      id: {
        $in: items.map((item) => item.dish_id),
      },
    });
    const pendingItems = items.map((item) => ({
      ...item,
      status: "pending",
    }));
    let adminDoc = await Admin.findOne({});
    if (!adminDoc) {
      throw new Error("Admin document not found");
    }
    for (const item of pendingItems) {
      const dish = dishes.rows.find((d: IDish) => d.id === item.dish_id);
      if (!dish) continue;
      const currentCategoryCount =
        adminDoc.salesOfProducts[dish.dish_category_id] || 0;
      adminDoc.salesOfProducts[dish.dish_category_id] =
        currentCategoryCount + item.quantity;
      if (!adminDoc.salesOfAllProducts[dish.dish_category_id]) {
        adminDoc.salesOfAllProducts[dish.dish_category_id] = {};
      }
      const currentItemCount =
        adminDoc.salesOfAllProducts[dish.dish_category_id][dish.id] || 0;
      adminDoc.salesOfAllProducts[dish.dish_category_id][dish.id] =
        currentItemCount + item.quantity;
    }
    await Admin.updateById(adminDoc.id, {
      salesOfProducts: adminDoc.salesOfProducts,
      salesOfAllProducts: adminDoc.salesOfAllProducts,
      updated_at: new Date(),
    });
    await DineInTables.updateMany(
      {
        table_number: table_id,
      },
      {
        meta_data: {
          ...(await DineInTables.find({ table_number: table_id }).then(
            (table) => table.rows[0]?.meta_data
          )),
          status: "Active",
        },
        updated_at: new Date(),
      }
    );
    return await DineInOrders.create({
      user_id,
      table_id,
      booking_id,
      items: pendingItems,
      is_served: false,
      order_status: "pending",
      created_at: new Date(),
      updated_at: new Date(),
    });
  };

  public static readonly updateOrder = async (
    order_id: string,
    data: Partial<IDineInOrders>
  ): Promise<IDineInOrders | null> => {
    return await DineInOrders.updateById(order_id, data).then((order) => {
      return order;
    });
  };

  public static readonly deleteOrder = async (
    order_id: string
  ): Promise<void> => {
    await DineInOrders.findOneAndRemove({
      id: order_id,
    });
  };

  public static readonly markOrderAsServed = async (
    order_id: string
  ): Promise<void> => {
    const order = await DineInOrders.findById(order_id);
    if (!order) {
      throw new Error("Order not found");
    }
    const updatedItems = order.items.map((item) => {
      if (item.status === "preparing") {
        return { ...item, status: "served" };
      }
      return item;
    });
    await DineInOrders.updateMany(
      {
        id: order_id,
      },
      {
        items: updatedItems,
        order_status: "served",
        updated_at: new Date(),
      }
    );
  };

  public static readonly markOrderAsCancelled = async (
    order_id: string
  ): Promise<void> => {
    await DineInOrders.updateMany(
      {
        id: order_id,
      },
      {
        order_status: "cancelled",
        updated_at: new Date(),
      }
    );
  };

  public static readonly markOrderAsReady = async (
    order_id: string
  ): Promise<void> => {
    // Fetch the order to check item statuses
    const order = await DineInOrders.findById(order_id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update item statuses if they are "pending"
    const updatedItems = order.items.map((item) => {
      if (item.status === "served") {
        return { ...item, status: "ready" };
      }
      return item;
    });

    // Update the order with new item statuses and mark as ready
    await DineInOrders.updateMany(
      {
        id: order_id,
      },
      {
        items: updatedItems,
        order_status: "ready",
        updated_at: new Date(),
      }
    );
  };

  // markOrderAsPreparing
  public static readonly markOrderAsPreparing = async (
    order_id: string
  ): Promise<void> => {
    const order = await DineInOrders.findById(order_id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Update item statuses if they are "pending"
    const updatedItems = order.items.map((item) => {
      if (item.status === "pending") {
        return { ...item, status: "preparing" };
      }
      return item;
    });

    // Update the order with new item statuses and mark as ready
    await DineInOrders.updateMany(
      {
        id: order_id,
      },
      {
        items: updatedItems,
        order_status: "preparing",
        updated_at: new Date(),
      }
    );
  };

  // checkout
  public static readonly createUserEndCheckout = async (
    booking_id: string
  ): Promise<IDineInCheckout> => {
    try {
      const booking = await DineInTableBookings.findById(booking_id);
      if (!booking) {
        throw new Error("Booking not found");
      }
      const table_number = booking.table_id;
      if (!table_number) {
        throw new Error("Table number is undefined");
      }
      const table = await DineInTables.find({
        table_number: table_number,
      }).then((result) => result.rows[0] ?? null);

      if (!table) {
        throw new Error(`Table with number ${table_number} not found`);
      }
      const real_table_id = table.id;
      const orders: {
        rows: IDineInOrders[];
      } = await DineInOrders.find({
        booking_id,
      });
      const order_ids = orders.rows.map((order) => order.id);
      const dish_ids = orders.rows.flatMap((order) =>
        order.items.map((item) => item.dish_id)
      );
      const dishs: {
        rows: IDish[];
      } = await Dish.find({
        id: {
          $in: dish_ids,
        },
      });
      let total_amount = 0;

      for (const order of orders.rows) {
        for (const item of order.items) {
          const dish = dishs.rows.find((dish) => dish.id === item.dish_id);
          if (!dish) {
            continue;
          }
          total_amount += dish.price * item.quantity;
        }
      }
      await DineInTableBookings.updateById(booking_id, {
        is_ready_to_bill: true,
        updated_at: new Date(),
      });

      // create a new checkout
      return await DineInCheckout.create({
        user_id: booking.user_id,
        booking_id,
        table_id: table_number, // Use the real table_id here
        order_ids,
        total_price: total_amount,
        payment_status: "pending",
        is_checked_out: false,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } catch (error) {
      console.error("Error in createUserEndCheckout:", error);
      throw error;
    }
  };

  public static readonly getCheckoutById = async (
    checkout_id: string
  ): Promise<IDineInCheckout | null> => {
    return await DineInCheckout.findById(checkout_id);
  };

  public static readonly getCheckouts = async (): Promise<
    IDineInCheckout[]
  > => {
    return await DineInCheckout.find(
      {},
      {
        sort: {
          created_at: "DESC",
        },
      }
    ).then((checkouts) => {
      return checkouts.rows;
    });
  };

  public static readonly getCheckoutByBookingId = async (
    booking_id: string
  ): Promise<IDineInCheckout | null> => {
    return await DineInCheckout.findOne({
      booking_id,
    });
  };

  // public static readonly updateCheckout = async (
  //     checkout_id: string,
  //     data: Partial<IDineInCheckout>,
  // ) : Promise<IDineInCheckout | null>=> {
  //         const checkout = await DineInCheckout.findById(checkout_id);
  //         if (checkout) {
  //             const adminDoc = await Admin.findOne({});
  //             if (!adminDoc) {
  //                 throw new Error('Admin document not found');
  //             }
  //             const today = new Date();
  //             const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
  //             const currentDailyProfit = adminDoc.dailyProfits[dateKey] || 0;
  //             adminDoc.dailyProfits[dateKey] = currentDailyProfit + checkout.total_price;
  //             adminDoc.totalProfit = (adminDoc.totalProfit || 0) + checkout.total_price;
  //             await Admin.updateById(adminDoc.id, {
  //                 dailyProfits: adminDoc.dailyProfits,
  //                 totalProfit: adminDoc.totalProfit,
  //                 updated_at: new Date()
  //             });
  //             if (checkout.table_id) {
  //                 const table = await DineInTables.find({
  //                     table_number: checkout.table_id,
  //                 }).then((result) => result.rows[0] ?? null);
  //                 if (table) {
  //                     await DineInTables.updateById(checkout.table_id, {
  //                         meta_data: {
  //                             ...table.meta_data,
  //                             status: "Untouched",
  //                             to_be_cleaned: true
  //                         },
  //                         updated_at: new Date()
  //                     });
  //                 }
  //             }
  //             if (checkout.booking_id) {
  //                 const booking = await DineInTableBookings.findById(checkout.booking_id);
  //                 if (booking) {
  //                     await DineInTableBookings.updateById(checkout.booking_id, {
  //                         is_completed: true,
  //                         updated_at: new Date()
  //                     });
  //                 }
  //             }
  //         }

  //     return await DineInCheckout.updateById(checkout_id, data);
  // }
  public static readonly updateCheckout = async (
    checkout_id: string,
    data: Partial<IDineInCheckout>
  ): Promise<IDineInCheckout | null> => {
    const checkout = await DineInCheckout.findById(checkout_id);
    const adminDoc = await Admin.findOne({});
    if (!adminDoc) {
      throw new Error("Admin document not found");
    }
    const today = new Date();
    const dateKey = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const currentDailyProfit = adminDoc.dailyProfits[dateKey] || 0;
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const yesterdayKey = `${yesterday.getDate()}-${yesterday.getMonth() + 1}-${yesterday.getFullYear()}`;
    const yesterdayRevenue = adminDoc.revenueHistory[yesterdayKey] || 0;
    adminDoc.revenueHistory[dateKey] = yesterdayRevenue + checkout.total_price;
    adminDoc.dailyProfits[dateKey] = currentDailyProfit + checkout.total_price;
    adminDoc.totalProfit = (adminDoc.totalProfit || 0) + checkout.total_price;
    await Admin.updateById(adminDoc.id, {
      dailyProfits: adminDoc.dailyProfits,
      totalProfit: adminDoc.totalProfit,
      updated_at: new Date(),
    });
    if (checkout.table_id) {
      const table = await DineInTables.find({
        table_number: checkout.table_id,
      }).then((result) => result.rows[0] ?? null);
      console.log(table);
      if (table) {
        await DineInTables.updateById(table.id, {
          meta_data: {
            ...table.meta_data,
            status: "Untouched",
            to_be_cleaned: true,
          },
          updated_at: new Date(),
        });
      }
    }
    if (checkout.booking_id) {
      const booking = await DineInTableBookings.findById(checkout.booking_id);
      console.log(booking);
      if (booking) {
        await DineInTableBookings.updateById(checkout.booking_id, {
          is_completed: true,
          updated_at: new Date(),
        });
      }
    }

    return await DineInCheckout.updateById(checkout_id, data);
  };
  public static readonly deleteCheckout = async (
    checkout_id: string
  ): Promise<boolean> => {
    return await DineInCheckout.findOneAndRemove({
      id: checkout_id,
    });
  };

  public static readonly getCheckoutByUserId = async (
    user_id: string
  ): Promise<IDineInCheckout[] | null> => {
    const data: {
      rows: IDineInCheckout[];
    } = await DineInCheckout.find({
      user_id,
    });

    return data.rows;
  };

  public static readonly getCheckoutByTableId = async (
    table_id: string
  ): Promise<IDineInCheckout[] | null> => {
    const data: {
      rows: IDineInCheckout[];
    } = await DineInCheckout.find({
      table_id,
    });

    return data.rows;
  };

  // Get All Reservations
  public static readonly getReservations = async (
    page: number,
    limit: number
  ): Promise<{
    reservations: IReservation[];
    totalCount: number;
  }> => {
    const data: {
      rows: IDineInTableBookings[];
    } = await DineInTableBookings.find(
      {
        is_completed: true,
      },
      {
        sort: {
          created_at: "DESC",
        },
        skip: (page - 1) * limit,
        limit,
      }
    );

    const totalCount: number = await DineInTableBookings.count();

    const reservations: IReservation[] = await Promise.all(
      data.rows.map(async (booking) => {
        const table = await DineInTables.findOne({
          id: booking.table_id,
        });
        const user = (await UserService.getUser(booking.user_id)) as IUser;

        let status = "pending";
        if (booking.is_completed) {
          status = "completed";
        } else if (booking.is_cancelled) {
          status = "cancelled";
        }

        return {
          id: booking.id,
          name: user?.first_name + " " + user?.last_name,
          phone: user.country_code + user.phone_number,
          status,
          people: table.capacity,
          table: table.table_number,
        };
      })
    );

    return {
      reservations,
      totalCount,
    };
  };

  // In getTableStats method
  public static readonly getTableStats = async (): Promise<
    IDineInTableStats[]
  > => {
    const tables: {
      rows: IDineInTables[];
    } = await DineInTables.find({});

    const bookings: {
      rows: IDineInTableBookings[];
    } = await DineInTableBookings.find({
      is_cancelled: false,
    });

    const orders: {
      rows: IDineInOrders[];
    } = await DineInOrders.find({
      booking_id: {
        $in: bookings.rows.map((booking) => booking.id),
      },
    });

    const checkouts: {
      rows: IDineInCheckout[];
    } = await DineInCheckout.find({
      booking_id: {
        $in: bookings.rows.map((booking) => booking.id),
      },
    });

    const dishs: {
      rows: IDish[];
    } = await Dish.find({});

    const tableStats: IDineInTableStats[] = await Promise.all(
      tables.rows.map(async (table) => {
        console.log("Processing table:", table.table_number);
        const activeBooking = bookings.rows.find(
          (booking) =>
            booking.table_id === table.table_number &&
            !booking.is_cancelled &&
            !booking.is_completed
        ) as IDineInTableBookings;
        // Find the most recent booking for this table
        const allTableBookings = bookings.rows.filter(
          (booking) => booking.table_id === table.table_number
        );
        const lastBooking = allTableBookings.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0];
        console.log("Last booking found:", lastBooking);
        // Find checkout for the last booking
        const lastCheckout = lastBooking
          ? checkouts.rows.find(
              (checkout) => checkout.booking_id === lastBooking.id
            )
          : null;
        console.log("Last checkout found:", lastCheckout);
        // Find orders for the active booking
        const tableOrders = activeBooking
          ? orders.rows.filter((order) => order.booking_id === activeBooking.id)
          : [];
        console.log("Orders for active booking:", tableOrders, orders);

        // Calculate items and total amount
        const items = tableOrders.flatMap((order) => {
          if (!order.items || !Array.isArray(order.items)) {
            return [];
          }

          return order.items.map((item) => {
            const dish = dishs.rows.find((d) => d.id === item.dish_id);
            return {
              name: dish ? dish.name : "Unknown Item",
              quantity: item.quantity || 0,
              price: dish ? dish.price : 0,
              item_status: item.status || "unknown",
              order_id: order.id,
              order_status: order.order_status || "unknown",
              dish_id: item.dish_id,
              total: (dish ? dish.price : 0) * (item.quantity || 0),
            };
          });
        });
        console.log("Items calculated:", items);
        const total_amount = items.reduce((sum, item) => sum + item.total, 0);

        // Determine table status based on the specified conditions
        let status = "Untouched";
        console.log(activeBooking);
        // Check if table is currently booked
        if (
          table.meta_data &&
          (table.meta_data as any).to_be_cleaned === true
        ) {
          status = "To be Cleaned";
          return {
            table_number: table.table_number,
            status,
            booked_at: "",
            items: [], // Don't show items for tables that need cleaning
            total_amount: 0,
          };
        }
        if (activeBooking) {
          if (activeBooking.is_ready_to_bill) {
            status = "Ready to Bill";
          } else {
            status = "Active";
          }

          return {
            table_number: table.table_number,
            status,
            booked_at: new Date(activeBooking.created_at).toISOString(),
            items, // Show items for active or ready-to-bill tables
            total_amount,
            checkout_id: lastCheckout ? lastCheckout.id : null,
            booking_id: activeBooking.id,
          };
        }

        // Check if table needs cleaning

        // If table is not booked, check if last booking's checkout is checked out
        if (lastBooking && lastCheckout && lastCheckout.is_checked_out) {
          return {
            table_number: table.table_number,
            status,
            booked_at: "",
            items: [], // Don't show items for untouched tables
            total_amount: 0,
          };
        }

        // Default case
        return {
          table_number: table.table_number,
          status,
          booked_at: "",
          items: [],
          total_amount: 0,
        };
      })
    );

    return tableStats;
  };

  // markTableAsCleaned
  public static readonly markTableAsCleaned = async (
    table_id: string
  ): Promise<void> => {
    const table = await DineInTables.findById(table_id);
    if (!table) {
      throw new Error("Table not found");
    }
    await DineInTables.updateMany(
      {
        id: table_id,
      },
      {
        meta_data: {
          ...table.meta_data,
          status: "Untouched",
          to_be_cleaned: false,
        },
        updated_at: new Date(),
      }
    );
  };
}
