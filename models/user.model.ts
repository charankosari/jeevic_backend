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
    is_email_verified: boolean;
    is_mobile_verified: boolean;
    created_at: Date;
    updated_at: Date;
}

const UserSchema = new Schema({
    email: String,
    country_code: String,
    phone_number: String,
    hash: String,
    salt: String,
    first_name: String,
    last_name: String,
    is_email_verified: Boolean,
    is_mobile_verified: Boolean,
    created_at: Date,
    updated_at: Date,
});

UserSchema.index.findByEmail = { by: 'email' };
UserSchema.index.findByPhoneNumber = { by: 'phone_number' };

const User = ottoman.model<IUser>('users', UserSchema);

export { User, type IUser };
