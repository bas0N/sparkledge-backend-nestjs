import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import { GoogleAuthenticateDto } from './dto/GoogleAuthenticate.dto';
export declare class AuthenticationService {
    private readonly prismaService;
    private readonly jwtService;
    private readonly emailService;
    private readonly userService;
    constructor(prismaService: PrismaService, jwtService: JwtService, emailService: EmailService, userService: UsersService);
    resendVerificationLink(email: string): Promise<void>;
    sendVerificationLink(email: string): Promise<any>;
    validateEmailWithToken(token: string): Promise<void>;
    decodeInformationToken(token: string): Promise<any>;
    confirmEmail(email: string): Promise<void>;
    googleAuthenticate({ token }: GoogleAuthenticateDto): Promise<InternalServerErrorException | {
        accessToken: string;
        refreshToken: string;
    }>;
    googleRedirect(req: any): Promise<InternalServerErrorException | {
        accessToken: string;
        refreshToken: string;
    }>;
}
