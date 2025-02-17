import { GiftCard, type IGiftCard } from '../models/giftcard.model';

export class GiftCardService {
    public static readonly getGiftCards = async () : Promise<IGiftCard[]>=> {
        return await GiftCard.find({}).then((giftCards) => {
            return giftCards.rows;
        });
    }

    public static readonly getGiftCardById = async (
        giftcard_id: string,
    ) : Promise<IGiftCard | null>=> {
        return await GiftCard
            .find({
                id: giftcard_id,
            })
            .then((giftCard) => {
                return giftCard.rows[0] || null;
            });
    }

    public static readonly createGiftCard = async (
        {
            code,
            expires_on,
            meta_data
        }: {
            code: string;
            expires_on: Date;
            meta_data: Record<string, any>;
        }
    ) : Promise<string>=> {
        const data = await GiftCard.create({
            code,
            expires_on,
            meta_data,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id;
    }

    public static readonly updateGiftCard = async (
        giftcard_id: string,
        {
            code,
            expires_on,
            meta_data
        }: {
            code: string;
            expires_on: Date;
            meta_data: Record<string, any>;
        }
    ) : Promise<void>=> {
        await GiftCard.updateMany({
            id: giftcard_id,
        }, {
            code,
            meta_data,
            expires_on,
            updated_at: new Date(),
        });
    }

    public static readonly deleteGiftCard = async (
        giftcard_id: string,
    ) : Promise<void>=> {
        await GiftCard.removeMany({
            id: giftcard_id,
        });
    }
}
