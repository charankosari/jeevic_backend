import { v4 as uuidv4 } from 'uuid'; // Import UUID library for generating unique IDs
import { Assistance, type IAssistance } from '../models/assistance.model';
export class AssistanceService {
  public static async createAssistance(data: { table_number: string; user_id: string }) {
    const assistanceData = {
      id: uuidv4(), // Generate a unique ID
      ...data,
      created_at: new Date(), // Set the current date and time
    };

    const assistance = new Assistance(assistanceData);
    await assistance.save();
    return assistance;
  }

  public static async getAllAssistance(): Promise<IAssistance[]> {
    const result = await Assistance.find({});
    return result.rows; // Ensure that you return the rows from the query result
  }

  public static async deleteAssistance(id: string) {
    return Assistance.removeById(id);
  }
}