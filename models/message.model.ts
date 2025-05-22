import {  Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';
interface IMessage {
    id: string;
    message: string;
    email: string;
    name?: string;
    is_read: boolean;
    created_at:Date;
    updated_at:Date;
  }

const MessageSchema = new Schema({
    id: String,
    message: String,
    email:String,
    name:String,
    is_read:Boolean,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});


const Message = ottoman.model<IMessage>('messages', MessageSchema);

export { Message, type IMessage };
