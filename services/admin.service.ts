import { User, type IUser } from '../models/user.model';

export class UserService {
    public static readonly getUsers = async () => {
        const users = await User.find({});
        const usersCount = users.length;
        
        return {
            users, 
            usersCount
        };
    }
}
 