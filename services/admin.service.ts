import { User, type IUser } from '../models/user.model';
import { Admin, type IAdmin } from '../models/admin.model';
import { v4 as uuidv4 } from 'uuid';
export class adminService {
    public static readonly getUsers = async () => {
        const users = await User.find({});
        const usersCount = users.length;
        
        return {
            users, 
            usersCount
        };
    }
    private static initializeAdminDocument = async () => {
        try {
          // Try fetching any existing Admin doc
          const { rows } = await Admin.find({}, { limit: 1 });
          if (rows.length === 0) {
            // None found → create one
            const newAdmin = new Admin({} as any);
            await newAdmin.save();
          }
          return true;
        } catch (error) {
          console.error('Admin initialization error:', error);
          throw new Error('Failed to initialize admin document');
        }
      };
      
    public static readonly getAdminStats = async (daysRange: number) => {
        try {
            await adminService.initializeAdminDocument();
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - daysRange);
          
            const adminStats = await Admin.findOne({});
            if (!adminStats) {
                return {
                    dailyProfits: {},
                    totalProfit: 0,
                    salesOfProducts: {},
                    salesOfAllProducts: {}, // Empty object for categories and their items
                    peakHours: {},
                    revenueHistory: {}
                };
            }

            // Filter data for the requested date range
            const filteredDailyProfits = Object.entries(adminStats.dailyProfits)
                .filter(([date]) => {
                    const [day, month, year] = date.split('-').map(Number);
                    const dateObj = new Date(year, month - 1, day);
                    return dateObj >= startDate && dateObj <= endDate;
                })
                .reduce((acc, [date, amount]) => {
                    acc[date] = amount;
                    return acc;
                }, {} as Record<string, number>);

            const filteredPeakHours = Object.entries(adminStats.peakHours)
                .filter(([date]) => {
                    const [day, month, year] = date.split('-').map(Number);
                    const dateObj = new Date(year, month - 1, day);
                    return dateObj >= startDate && dateObj <= endDate;
                })
                .reduce((acc, [date, hours]) => {
                    acc[date] = hours;
                    return acc;
                }, {} as Record<string, string[]>);

            return {
                dailyProfits: filteredDailyProfits,
                totalProfit: adminStats.totalProfit,
                salesOfProducts: adminStats.salesOfProducts,
                salesOfAllProducts: adminStats.salesOfAllProducts, // Added this line
                peakHours: filteredPeakHours,
                revenueHistory: filteredDailyProfits
            };

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin statistics');
        }
    };

}
 