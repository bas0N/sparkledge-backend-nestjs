import { User } from '@prisma/client';
import { AuthenticationService } from './authentication.service';
import { GoogleAuthenticateDto } from './dto/googleAuthenticate.dto';
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    googleAuthenticate(googleAuthDto: GoogleAuthenticateDto): Promise<import("@nestjs/common").InternalServerErrorException | {
        accessToken: string;
        refreshToken: string;
    }>;
    validateEmailWithToken(token: string): Promise<void>;
    resendVerificationLink(user: User): Promise<void>;
    googleAuth(req: any): Promise<void>;
    googleRedirect(req: any): Promise<import("@nestjs/common").InternalServerErrorException | {
        accessToken: string;
        refreshToken: string;
    }>;
}
