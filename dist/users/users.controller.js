"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const createUser_dto_1 = require("./dto/createUser.dto");
const signinUser_dto_1 = require("./dto/signinUser.dto");
const users_service_1 = require("./users.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("./get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const authentication_service_1 = require("../authentication/authentication.service");
const ChangeRole_dto_1 = require("./dto/ChangeRole.dto");
const UpdateUserData_dto_1 = require("./dto/UpdateUserData.dto");
const ChangeUserNameSurnameDto_1 = require("./dto/ChangeUserNameSurnameDto");
const ChangeDefaultSearch_dto_1 = require("./dto/ChangeDefaultSearch.dto");
let UsersController = class UsersController {
    constructor(userService, authenticationService) {
        this.userService = userService;
        this.authenticationService = authenticationService;
    }
    async changeUserRole({ role, userId }) { }
    async updateUserData(updateUserDataDto, user) {
        return this.userService.updateUserData(updateUserDataDto, user);
    }
    async addNewUser(createUserDto) {
        const user = this.userService.addNewUser(createUserDto);
        this.authenticationService.sendVerificationLink(createUserDto.email);
        return user;
    }
    async changeUserNameSurname(changeUserNameSurnameDto, user) {
        console.log(user);
        return this.userService.changeUserNameSurname(changeUserNameSurnameDto, user);
    }
    async signinUser(signinUserDto) {
        return this.userService.signInUser(signinUserDto);
    }
    async changeDefaultSearch(changeDefaultSearchData, user) {
        return this.userService.changeDefaultSearch(changeDefaultSearchData, user);
    }
    async logout(user) {
        return this.userService.logout(user.email);
    }
    async refreshToken(user) {
        return this.userService.refreshToken(user.email, user.refreshToken);
    }
    async getViewedDocuments(user) {
        console.log('user controller');
        return this.userService.getViewedDocuments(user);
    }
    async getPublishedDocuments(user) {
        console.log('user controller');
        return this.userService.getPublishedDocuments(user);
    }
    async getPublishedDocumentsByUserId(userId) {
        return this.userService.getPublishedDocumentsByUserId(userId);
    }
    async getNumOfPublishedDocuments(userId) {
        return this.userService.getNumOfPublishedDocuments(userId);
    }
    async getUserById(user) {
        return await this.userService.getUserById(user.id);
    }
    async getUserByIdWithoutDetails(userId) {
        return await this.userService.getUserByIdWithoutDetails(userId);
    }
    async getUserByEmailWithoutDetails(userEmail) {
        return await this.userService.getUserByEmailWithoutDetails(userEmail);
    }
    async sendForgotPasswordLink(email) {
        return await this.userService.sendForgotPasswordLink(email);
    }
    async resetPassword(email, token, newPassword) {
        return await this.userService.resetPassword(email, token, newPassword);
    }
};
__decorate([
    (0, common_1.Post)('changeUserRole'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRole_dto_1.ChangeRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Put)('/updateUserData'),
    (0, swagger_1.ApiBody)({ type: [UpdateUserData_dto_1.UpdateUserDataDto] }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateUserData_dto_1.UpdateUserDataDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserData", null);
__decorate([
    (0, common_1.Post)('/signup'),
    (0, swagger_1.ApiBody)({ type: [createUser_dto_1.CreateUserDto] }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'User Registration' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Email provided already exists.' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    openapi.ApiResponse({ status: common_1.HttpStatus.CREATED, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUser_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addNewUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/changeNameSurname'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeUserNameSurnameDto_1.ChangeUserNameSurnameDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeUserNameSurname", null);
__decorate([
    (0, common_1.Post)('/signin'),
    (0, swagger_1.ApiBody)({ type: [signinUser_dto_1.SigninUserDto] }),
    (0, swagger_1.ApiOkResponse)({ description: 'User logged in.' }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Invalid credentials.',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signinUser_dto_1.SigninUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signinUser", null);
__decorate([
    (0, common_1.Post)('changeDefaultSearch'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeDefaultSearch_dto_1.ChangeDefaultSearchDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeDefaultSearch", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOkResponse)({ description: 'User Login' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Invalid credentials' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    openapi.ApiResponse({ status: common_1.HttpStatus.OK }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt-refresh')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Access and refresh tokens renewed' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Get)('viewedDocuments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 200, type: [require("../documents/dto/Document.dto").DocumentDto] }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getViewedDocuments", null);
__decorate([
    (0, common_1.Get)('publishedDocuments'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 200, type: [require("../documents/dto/Document.dto").DocumentDto] }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPublishedDocuments", null);
__decorate([
    (0, common_1.Get)('getPublishedDocumentsByUserId/:userId'),
    openapi.ApiResponse({ status: 200, type: [require("../documents/dto/Document.dto").DocumentDto] }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPublishedDocumentsByUserId", null);
__decorate([
    (0, common_1.Get)('getNumOfPublishedDocuments/:userId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getNumOfPublishedDocuments", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOkResponse)({ description: 'User retrieved succesfully.' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        description: 'Id of the user that is to be retrieved.',
    }),
    (0, common_1.Get)('/:userId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('/getUserByIdWithoutDetails/:userId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByIdWithoutDetails", null);
__decorate([
    (0, common_1.Get)('/getUserByEmailWithoutDetails/:userEmail'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmailWithoutDetails", null);
__decorate([
    (0, common_1.Post)('sendForgotPasswordLink'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "sendForgotPasswordLink", null);
__decorate([
    (0, common_1.Post)('resetPassword/:email/:token'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Param)('token')),
    __param(2, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "resetPassword", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        authentication_service_1.AuthenticationService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map