import { config } from "../../config/env";
import axios from "axios";

/**
 * Send OTP using Renflair API
 * @param {string} phone - Phone number to send OTP to
 * @param {string} otp - OTP value to send
 * @returns {Promise<Object>} Response data from API
 */

interface OtpResponse {
  return: boolean;
  request_id: string;
  message: string;
  status: string;
}

interface SendOtpResult {
  success: boolean;
  message: string;
  data: OtpResponse | null;
}
export async function sendOtp(
  phone: string,
  otp: string
): Promise<SendOtpResult> {
  const renflairUrl = config.RENFLAIR_URL;
  const apiKey = config.RENFLAIR_API;

  if (!renflairUrl || !apiKey) {
    throw new Error("Missing Renflair URL or API key in config.");
  }

  const apiUrl = `${renflairUrl}?API=${apiKey}&PHONE=${phone}&OTP=${otp}`;

  try {
    const response = await axios.get<OtpResponse>(apiUrl);

    if (response.data.status === "SUCCESS") {
      return {
        success: true,
        message: "OTP sent successfully.",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to send OTP.",
        data: response.data,
      };
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Axios specific error
      return {
        success: false,
        message: error.response?.data?.message || error.message,
        data: null,
      };
    } else if (error instanceof Error) {
      // Generic JS Error
      return {
        success: false,
        message: error.message,
        data: null,
      };
    } else {
      // Unknown error type
      return {
        success: false,
        message: "An unexpected error occurred.",
        data: null,
      };
    }
  }
}
