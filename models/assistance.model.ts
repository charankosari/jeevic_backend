import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IAssistance {
  id: string;
  table_number: string;
  user_id: string;
  created_at: Date;
}

const AssistanceSchema = new Schema({
  table_number: String,
  user_id: String,
  created_at: { type: Date, default: () => new Date() },
});

const Assistance = ottoman.model<IAssistance>('assistance', AssistanceSchema);

export { Assistance, type IAssistance };