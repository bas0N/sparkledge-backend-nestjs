import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class EmailVerificationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
