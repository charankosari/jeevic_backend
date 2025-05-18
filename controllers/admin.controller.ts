import { type Context } from 'hono';
import { adminService } from "../services/admin.service";
import {DishCategory, type IDishCategory } from '../models/dish_category.model';
import {Dish, type IDish } from '../models/dish.model';
export class AdminController {  
    public static readonly getUsers = async (c: Context) => { 
        try {
            const { users, usersCount } = await adminService.getUsers();
            return c.json({
                success: true,
                data: {
                    users,
                    total: usersCount
                }
            });
        } catch (error) {
            return c.json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to fetch users"
            }, 500);
        }
    }
    
    public static readonly getAdminStats = async (c: Context) => {
      try {
          const { range = '7' } = c.req.query();
          const daysRange = parseInt(range);

          const stats = await adminService.getAdminStats(daysRange);
          const currentDate = new Date();

          // Fetch categories and dishes
          const dishCategories = await DishCategory.find({});
          const dishes = await Dish.find({});

          // Transform salesOfProducts into array
          const transformedSalesOfProducts = Object.entries(stats.salesOfProducts).map(([categoryId, count]) => {
              const category = dishCategories.rows.find((cat: IDishCategory) => cat.id === categoryId);
              return {
                  id: categoryId,
                  name: category?.name || 'Unknown Category',
                  count
              };
          });

          // Transform salesOfAllProducts into array
          const transformedSalesOfAllProducts = Object.entries(stats.salesOfAllProducts).map(([categoryId, dishData]) => {
              const category = dishCategories.rows.find((cat: IDishCategory) => cat.id === categoryId);
              return {
                  category: {
                      id: categoryId,
                      name: category?.name || 'Unknown Category'
                  },
                  dishes: Object.entries(dishData).map(([dishId, count]) => {
                      const dish = dishes.rows.find((d: IDish) => d.id === dishId);
                      return {
                          id: dishId,
                          name: dish?.name || 'Unknown Dish',
                          count
                      };
                  })
              };
          });

          // Helper function to filter dates within range
          const filterDateRange = (data: Record<string, any>, days: number) => {
              const startDate = new Date();
              startDate.setDate(currentDate.getDate() - days);
              
              return Object.entries(data)
                  .filter(([date]) => {
                      const [day, month, year] = date.split('-').map(Number);
                      const dateObj = new Date(year, month - 1, day);
                      return dateObj >= startDate && dateObj <= currentDate;
                  })
                  .reduce((acc, [date, value]) => {
                      acc[date] = value;
                      return acc;
                  }, {} as Record<string, any>);
          };

          return c.json({
              success: true,
              data: {
                  date: currentDate.toLocaleDateString('en-GB').split('/').join('-'),
                  dailyProfits: stats.dailyProfits,
                  totalProfit: stats.totalProfit,
                  salesOfProducts: transformedSalesOfProducts,
                  salesOfAllProducts: transformedSalesOfAllProducts,
                  peakHours: {
                      sevenDays: filterDateRange(stats.peakHours, 7),
                      thirtyDays: filterDateRange(stats.peakHours, 30),
                      ninetyDays: filterDateRange(stats.peakHours, 90)
                  },
                  revenueHistory: {
                      sevenDays: filterDateRange(stats.revenueHistory, 7),
                      thirtyDays: filterDateRange(stats.revenueHistory, 30),
                      ninetyDays: filterDateRange(stats.revenueHistory, 90)
                  }
              }
          });
      } catch (error) {
          return c.json({
              success: false,
              message: error instanceof Error ? error.message : "Failed to fetch admin statistics"
          }, 500);
      }
  }

}
