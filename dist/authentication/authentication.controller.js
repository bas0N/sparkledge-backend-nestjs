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
exports.AuthenticationController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const get_user_decorator_1 = require("../users/get-user.decorator");
const authentication_service_1 = require("./authentication.service");
const googleAuthenticate_dto_1 = require("./dto/googleAuthenticate.dto");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async googleAuthenticate(googleAuthDto) {
        return await this.authenticationService.googleAuthenticate(googleAuthDto);
    }
    async validateEmailWithToken(token) {
        const email = await this.authenticationService.decodeInformationToken(token);
        await this.authenticationService.confirmEmail(email);
    }
    async resendVerificationLink(user) {
        return await this.authenticationService.resendVerificationLink(user.email);
    }
    async googleAuth(req) { }
    async googleRedirect(req) {
        return await this.authenticationService.googleRedirect(req);
    }
};
__decorate([
    (0, common_1.Post)('google'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [googleAuthenticate_dto_1.GoogleAuthenticateDto]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "googleAuthenticate", null);
__decorate([
    (0, common_1.Get)('/:token'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "validateEmailWithToken", null);
__decorate([
    (0, common_1.Post)('resend-verification-link'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "resendVerificationLink", null);
__decorate([
    (0, common_1.Get)('google/auth'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "googleRedirect", null);
AuthenticationController = __decorate([
    (0, common_1.Controller)('authentication'),
    (0, swagger_1.ApiTags)('authentication'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map