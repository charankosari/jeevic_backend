import { type Context } from 'hono';
import { UserService } from "../services/admin.service";

class AdminController {
  async getUsers(c: Context) {
    try {
      const { users, usersCount } = await UserService.getUsers();
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
}

export const adminController = new AdminController();