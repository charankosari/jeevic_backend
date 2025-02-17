import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface ICoupon {
	id: string;
    code: string;
    is_one_time: boolean;
    expires_on: Date;
    no_of_uses: number;
    meta_data: Record<string, string>;
    created_at: Date;
    updated_at: Date;
}

const CouponSchema = new Schema({
    code: String,
    is_one_time: Boolean,
    expires_on: Date,
    no_of_uses: Number,
    meta_data: Object,
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

CouponSchema.index.findByCode = { by: 'code' };

const Coupon = ottoman.model<ICoupon>('coupons', CouponSchema);

export { Coupon, type ICoupon };
