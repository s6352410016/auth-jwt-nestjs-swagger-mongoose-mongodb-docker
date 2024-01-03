import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/dto/signup.dto';
import { User } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>
    ) { }

    async findUser(usernameOrEmail: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({
                $or: [
                    { username: usernameOrEmail },
                    { email: usernameOrEmail },
                ]
            }).lean();
            return user;
        } catch (err) {
            console.log(`error: ${err}`);
        }
    }

    async createUser(signUpDto: SignUpDto): Promise<User> {
        const { fullName, username, password, email } = signUpDto;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new this.userModel({
            fullName,
            username,
            password: hashPassword,
            email: email
        });
        return await user.save();
    }
}
