import { User } from '@prisma/client';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private readonly userService;
    constructor(userService: UsersService);
    validate(validationPayload: {
        id: string;
        email: string;
        isVerified: string;
        role: string;
    }): Promise<User | null>;
}
export {};
