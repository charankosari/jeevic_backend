import { type Context } from 'hono';
import { AssistanceService } from '../services/assistance.service';
import { Assistance, type IAssistance } from '../models/assistance.model';
export class AssistanceController {
  public static readonly createAssistance = async (ctx: Context) => {
    try {
      const user_id = ctx.get('user_id');
      const { table_number } = await ctx.req.json();

      // Fetch all assistance requests
      const assistanceList = await AssistanceService.getAllAssistance();

      // Check if an assistance request already exists for the table_number
      const existingAssistance = assistanceList.find((assistance: IAssistance) => assistance.table_number === table_number);
      if (existingAssistance) {
        return ctx.json({ success: false, message: 'You have already requested the assistance' }, 200); // Changed to 200 OK
      }

      const assistance = await AssistanceService.createAssistance({ table_number, user_id });
      return ctx.json({ success: true, data: assistance });
    } catch (error) {
      return ctx.json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' }, 500);
    }
  };
 
  public static readonly getAllAssistance = async (ctx: Context) => {
    try {
      const assistanceList = await AssistanceService.getAllAssistance();
      return ctx.json({ success: true, data: assistanceList }); // Directly use assistanceList
    } catch (error) {
      return ctx.json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' }, 500);
    }
  };



  public static readonly deleteAssistance = async (ctx: Context) => {
    try {
      const { id } = ctx.req.param();
      await AssistanceService.deleteAssistance(id);
      return ctx.json({ success: true, message: 'Assistance deleted successfully' });
    } catch (error) {
      return ctx.json({ success: false, message: error instanceof Error ? error.message : 'An error occurred' }, 500);
    }
  };
}