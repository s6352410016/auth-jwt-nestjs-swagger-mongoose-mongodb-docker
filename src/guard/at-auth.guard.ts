import { AuthGuard } from "@nestjs/passport";

export class AtAuthGuard extends AuthGuard('at-jwt'){}