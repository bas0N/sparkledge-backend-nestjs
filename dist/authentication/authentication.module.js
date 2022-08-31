"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const authentication_controller_1 = require("./authentication.controller");
const jwt_1 = require("@nestjs/jwt");
const email_service_1 = require("../email/email.service");
const email_module_1 = require("../email/email.module");
const users_module_1 = require("../users/users.module");
const users_service_1 = require("../users/users.service");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const google_strategy_1 = require("./google.strategy");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({}), email_module_1.EmailModule, users_module_1.UsersModule, prisma_module_1.PrismaModule],
        providers: [
            jwt_1.JwtService,
            authentication_service_1.AuthenticationService,
            users_service_1.UsersService,
            email_service_1.EmailService,
            prisma_service_1.PrismaService,
            google_strategy_1.GoogleStrategy,
        ],
        controllers: [authentication_controller_1.AuthenticationController],
        exports: [jwt_1.JwtModule, users_module_1.UsersModule],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map