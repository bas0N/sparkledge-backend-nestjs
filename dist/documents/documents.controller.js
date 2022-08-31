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
exports.DocumentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const documents_service_1 = require("./documents.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../users/get-user.decorator");
const platform_express_1 = require("@nestjs/platform-express");
const FilterDocuments_dto_1 = require("./dto/FilterDocuments.dto");
const AddComment_dto_1 = require("./dto/AddComment.dto");
const swagger_1 = require("@nestjs/swagger");
const create_document_dto_1 = require("./dto/create-document.dto");
const Document_dto_1 = require("./dto/Document.dto");
const UpdateDocument_dto_1 = require("./dto/UpdateDocument.dto");
const AddReport_dto_1 = require("./dto/AddReport.dto");
var path = require('path');
let DocumentsController = class DocumentsController {
    constructor(documentsService) {
        this.documentsService = documentsService;
    }
    async addNewDocument(createDocumentDto, user, file) {
        if (path.extname(file.originalname) !== '.pdf') {
            throw new common_1.BadRequestException('File extension must be of type .pdf .');
        }
        return await this.documentsService.addNewDocument(createDocumentDto, user, file.buffer);
    }
    async updateDocument(updateDocumentDto, user) {
        return this.documentsService.updateDocument(updateDocumentDto, user);
    }
    async getDocumentsFiltered(filterDocumentsDto) {
        return this.documentsService.getDocumentsFiltered(filterDocumentsDto);
    }
    async getDocumentById(id, user) {
        return await this.documentsService.getDocumentById(id, user);
    }
    async getAllDocuments() {
        return await this.documentsService.getAllDocuments();
    }
    async deleteDocument(id, user) {
        return await this.documentsService.deleteDocument(id, user);
    }
    async toggleLike(id, user) {
        return this.documentsService.toggleLike(user, id);
    }
    async checkIfLiked(id, user) {
        return this.documentsService.checkIfLiked(user, id);
    }
    async addComment(addCommentDto, user) {
        return this.documentsService.addComment(user, addCommentDto);
    }
    async getComments(id) {
        return this.documentsService.getComments(id);
    }
    async deleteDomment(id, user) {
        return this.documentsService.deleteComment(user, id);
    }
    async addReport(addReportDto, user) {
        return this.documentsService.addReport(addReportDto, user);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Document created.', type: Document_dto_1.DocumentDto }),
    openapi.ApiResponse({ status: 201, type: require("./dto/Document.dto").DocumentDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_document_dto_1.CreateDocumentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "addNewDocument", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Patch)(),
    (0, swagger_1.ApiOkResponse)({ description: 'Document updated.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateDocument_dto_1.UpdateDocumentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "updateDocument", null);
__decorate([
    (0, common_1.Get)('filtered'),
    (0, swagger_1.ApiParam)({ name: 'parameters' }),
    openapi.ApiResponse({ status: 200, type: [require("./dto/Document.dto").DocumentDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterDocuments_dto_1.FilterDocumentsDto]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocumentsFiltered", null);
__decorate([
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Id of the document that is to be retrieved.',
    }),
    (0, common_1.Get)('/:documentId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getDocumentById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'All documents retrieved.', type: Document_dto_1.DocumentDto }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getAllDocuments", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Document deleted succesfully.' }),
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Id of the document that is to be deleted.',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/:documentId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "deleteDocument", null);
__decorate([
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Id of the document that is to be liked/disliked.',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('toggle-like/:documentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 201, type: require("./dto/LikeStatus.dto").LikeStatusDto }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "toggleLike", null);
__decorate([
    (0, swagger_1.ApiParam)({
        name: 'documentId',
        description: 'Id of the document that is to be checked if liked.',
    }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('check-if-liked/:documentId'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    openapi.ApiResponse({ status: 200, type: require("./dto/LikeStatus.dto").LikeStatusDto }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "checkIfLiked", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({ description: 'Comment Added.', type: AddComment_dto_1.AddCommentDto }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/comments/add-comment'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddComment_dto_1.AddCommentDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "addComment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)('/comments/get-comments/:documentId'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, common_1.Param)('documentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "getComments", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)('/comments/delete-comment/:documentId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('documentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "deleteDomment", null);
__decorate([
    (0, swagger_1.ApiCreatedResponse)({ description: 'Report Added.', type: AddReport_dto_1.AddReportDto }),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('/report/add-report'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddReport_dto_1.AddReportDto, Object]),
    __metadata("design:returntype", Promise)
], DocumentsController.prototype, "addReport", null);
DocumentsController = __decorate([
    (0, swagger_1.ApiTags)('documents'),
    (0, common_1.Controller)('documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentsController);
exports.DocumentsController = DocumentsController;
//# sourceMappingURL=documents.controller.js.map