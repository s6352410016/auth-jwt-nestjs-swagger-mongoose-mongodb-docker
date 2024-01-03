import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth/auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'usernameOrEmail',
            passwordField: 'password',
        });
    }

    async validate(username: string, password: string): Promise<Omit<User, "password">> {
        const user = await this.authService.validateUser(username, password);
        if (!user) {
            throw new UnauthorizedException("Invalid Credential");
        }
        return user;
    }
}