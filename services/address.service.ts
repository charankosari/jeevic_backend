import { Address, type IAddress } from '../models/address.model';

export class AddressService {
    public static readonly createAddress = async (
        user_id: string,
        country: string,
        address_line_1: string,
        address_line_2: string,
        postcode: string,
        phone_number: string,
    ) : Promise<string>=> {
        const data = await Address.create({
            user_id,
            country,
            address_line_1,
            address_line_2,
            postcode,
            phone_number,
            is_default: false,
            created_at: new Date(),
            updated_at: new Date(),
        });

        return data.id
    };

    public static readonly updateAddress = async (
        user_id: string,
        address_id: string,
        country: string,
        address_line_1: string,
        address_line_2: string,
        postcode: string,
        phone_number: string,
    ) : Promise<void>=> {
        await Address.updateMany({
            id: address_id,
            user_id,
        }, {
            country,
            address_line_1,
            address_line_2,
            postcode,
            phone_number,
            updated_at: new Date(),
        });
    };

    public static readonly deleteAddress = async (
        user_id: string,
        address_id: string,
    ) : Promise<void>=> {
        await Address.removeMany({
            id: address_id,
            user_id,
        });
    }

    public static readonly setDefaultAddress = async (
        user_id: string,
        address_id: string,
    ) : Promise<void>=> {
        await Address.updateMany({
            user_id,
        }, {
            is_default: false,
        });

        await Address.updateMany({
            id: address_id,
            user_id,
        }, {
            is_default: true,
        });
    }

    public static readonly getAddresses = async (
        user_id: string,
    ) : Promise<IAddress[]>=> {
        return await Address.find({
            user_id,
        }).then((addresses) => {
            return addresses.rows;
        });
    }

    public static readonly getAddress = async (
        user_id: string,
        address_id: string,
    ) : Promise<IAddress | null>=> {
        return await Address.findOne({
            id: address_id,
            user_id,
        }).catch(() => null);
    }
}