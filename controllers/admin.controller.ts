import { type Context } from "hono";
import { adminService } from "../services/admin.service";
import {
  DishCategory,
  type IDishCategory,
} from "../models/dish_category.model";
import { Dish, type IDish } from "../models/dish.model";
export class AdminController {
  public static readonly getUsers = async (c: Context) => {
    try {
      const { users, usersCount } = await adminService.getUsers();
      return c.json({
        success: true,
        data: {
          users,
          total: usersCount,
        },
      });
    } catch (error) {
      return c.json(
        {
          success: false,
          message:
            error instanceof Error ? error.message : "Failed to fetch users",
        },
        500
      );
    }
  };

  public static readonly getAdminStats = async (c: Context) => {
    try {
      // Ensure admin doc exists

      // Fetch raw stats for each window
      const stats7 = await adminService.getAdminStats(7);
      const stats30 = await adminService.getAdminStats(30);
      const stats90 = await adminService.getAdminStats(90);

      const currentDate = new Date();
      const dishCategories = await DishCategory.find({});
      const dishes = await Dish.find({});

      // Helper to filter an object by date-key range
      function filterRange<T>(data: Record<string, T>, days: number) {
        const start = new Date();
        start.setDate(currentDate.getDate() - days);
        const filteredData = Object.entries(data)
          .filter(([dateStr]) => {
            const [d, m, y] = dateStr.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            return dt >= start && dt <= currentDate;
          })
          .reduce(
            (acc, [k, v]) => {
              acc[k] = v;
              return acc;
            },
            {} as Record<string, T>
          );

        // Ensure the number of records does not exceed the specified days
        const sortedKeys = Object.keys(filteredData).sort((a, b) => {
          const [d1, m1, y1] = a.split("-").map(Number);
          const [d2, m2, y2] = b.split("-").map(Number);
          return (
            new Date(y2, m2 - 1, d2).getTime() -
            new Date(y1, m1 - 1, d1).getTime()
          );
        });

        return sortedKeys.slice(0, days).reduce(
          (acc, key) => {
            acc[key] = filteredData[key];
            return acc;
          },
          {} as Record<string, T>
        );
      }

      // Profit change % (unchanged)
      const profitPercentage = (() => {
        const todayKey = (() => {
          const d = currentDate.getDate();
          const m = currentDate.getMonth() + 1;
          const y = currentDate.getFullYear();
          return `${d}-${m}-${y}`;
        })();
        const daysKeys = Object.keys(stats7.dailyProfits).sort((a, b) => {
          const [d1, m1, y1] = a.split("-").map(Number);
          const [d2, m2, y2] = b.split("-").map(Number);
          return (
            new Date(y2, m2 - 1, d2).getTime() -
            new Date(y1, m1 - 1, d1).getTime()
          );
        });
        const [latest, prev] = daysKeys;
        const curr = stats7.dailyProfits[latest] ?? 0;
        const prevVal = stats7.dailyProfits[prev] ?? 0;
        if (prevVal === 0) return "0";
        return (((curr - prevVal) / prevVal) * 100).toFixed(2);
      })();

      // Transform salesOfProducts into array
      const salesOfProducts = Object.entries(stats7.salesOfProducts).map(
        ([catId, cnt]) => {
          const cat = dishCategories.rows.find(
            (c: IDishCategory) => c.id === catId
          );
          return { id: catId, name: cat?.name ?? "Unknown", count: cnt };
        }
      );

      // Transform salesOfAllProducts into array
      const salesOfAllProducts = Object.entries(stats7.salesOfAllProducts).map(
        ([catId, dishMap]) => {
          const cat = dishCategories.rows.find(
            (c: IDishCategory) => c.id === catId
          );
          return {
            category: { id: catId, name: cat?.name ?? "Unknown" },
            dishes: Object.entries(dishMap).map(([dishId, cnt]) => {
              const d = dishes.rows.find((x: IDish) => x.id === dishId);
              return { id: dishId, name: d?.name ?? "Unknown", count: cnt };
            }),
          };
        }
      );
      // Build the response
      return c.json({
        success: true,
        data: {
          date: currentDate.toLocaleDateString("en-GB").split("/").join("-"),
          dailyProfits: stats7.dailyProfits,
          totalProfit: stats7.totalProfit,
          profitPercentage,
          salesOfProducts,
          salesOfAllProducts,

          // **Structured windows:**
          peakHours: {
            sevenDays: filterRange(stats7.peakHours, 7),
            thirtyDays: filterRange(stats30.peakHours, 30),
            ninetyDays: filterRange(stats90.peakHours, 90),
          },
          // AFTER — take the service’s already-filtered windows directly
          revenueHistory: {
            sevenDays: filterRange(stats7.revenueHistory, 7),
            thirtyDays: filterRange(stats30.revenueHistory, 30),
            ninetyDays: filterRange(stats90.revenueHistory, 90),
          },
        },
      });
    } catch (err) {
      return c.json(
        {
          success: false,
          message:
            err instanceof Error
              ? err.message
              : "Failed to fetch admin statistics",
        },
        500
      );
    }
  };
}
