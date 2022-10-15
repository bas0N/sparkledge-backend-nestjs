"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./users/users.module");
const documents_module_1 = require("./documents/documents.module");
const prisma_module_1 = require("./prisma/prisma.module");
const infrastructure_module_1 = require("./infrastructure/infrastructure.module");
const files_module_1 = require("./files/files.module");
const passport_1 = require("@nestjs/passport");
const email_module_1 = require("./email/email.module");
const authentication_module_1 = require("./authentication/authentication.module");
const jwt_1 = require("@nestjs/jwt");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            users_module_1.UsersModule,
            documents_module_1.DocumentsModule,
            prisma_module_1.PrismaModule,
            infrastructure_module_1.InfrastructureModule,
            files_module_1.FilesModule,
            passport_1.PassportModule,
            email_module_1.EmailModule,
            authentication_module_1.AuthenticationModule,
            jwt_1.JwtModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
        ],
        exports: [passport_1.PassportModule, app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map