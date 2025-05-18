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
      
    public static readonly getAdminStats = async (recordsCount: number) => {
        try {
            await adminService.initializeAdminDocument();
          
            const adminStats = await Admin.findOne({});
            if (!adminStats) {
                return {
                    dailyProfits: {},
                    totalProfit: 0,
                    salesOfProducts: {},
                    salesOfAllProducts: {},
                    peakHours: {},
                    revenueHistory: {}
                };
            }

            // Helper function to get the last 'recordsCount' records
            const getLastRecords = <T>(data: Record<string, T>) => {
                const sortedKeys = Object.keys(data || {}).sort((a, b) => {
                    const [d1, m1, y1] = a.split('-').map(Number);
                    const [d2, m2, y2] = b.split('-').map(Number);
                    return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
                });
                return sortedKeys.slice(0, recordsCount).reduce((acc, key) => {
                    acc[key] = data[key];
                    return acc;
                }, {} as Record<string, T>);
            };

            const filteredDailyProfits = getLastRecords(adminStats.dailyProfits);
            const filteredPeakHours = getLastRecords(adminStats.peakHours);
            const filteredDailyRevenue = getLastRecords(adminStats.revenueHistory);

            // Build the response with clear separation of records
            return {
                dailyProfits: filteredDailyProfits,
                totalProfit: Object.values(filteredDailyProfits).reduce((sum, profit) => sum + profit, 0),
                salesOfProducts: { ...adminStats.salesOfProducts },
                salesOfAllProducts: { ...adminStats.salesOfAllProducts },
                peakHours: filteredPeakHours,
                revenueHistory: 
                    getLastRecords(adminStats.revenueHistory),
                
            };

        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to fetch admin statistics');
        }
    };

}
 