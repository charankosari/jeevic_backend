import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface CBanner {
	id: string;
    image: string;
    created_at?: Date;
    updated_at?: Date;}

    interface EBanner {
        id: string;
        image: string;
        created_at?: Date;
        updated_at?: Date;}
const CafeBannerSchema = new Schema({
    id: String,
    image: String,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});
const EcomBannerSchema = new Schema({
    id: String,
    image: String,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

CafeBannerSchema.index.findByUserId = { by: 'user_id' };
EcomBannerSchema.index.findByUserId = { by: 'user_id' };

const CafeBanner = ottoman.model<CBanner>('CafeBanner', CafeBannerSchema);
const EcomBanner = ottoman.model<EBanner>('EcomBanner', EcomBannerSchema); // Corrected model name

export { CafeBanner, EcomBanner, type CBanner, type EBanner };
