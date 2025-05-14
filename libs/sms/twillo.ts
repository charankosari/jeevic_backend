import twilio from "twilio"

import { config } from '../../config/env';

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = config.TWILIO_ACCOUNT_SID
const authToken = config.TWILIO_AUTH_TOKEN

export const twilioClient = twilio(accountSid, authToken)
export const twilioPhoneNumber = config.TWILIO_PHONE_NUMBER
