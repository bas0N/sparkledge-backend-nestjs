import { SigninUserDto } from './dto/signinUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUser.dto';
import { DocumentDto } from 'src/documents/dto/Document.dto';
import { EmailService } from 'src/email/email.service';
import { NumberOfPublishedDocsDto, UserWithoutDetails } from './dto/returnTypes.dto';
import { UpdateUserDataDto } from './dto/UpdateUserData.dto';
import { ChangeUserNameSurnameDto } from './dto/ChangeUserNameSurnameDto';
import { ChangeDefaultSearchDto } from './dto/ChangeDefaultSearch.dto';
export declare class UsersService {
    private readonly prismaService;
    private jwtService;
    private readonly emailService;
    constructor(prismaService: PrismaService, jwtService: JwtService, emailService: EmailService);
    getMe(user: User): Promise<User>;
    resetPassword(email: string, token: string, newPassword: string): Promise<User>;
    changeDefaultSearch(changeDefaultSearchData: ChangeDefaultSearchDto, user: User): Promise<User>;
    changeUserNameSurname({ firstName, lastName }: ChangeUserNameSurnameDto, user: User): Promise<User>;
    sendForgotPasswordLink(email: string): Promise<any>;
    addNewUser({ email, password, firstName, lastName, }: CreateUserDto): Promise<User>;
    signInUser(signinUserDto: SigninUserDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getUserById(userId: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    updateUserData(updateUserDataDto: UpdateUserDataDto, user: User): Promise<{
        facebookUrl: string;
        instagramUrl: string;
        linkedInUrl: string;
        pinterestUrl: string;
        description: string;
    }>;
    getUserByIdWithoutDetails(userId: string): Promise<UserWithoutDetails>;
    getUserByEmailWithoutDetails(userEmail: string): Promise<UserWithoutDetails>;
    logout(userEmail: string): Promise<void>;
    getJwtAccessToken(payload: JwtPayload): Promise<string>;
    getJwtRefreshToken(payload: JwtPayload): Promise<string>;
    getViewedDocuments(user: User): Promise<DocumentDto[]>;
    getPublishedDocumentsByUserId(userId: string): Promise<DocumentDto[]>;
    getNumOfPublishedDocuments(userId: string): Promise<NumberOfPublishedDocsDto>;
    getPublishedDocuments(user: User): Promise<DocumentDto[]>;
    setCurrentRefreshToken(refreshToken: string, userEmail: string): Promise<void>;
    getUserIfRefreshTokenMatches(refreshToken: string, email: string): Promise<User>;
    refreshToken(userEmail: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    markEmailAsVerified(email: string): Promise<User>;
}
