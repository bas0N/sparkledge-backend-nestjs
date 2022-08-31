"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsModule = void 0;
const common_1 = require("@nestjs/common");
const documents_controller_1 = require("./documents.controller");
const documents_service_1 = require("./documents.service");
const users_module_1 = require("../users/users.module");
const prisma_module_1 = require("../prisma/prisma.module");
const files_module_1 = require("../files/files.module");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const access_token_strategy_1 = require("../users/strategies/access-token.strategy");
const refresh_token_strategy_1 = require("../users/strategies/refresh-token.strategy");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
let DocumentsModule = class DocumentsModule {
};
DocumentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            files_module_1.FilesModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({}),
        ],
        controllers: [documents_controller_1.DocumentsController],
        providers: [
            documents_service_1.DocumentsService,
            access_token_strategy_1.AccessTokenStrategy,
            refresh_token_strategy_1.RefreshTokenStrategy,
            users_service_1.UsersService,
            email_service_1.EmailService,
        ],
    })
], DocumentsModule);
exports.DocumentsModule = DocumentsModule;
//# sourceMappingURL=documents.module.js.map