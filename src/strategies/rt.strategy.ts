import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayloadType } from "src/types/token-payload.type";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt-jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.REFRESH_TOKEN_SECRET,
        });
    }

    async validate(payload: TokenPayloadType): Promise<TokenPayloadType> {
        return {
            fullname: payload.fullname,
            username: payload.username,
            email: payload.email,
            iat: payload.iat,
            exp: payload.exp  
        }
    }
}