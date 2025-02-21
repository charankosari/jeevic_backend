import { Coupon, type ICoupon } from "../models/coupon.model";

export class CouponService {
    public static readonly getCoupons = async () : Promise<ICoupon[]>=> {
        return await Coupon.find({}).then((coupons) => {
            return coupons.rows;
        });
    }

    public static readonly getCouponById = async (
        coupon_id: string,
    ) : Promise<ICoupon | null>=> {
        return await Coupon
            .find({
                id: coupon_id,
            })
            .then((coupon) => {
                return coupon.rows[0] || null;
            });
    }

    public static readonly createCoupon = async (
        {
            code,
            expires_on,
            is_one_time,
            meta_data,
            no_of_uses
        }: {
            code: string;
            expires_on: Date;
            is_one_time: boolean;
            meta_data: Record<string, string>;
            no_of_uses: number;
        }
    ) : Promise<string>=> {
        const data = await Coupon.create({
            code,
            expires_on,
            is_one_time,
            meta_data,
            no_of_uses,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly updateCoupon = async (
        coupon_id: string,
        {
            code,
            expires_on,
            is_one_time,
            meta_data,
            no_of_uses,
        }: {
            code: string;
            expires_on: Date;
            is_one_time: boolean;
            meta_data: Record<string, string>;
            no_of_uses: number;
        }
    ) : Promise<void>=> {
        await Coupon.updateMany({
            id: coupon_id,
        }, {
            code,
            expires_on,
            is_one_time,
            meta_data,
            no_of_uses,
            updated_at: new Date(),
        });
    }

    public static readonly deleteCoupon = async (
        coupon_id: string,
    ) : Promise<void>=> {
        await Coupon.removeMany({
            id: coupon_id,
        });
    }

    public static readonly applyCoupon = async (
        coupon_id: string,
    ) : Promise<void>=> {
        const coupon = await Coupon.find({
            id: coupon_id,
        }).then((coupon) => {
            return coupon.rows[0];
        });

        await Coupon.updateMany({
            id: coupon_id,
        }, {
            no_of_uses: coupon.no_of_uses - 1,
            updated_at: new Date(),
        });   
    }

    public static readonly getCouponByCode = async (
        code: string,
    ) : Promise<ICoupon | null>=> {
        return await Coupon
            .find({
                code,
            })
            .then((coupon) => {
                return coupon.rows[0] || null;
            });
    }
}
