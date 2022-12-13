import { CreateUserDto } from './dto/createUser.dto';
import { SigninUserDto } from './dto/signinUser.dto';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { AuthenticationService } from 'src/authentication/authentication.service';
import { UserWithoutDetails } from './dto/returnTypes.dto';
import { ChangeRoleDto } from './dto/ChangeRole.dto';
import { UpdateUserDataDto } from './dto/UpdateUserData.dto';
import { ChangeUserNameSurnameDto } from './dto/ChangeUserNameSurnameDto';
import { ChangeDefaultSearchDto } from './dto/ChangeDefaultSearch.dto';
export declare class UsersController {
    private userService;
    private authenticationService;
    constructor(userService: UsersService, authenticationService: AuthenticationService);
    changeUserRole({ role, userId }: ChangeRoleDto): Promise<void>;
    updateUserData(updateUserDataDto: UpdateUserDataDto, user: User): Promise<{
        facebookUrl: string;
        instagramUrl: string;
        linkedInUrl: string;
        pinterestUrl: string;
        description: string;
    }>;
    addNewUser(createUserDto: CreateUserDto): Promise<User>;
    changeUserNameSurname(changeUserNameSurnameDto: ChangeUserNameSurnameDto, user: User): Promise<User>;
    signinUser(signinUserDto: SigninUserDto): Promise<{
        accessToken: String;
    }>;
    changeDefaultSearch(changeDefaultSearchData: ChangeDefaultSearchDto, user: User): Promise<User>;
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
