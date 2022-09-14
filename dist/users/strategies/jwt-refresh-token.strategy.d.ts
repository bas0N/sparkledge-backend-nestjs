import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../users.service';
import { JwtPayload } from '../jwt-payload.interface';
declare const JwtRefreshTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshTokenStrategy extends JwtRefreshTokenStrategy_base {
    private readonly userService;
    constructor(userService: UsersService);
    validate(request: Request, payload: JwtPayload): Promise<import(".prisma/client").User>;
    refresh(): Promise<void>;
}
export {};
