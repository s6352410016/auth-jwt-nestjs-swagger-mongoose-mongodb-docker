import { ApiProperty } from '@nestjs/swagger';

export class TokenType{
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;
}