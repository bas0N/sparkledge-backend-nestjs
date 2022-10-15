import { SigninUserDto } from './dto/signinUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { DocumentDto } from 'src/documents/dto/Document.dto';
import { EmailService } from 'src/email/email.service';
export declare class UsersService {
    private readonly prismaService;
    private jwtService;
    private readonly emailService;
    constructor(prismaService: PrismaService, jwtService: JwtService, emailService: EmailService);
    resetPassword(email: string, token: string, newPassword: string): Promise<User>;
    sendForgotPasswordLink(email: string): Promise<any>;
    addNewUser({ email, password, firstName, lastName, }: CreateUserDto): Promise<User>;
    signInUser(signinUserDto: SigninUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    logout(userEmail: string): Promise<void>;
    getJwtAccessToken(payload: JwtPayload): Promise<string>;
    getJwtRefreshToken(payload: JwtPayload): Promise<string>;
    getViewedDocuments(user: User): Promise<DocumentDto[]>;
    getPublishedDocuments(user: User): Promise<DocumentDto[]>;
    setCurrentRefreshToken(refreshToken: string, userEmail: string): Promise<void>;
    getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<User>;
    refreshToken(userEmail: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    markEmailAsVerified(email: string): Promise<User>;
}
