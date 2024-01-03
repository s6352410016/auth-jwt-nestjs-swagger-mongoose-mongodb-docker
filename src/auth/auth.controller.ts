import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TokenType } from 'src/types/token.type';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { ApiBody, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SignUpDto } from 'src/dto/signup.dto';
import { SignInDto } from 'src/dto/signin.dto';
import { TokenPayloadType } from 'src/types/token-payload.type';
import { AtAuthGuard } from 'src/guard/at-auth.guard';
import { Request } from 'express';
import { RtAuthGuard } from 'src/guard/rt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @ApiBody({ type: SignInDto })
    @ApiOkResponse({ type: TokenType })
    @UseGuards(LocalAuthGuard)
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signIn(@Req() req: Request): Promise<TokenType> {
        return this.authService.signIn(req.user['fullName'], req.user['username'], req.user['email']);
    }

    @ApiCreatedResponse({ type: TokenType })
    @Post('signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<TokenType> {
        return this.authService.signUp(signUpDto);
    }

    @ApiBearerAuth()
    @UseGuards(AtAuthGuard)
    @ApiOkResponse({ type: TokenPayloadType })
    @Get('profile')
    getProfile(@Req() req: Request): TokenPayloadType {
        return {
            fullname: req.user['fullname'],
            username: req.user['username'],
            email: req.user['email'],
            iat: req.user['iat'],
            exp: req.user['exp']
        }
    }

    @ApiBearerAuth()
    @UseGuards(RtAuthGuard)
    @ApiOkResponse({ type: TokenType })
    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    refresh(@Req() req: Request): Promise<TokenType> {
        return this.authService.refresh(req.user['fullname'], req.user['username'], req.user['email']);
    }
}
