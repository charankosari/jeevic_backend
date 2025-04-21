import { type Context } from 'hono';

import { AddressService } from '../services/address.service';

export class AddressController {
    public static readonly createAddress = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const { country, address_line_1, address_line_2, postcode, phone_number } = await ctx.req.json();

            const response = await AddressService.createAddress(
                user_id,
                country,
                address_line_1,
                address_line_2,
                postcode,
                phone_number,
            );

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly updateAddress = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const { address_id } = ctx.req.param();

            const { country, address_line_1, address_line_2, postcode, phone_number } = await ctx.req.json();

            await AddressService.updateAddress(
                user_id,
                address_id,
                country,
                address_line_1,
                address_line_2,
                postcode,
                phone_number,
            );

            return ctx.json({
                message: 'Address updated successfully!',
            });
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly deleteAddress = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const { address_id } = ctx.req.param();

            await AddressService.deleteAddress(
                user_id,
                address_id,
            );

            return ctx.json({
                message: 'Address deleted successfully!',
            });
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getAddresses = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const response = await AddressService.getAddresses(
                user_id,
            );

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly setDefaultAddress = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const { address_id } = ctx.req.param();

            await AddressService.setDefaultAddress(
                user_id,
                address_id,
            );

            return ctx.json({
                message: 'Default address set successfully!',
            });
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };

    public static readonly getAddress = async (ctx: Context) => {
        try {
            const user_id = ctx.get('user_id');

            const { address_id } = ctx.req.param();

            const response = await AddressService.getAddress(
                user_id,
                address_id,
            );

            return ctx.json(response);
        }
        catch(error) {
            if (error instanceof Error) {
                return ctx.json({
                    message: error.message,
                }, 400);
            }
        }
    };
}
