import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { AuthenticationService } from 'src/authentication/authentication.service';
export declare class UsersController {
    private userService;
    private authenticationService;
    constructor(userService: UsersService, authenticationService: AuthenticationService);
    addNewUser(createUserDto: CreateUserDto): Promise<User>;
    signinUser(signinUserDto: SigninUserDto): Promise<{
        accessToken: String;
    }>;
    logout(user: User): Promise<void>;
    refreshToken(user: User): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getViewedDocuments(user: User): Promise<import("../documents/dto/document.dto").DocumentDto[]>;
    getUserById(userId: string): Promise<User>;
    sendForgotPasswordLink(email: string): Promise<any>;
    resetPassword(email: string, token: string, newPassword: string): Promise<User>;
}
