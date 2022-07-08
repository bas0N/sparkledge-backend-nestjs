import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);

    if (!request.user?.isVerified) {
      throw new UnauthorizedException('Confirm your email first.');
    }

    return true;
  }
}
