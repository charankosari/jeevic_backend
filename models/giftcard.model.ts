import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IGiftCard {
	id: string;
    code: string;
    expires_on: Date;
    meta_data: Record<string, string>;
    created_at: Date;
    updated_at: Date;
}

const GiftCardSchema = new Schema({
    code: String,
    expires_on: Date,
    meta_data: Object,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

GiftCardSchema.index.findByCode = { by: 'code' };

const GiftCard = ottoman.model<IGiftCard>('gift_cards', GiftCardSchema);

export { GiftCard, type IGiftCard };
