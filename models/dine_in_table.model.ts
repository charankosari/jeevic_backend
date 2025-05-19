import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';
interface TableMetaData {
    status: string;
    to_be_cleaned: boolean;
}
interface IDineInTables {
    id: string;
    table_number: string;
    is_available: boolean;
    capacity: number;
    meta_data: TableMetaData;
    created_at: Date;
    updated_at: Date;
}

const DineInTablesSchema = new Schema({
    table_number: String,
    is_available: Boolean,
    capacity: Number,
    meta_data: Object,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

DineInTablesSchema.index.findByTableNumber = { by: 'table_number' };

const DineInTables = ottoman.model<IDineInTables>('dine_in_tables', DineInTablesSchema);

export { DineInTables, type IDineInTables };
