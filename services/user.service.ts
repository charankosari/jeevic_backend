import { sign } from "hono/jwt";

import { generateOTP } from "../helpers/otp";
import { User, type IUser } from "../models/user.model";
import { config } from "../config/env";
// import { twilioClient, twilioPhoneNumber } from "../libs/sms/twillo";
import { sendOtp } from "../libs/sms/renflair";

export class UserService {
  public static readonly requestAccountAccess = async (
    country_code: string,
    phone_number: string
  ): Promise<{
    message: string;
  }> => {
    const requestedUser = await User.findOne({
      phone_number,
    }).catch(() => null);

    if (!requestedUser) {
      const otp = generateOTP();

      // create a new user
      await User.create({
        country_code,
        phone_number,
        points: 0,
        phone_otp: otp,
        is_email_verified: false,
        is_mobile_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // await twilioClient.messages.create({
      //   to: `+${country_code}${phone_number}`,
      //   from: twilioPhoneNumber,
      //   body: `Hi,\nYour OTP for Jeevic is ${otp}.\n\nThanks,\nTeam Jeevic`,
      // });
      await sendOtp(phone_number, otp);
      return {
        message: "Account created successfully",
      };
    } else {
      const otp = generateOTP();

      // update the existing user
      await User.updateMany(
        {
          phone_number,
        },
        {
          phone_otp: otp,
          updated_at: new Date(),
        }
      );

      // await twilioClient.messages.create({
      //   to: `+${country_code}${phone_number}`,
      //   from: twilioPhoneNumber,
      //   body: `Hi,\nYour OTP for Jeevic is ${otp}.\n\nThanks,\nTeam Jeevic`,
      // });
      await sendOtp(phone_number, otp);
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
    const requestedUser = await User.findOne({
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
      await User.updateById(requestedUser.id, {
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
    const user = (await User.find({
      id: user_id,
    })) as {
      rows: IUser[];
    };

    if (!user) {
      return null;
    }

    const { phone_otp, email_otp, ...userData } = user.rows[0];

    return userData;
  };

  public static readonly updateUser = async (
    user_id: string,
    data: Record<string, string | number | boolean>
  ) => {
    await User.updateById(user_id, {
      ...data,
      updated_at: new Date(),
    });

    return {
      message: "User updated successfully",
    };
  };

  public static readonly setEmailForVerification = async (
    user_id: string,
    email: string
  ) => {
    const otp = generateOTP();

    await User.updateById(user_id, {
      email,
      email_otp: otp,
      updated_at: new Date(),
    });

    // TODO: Send OTP to the user's email

    return {
      message: "Email verification initiated successfully",
    };
  };

  public static readonly verifyEmail = async (user_id: string, otp: string) => {
    const requestedUser = await User.findOne({
      id: user_id,
      email_otp: otp,
    }).catch(() => null);

    if (!requestedUser) {
      return {
        message: "Invalid OTP",
      };
    } else {
      // update the existing user
      await User.updateById(requestedUser.id, {
        is_email_verified: true,
        updated_at: new Date(),
      });
    }

    return {
      message: "Email verified successfully",
    };
  };
  public static readonly getAllUsers = async () => {
    const users = await User.find({});

    return users;
  };
}
