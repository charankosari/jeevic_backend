import { GiftOptions, type IGiftOptions } from "../models/giftoptions.model"

export class GiftOptionsService {
    public static readonly getGiftOptions = async () : Promise<IGiftOptions[]>=> {
        return await GiftOptions.find({}).then((giftOptions) => {
            return giftOptions.rows;
        });
    }

    public static readonly getGiftOptionById = async (
        giftoption_id: string,
    ) : Promise<IGiftOptions | null>=> {
        return await GiftOptions
            .find({
                id: giftoption_id,
            })
            .then((giftOption) => {
                return giftOption.rows[0] || null;
            });
    }

    public static readonly createGiftOption = async (
        {
            name,
            image_url,
            description,
            price,
            products,
            meta_data,
            is_active,
        }: {
            name: string;
            image_url: string[];
            description: string;
            price: number;
            products: string[];
            meta_data: Record<string, string>;
            is_active: boolean;
        }
    ) : Promise<string>=> {
        const data = await GiftOptions.create({
            name,
            image_url,
            description,
            price,
            products,
            meta_data,
            is_active,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly updateGiftOption = async (
        giftoption_id: string,
        {
            name,
            image_url,
            description,
            price,
            products,
            meta_data,
            is_active,
        }: {
            name: string;
            image_url: string[];
            description: string;
            price: number;
            products: string[];
            meta_data: Record<string, string>;
            is_active: boolean;
        }
    ) : Promise<void>=> {
        await GiftOptions.updateMany({
            id: giftoption_id,
        }, {
            name,
            image_url,
            description,
            price,
            products,
            meta_data,
            is_active,
            updated_at: new Date(),
        });
    }

    public static readonly deleteGiftOption = async (
        giftoption_id: string,
    ) : Promise<void>=> {
        await GiftOptions.removeById(giftoption_id);
    }
}
