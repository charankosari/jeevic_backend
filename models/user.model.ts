import { Schema } from 'ottoman';
import { ottoman } from '../config/ottoman';

interface IUser {
	id: string;
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone_number: string;
    profile_picture: string;
    points: number;
    phone_otp: string;
    email_otp: string;
    role: string;
    employeeid?: string;
    is_email_verified: boolean;
    is_mobile_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    country_code: String,
    phone_number: String,
    profile_picture: String,
    points: { type: Number, default: 0 },
    phone_otp: String,
    email_otp: String,
    employeeid: String,
    role: { type: String, default: 'user' },
    is_email_verified: { type: Boolean, default: false },
    is_mobile_verified: { type: Boolean, default: false },
    created_at: { type: Date, default: () => new Date() },
    updated_at: { type: Date, default: () => new Date() },
});

UserSchema.index.findByEmail = { by: 'email' };
UserSchema.index.findByPhoneNumber = { by: 'phone_number' };

const User = ottoman.model<IUser>('users', UserSchema);

export { User, type IUser };
