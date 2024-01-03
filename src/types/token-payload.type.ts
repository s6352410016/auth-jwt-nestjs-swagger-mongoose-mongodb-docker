import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadType{
    @ApiProperty()
    fullname: string;

    @ApiProperty()
    username: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    iat: number;

    @ApiProperty()
    exp: number;
}