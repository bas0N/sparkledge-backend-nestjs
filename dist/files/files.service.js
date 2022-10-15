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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const prisma_service_1 = require("../prisma/prisma.service");
const uuid_1 = require("uuid");
let FilesService = class FilesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async fileUpload(dataBuffer) {
        const s3 = new aws_sdk_1.S3();
        const uploadResult = await s3
            .upload({
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Body: dataBuffer,
            ACL: 'public-read',
            Key: (await (0, uuid_1.v4)()) + '.pdf',
        })
            .promise();
        const createdFile = await this.prismaService.file.create({
            data: { key: uploadResult.Key },
        });
        console.log('the created file is result is:');
        console.log(createdFile);
        return createdFile;
    }
    async getFileByKeyAsStream(documentId, res, user) {
        try {
            const s3 = new aws_sdk_1.S3();
            const document = await this.prismaService.document.update({
                where: { id: Number(documentId) },
                data: {
                    viewsNumber: {
                        increment: 1,
                    },
                },
            });
            if (!document) {
                throw new common_1.NotFoundException('Document with the given id has not been found.');
            }
            const foundUser = await this.prismaService.user.findUnique({
                where: {
                    id: user.id,
                },
            });
            if (!foundUser) {
                throw new common_1.NotFoundException(`User's object could not be found.`);
            }
            const index = foundUser.viewedDocuments.indexOf(documentId);
            if (index > -1) {
                foundUser.viewedDocuments.splice(index, 1);
            }
            if (foundUser.viewedDocuments.length > 9) {
                foundUser.viewedDocuments.splice(0, foundUser.viewedDocuments.length - 10);
            }
            foundUser.viewedDocuments.push(documentId);
            const userUpdated = await this.prismaService.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    viewedDocuments: {
                        set: foundUser.viewedDocuments,
                    },
                },
            });
            if (!userUpdated) {
                throw new common_1.InternalServerErrorException(`Error while updating user's object with a new array.`);
            }
            const foundFile = await this.prismaService.file.findUnique({
                where: { id: document.fileId },
            });
            if (!foundFile) {
                throw new common_1.NotFoundException('File with id:' + document.fileId + ' has not been found.');
            }
            else {
                const stream = await s3
                    .getObject({
                    Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
                    Key: foundFile.key,
                })
                    .createReadStream();
                return stream;
            }
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async getFileKeyAsUrl(documentId, res, user) {
        const s3 = new aws_sdk_1.S3();
        const document = await this.prismaService.document.update({
            where: { id: Number(documentId) },
            data: {
                viewsNumber: {
                    increment: 1,
                },
            },
        });
        const foundUser = await this.prismaService.user.findUnique({
            where: {
                id: user.id,
            },
        });
        if (!foundUser) {
            throw new common_1.NotFoundException(`User's object could not be found.`);
        }
        const index = foundUser.viewedDocuments.indexOf(documentId);
        if (index > -1) {
            foundUser.viewedDocuments.splice(index, 1);
        }
        if (foundUser.viewedDocuments.length > 9) {
            foundUser.viewedDocuments.splice(0, foundUser.viewedDocuments.length - 10);
        }
        foundUser.viewedDocuments.push(documentId);
        const userUpdated = await this.prismaService.user.update({
            where: {
                id: user.id,
            },
            data: {
                viewedDocuments: {
                    set: foundUser.viewedDocuments,
                },
            },
        });
        if (!userUpdated) {
            throw new common_1.InternalServerErrorException(`Error while updating user's object with a new array.`);
        }
        const foundFile = await this.prismaService.file.findUnique({
            where: { id: Number(document.fileId) },
        });
        if (!foundFile) {
            throw new common_1.NotFoundException('File with id:' + document.fileId + ' has not been found.');
        }
        else {
            const url = await s3.getSignedUrlPromise('getObject', {
                Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
                Key: foundFile.key,
                Expires: 120,
            });
            return url;
        }
    }
};
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesService.prototype, "getFileByKeyAsStream", null);
__decorate([
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], FilesService.prototype, "getFileKeyAsUrl", null);
FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
exports.FilesService = FilesService;
//# sourceMappingURL=files.service.js.map