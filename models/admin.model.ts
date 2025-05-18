import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IAdmin {
    id: string;
    dailyProfits: Record<string, number>;
    totalProfit: number;
    salesOfProducts: Record<string, number>;
    salesOfAllProducts: {
        [category: string]: {
            [itemName: string]: number;
        };
    };
    peakHours: {
        [date: string]: {
            [hour: string]: number
        }
    };
    revenueHistory: Record<string, number>;
    created_at: Date;
    updated_at: Date;
}

const AdminSchema = new Schema({
    dailyProfits: {
        type: Object,
        default: {}
    },
    totalProfit: {
        type: Number,
        default: 0
    },
    salesOfProducts: {
        type: Object,
        default: {}
    },
    salesOfAllProducts: {
        type: Object,
        default: {} 
    },
    peakHours: {
        type: Object,
        default: {}
    },
    revenueHistory: {
        type: Object,
        default: {}
    },
    created_at: { 
        type: Date, 
        default: () => new Date() 
    },
    updated_at: { 
        type: Date, 
        default: () => new Date() 
    }
});

const Admin = ottoman.model<IAdmin>('admin', AdminSchema);

export { Admin, type IAdmin };