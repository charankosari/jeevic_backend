import { EcomAdmin, type IEcomAdmin } from "../models/admin.model";

export class ecomAdminService {
  private static initializeAdminDocument = async () => {
    try {
      const { rows } = await EcomAdmin.find({}, { limit: 1 });
      if (rows.length === 0) {
        const newAdmin = new EcomAdmin({} as any);
        await newAdmin.save();
      }
      return true;
    } catch (error) {
      console.error("EcomAdmin initialization error:", error);
      throw new Error("Failed to initialize ecom admin document");
    }
  };

  public static readonly getAdminStats = async (recordsCount: number) => {
    try {
      await ecomAdminService.initializeAdminDocument();

      const adminStats = await EcomAdmin.findOne({});
      if (!adminStats) {
        return {
          dailyProfits: {},
          totalProfit: 0,
          salesOfProducts: {},
          salesOfCategories: {},
          salesOfSubCategories: {},
          revenueHistory: {},
        };
      }

      const getLastRecords = <T>(data: Record<string, T>) => {
        const sortedKeys = Object.keys(data || {}).sort((a, b) => {
          const [d1, m1, y1] = a.split("-").map(Number);
          const [d2, m2, y2] = b.split("-").map(Number);
          return (
            new Date(y2, m2 - 1, d2).getTime() -
            new Date(y1, m1 - 1, d1).getTime()
          );
        });
        return sortedKeys.slice(0, recordsCount).reduce(
          (acc, key) => {
            acc[key] = data[key];
            return acc;
          },
          {} as Record<string, T>
        );
      };

      const filteredDailyProfits = getLastRecords(adminStats.dailyProfits);
      const filteredRevenueHistory = getLastRecords(adminStats.revenueHistory);

      return {
        dailyProfits: filteredDailyProfits,
        totalProfit: Object.values(filteredDailyProfits).reduce(
          (sum, profit) => sum + profit,
          0
        ),
        salesOfProducts: { ...adminStats.salesOfProducts },
        salesOfCategories: { ...adminStats.salesOfCategories },
        salesOfSubCategories: { ...adminStats.salesOfSubCategories },
        revenueHistory: filteredRevenueHistory,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch ecom admin statistics"
      );
    }
  };
}
