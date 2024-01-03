import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { TokenType } from 'src/types/token.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignUpDto } from 'src/dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }

    async validateUser(usernameOrEmail: string, password: string): Promise<Omit<User, "password"> | null> {
        try {
            const user = await this.userService.findUser(usernameOrEmail);
            if (user && await bcrypt.compare(password, user.password)) {
                const { password, ...data } = user;
                return data;
            }
            return null;
        } catch (err) {
            console.log(`error: ${err}`);
        }
    }

    async createToken(fullname: string, username: string, email: string): Promise<TokenType> {
        const [accessToken, refreshToken] = await Promise.all(
            [
                this.jwtService.signAsync(
                    {
                        fullname,
                        username,
                        email,
                    },
                    {
                        secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
                        expiresIn: "300s"
                    }
                ),
                this.jwtService.signAsync(
                    {
                        fullname,
                        username,
                        email,
                    },
                    {
                        secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
                        expiresIn: "1h"
                    }
                ),
            ]
        );

        return {
            accessToken,
            refreshToken
        }
    }

    async signIn(fullname: string, username: string, email: string): Promise<TokenType> {
        return await this.createToken(fullname, username, email);
    }

    async signUp(signUpDto: SignUpDto): Promise<TokenType> {
        const { username, email } = signUpDto;
        const userExistUsername = await this.userService.findUser(username);
        const userExistEmail = await this.userService.findUser(email);

        if (userExistUsername) {
            throw new ConflictException("Username Is Already Exist");
        }

        if (userExistEmail) {
            throw new ConflictException("Email Is Already Exist");
        }

        const user = await this.userService.createUser(signUpDto);
        return await this.createToken(user.fullName, user.username, user.email);
    }

    async refresh(fullname: string, username: string, email: string): Promise<TokenType>{
        return await this.createToken(fullname, username, email);
    }
}