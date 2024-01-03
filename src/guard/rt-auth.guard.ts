import { AuthGuard } from "@nestjs/passport";

export class RtAuthGuard extends AuthGuard('rt-jwt'){}