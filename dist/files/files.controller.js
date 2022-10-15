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
exports.FilesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../users/get-user.decorator");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async getFileKeyAsUrl(documentId, res, user) {
        console.log('files controlller');
        console.log(user);
        const url = await this.filesService.getFileKeyAsUrl(documentId, res, user);
        return url;
    }
    async getFileByKeyAsStream(documentId, res, user) {
        const file = await this.filesService.getFileByKeyAsStream(documentId, res, user);
        file.pipe(res);
    }
};
__decorate([
    (0, common_1.Get)('url/:documentId'),
    openapi.ApiResponse({ status: 200, type: String }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileKeyAsUrl", null);
__decorate([
    (0, common_1.Get)('stream/:documentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileByKeyAsStream", null);
FilesController = __decorate([
    (0, common_1.Controller)('files'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
exports.FilesController = FilesController;
//# sourceMappingURL=files.controller.js.map