import { sign } from "hono/jwt";

import { generateOTP } from "../helpers/otp";
import { CUser, type ICUser } from "../models/cafe.users.model";
import { config } from "../config/env";
import { twilioClient, twilioPhoneNumber } from "../libs/sms/twillo";

export class cafeUserService {
  public static readonly requestAccountAccess = async (
    country_code: string,
    phone_number: string
  ): Promise<{
    message: string;
  }> => {
    const requestedUser = await CUser.findOne({
      phone_number,
    }).catch(() => null);

    if (!requestedUser) {
      const otp = generateOTP();

      // create a new user
      await CUser.create({
        country_code,
        phone_number,
        phone_otp: otp,
        is_mobile_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await twilioClient.messages.create({
        to: `+${country_code}${phone_number}`,
        from: twilioPhoneNumber,
        body: `Hi,\nYour OTP for Jeevic is ${otp}.\n\nThanks,\nTeam Jeevic`,
      });

      return {
        message: "Account created successfully",
      };
    } else {
      const otp = generateOTP();

      // update the existing user
      await CUser.updateMany(
        {
          phone_number,
        },
        {
          phone_otp: otp,
          updated_at: new Date(),
        }
      );

      await twilioClient.messages.create({
        to: `+${country_code}${phone_number}`,
        from: twilioPhoneNumber,
        body: `Hi,\nYour OTP for Jeevic is ${otp}.\n\nThanks,\nTeam Jeevic`,
      });

      return {
        message: "Account access requested successfully",
      };
    }
  };

  public static readonly verifyAccountAccess = async (
    country_code: string,
    phone_number: string,
    otp: string
  ): Promise<{
    message: string;
    access_token?: string;
  }> => {
    const requestedUser = await CUser.findOne({
      country_code,
      phone_number,
      phone_otp: otp,
    }).catch(() => null);

    if (!requestedUser) {
      return {
        message: "Invalid OTP",
      };
    } else {
      // update the existing user
      await CUser.updateById(requestedUser.id, {
        is_mobile_verified: true,
        updated_at: new Date(),
      });

      // generate a JWT token
      const access_token = await sign(
        {
          sub: requestedUser.id,
          role: requestedUser.role,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
        },
        config.JWT_SECRET,
        "HS512"
      );

      return {
        message: "Account access verified successfully",
        access_token,
      };
    }
  };

  public static readonly getUser = async (user_id: string) => {
    const user = (await CUser.find({
      id: user_id,
    })) as {
      rows: ICUser[];
    };

    if (!user) {
      return null;
    }

    const { phone_otp, ...userData } = user.rows[0];

    return userData;
  };
  public static readonly getUsers = async () => {
    const users = await CUser.find({});
    const usersCount = users.rows ? users.rows.length : 0;
    
    // Remove phone_otp from each user
    const sanitizedUsers = users.rows.map(({ phone_otp, ...rest }: ICUser) => rest);
    
    return {
        users: {
            rows: sanitizedUsers,
            meta: users.meta
        },
        usersCount
    };
  }
}
