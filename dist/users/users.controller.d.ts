import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UserWithoutDetails } from './dto/returnTypes.dto';
import { ChangeRoleDto } from './dto/ChangeRole.dto';
export declare class UsersController {
    private userService;
    private authenticationService;
    constructor(userService: UsersService, authenticationService: AuthenticationService);
    changeUserRole({ role, userId }: ChangeRoleDto): Promise<void>;
    addNewUser(createUserDto: CreateUserDto): Promise<User>;
    signinUser(signinUserDto: SigninUserDto): Promise<{
        accessToken: String;
    }>;
    logout(user: User): Promise<void>;
    refreshToken(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getViewedDocuments(user: User): Promise<import("../documents/dto/Document.dto").DocumentDto[]>;
    getPublishedDocuments(user: User): Promise<import("../documents/dto/Document.dto").DocumentDto[]>;
    getPublishedDocumentsByUserId(userId: any): Promise<import("../documents/dto/Document.dto").DocumentDto[]>;
    getNumOfPublishedDocuments(userId: any): Promise<import("./dto/returnTypes.dto").NumberOfPublishedDocsDto>;
    getUserById(user: User): Promise<User>;
    getUserByIdWithoutDetails(userId: any): Promise<UserWithoutDetails>;
    getUserByEmailWithoutDetails(userEmail: any): Promise<UserWithoutDetails>;
    sendForgotPasswordLink(email: string): Promise<any>;
    resetPassword(email: string, token: string, newPassword: string): Promise<User>;
}
