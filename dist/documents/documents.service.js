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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const files_service_1 = require("../files/files.service");
const slackBot_1 = require("../slack/slackBot");
const aws_sdk_1 = require("aws-sdk");
let DocumentsService = class DocumentsService {
    constructor(prismaService, filesService) {
        this.prismaService = prismaService;
        this.filesService = filesService;
    }
    async getMostPopular() {
        try {
            const documents = this.prismaService.document.findMany({
                orderBy: { viewsNumber: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            if (!documents) {
                throw new common_1.InternalServerErrorException('No documents found.');
            }
            const documentsModified = (await documents).map((document) => {
                return {
                    id: document.id,
                    title: document.title,
                    createdAt: document.createdAt,
                    viewsNumber: document.viewsNumber,
                    likesNumber: document.likesNumber,
                    user: {
                        firstName: document.user.firstName,
                        lastName: document.user.lastName,
                    },
                };
            });
            return documentsModified;
        }
        catch (err) {
            console.log(err);
        }
    }
    async getMostLiked() {
        try {
            const documents = this.prismaService.document.findMany({
                orderBy: { likesNumber: 'desc' },
                take: 10,
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            if (!documents) {
                throw new common_1.InternalServerErrorException('No documents found.');
            }
            const documentsModified = (await documents).map((document) => {
                return {
                    id: document.id,
                    title: document.title,
                    createdAt: document.createdAt,
                    viewsNumber: document.viewsNumber,
                    likesNumber: document.viewsNumber,
                    user: {
                        firstName: document.user.firstName,
                        lastName: document.user.lastName,
                    },
                };
            });
            return documentsModified;
        }
        catch (err) {
            console.log(err);
        }
    }
    async addReport(addReportData, user) {
        const { documentId, reportType, content } = addReportData;
        try {
            const document = this.prismaService.document.findFirst({
                where: { id: Number(documentId) },
            });
            if (!document) {
                throw new common_1.BadRequestException('Invalid document Id');
            }
            console.log('send message response');
            const currentDate = new Date();
            const report = await this.prismaService.report.create({
                data: {
                    documentId: Number(documentId),
                    userId: user.id,
                    reportType,
                    content,
                    createdAt: currentDate,
                },
            });
            if (!report) {
                throw new common_1.InternalServerErrorException('Report not added.');
            }
            await (0, slackBot_1.sendMessage)(user.id, user.email, documentId.toString(), report.id, reportType, content, currentDate);
            return report;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async updateDocument(updateDocumentDto, user) {
        const userDb = await this.prismaService.user.findUnique({
            where: { email: user.email },
        });
        if (!userDb) {
            throw new common_1.BadRequestException('User not found.');
        }
        if (updateDocumentDto.id !== userDb.id) {
            throw new common_1.BadRequestException('You do not own this material - cannot update.');
        }
        return this.prismaService.document.update({
            where: { id: Number(updateDocumentDto.id) },
            data: {
                title: updateDocumentDto === null || updateDocumentDto === void 0 ? void 0 : updateDocumentDto.title,
                description: updateDocumentDto === null || updateDocumentDto === void 0 ? void 0 : updateDocumentDto.description,
            },
        });
    }
    async getDocumentsFiltered(filterDocumentsDto) {
        const sortProperties = {};
        sortProperties[filterDocumentsDto.sortPropety] =
            filterDocumentsDto.sortValue;
        console.log(sortProperties);
        const documents = await this.prismaService.document.findMany({
            where: {
                universityId: Number(filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.universityId) || undefined,
                facultyId: Number(filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.facultyId) || undefined,
                programmeId: Number(filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.programmeId) || undefined,
                courseId: Number(filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.courseId) || undefined,
                course: {
                    is: {
                        semester: Number(filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.semester) || undefined,
                        degree: (filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.degree) || undefined,
                        courseType: (filterDocumentsDto === null || filterDocumentsDto === void 0 ? void 0 : filterDocumentsDto.courseType) || undefined,
                    },
                },
            },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: sortProperties,
        });
        return documents;
    }
    async addNewDocument(document, user, fileBuffer) {
        const { title, description, courseId, programmeId, facultyId, universityId, } = document;
        const date = new Date();
        date.setHours(date.getHours() + 2);
        try {
            const createdFile = await this.filesService.fileUpload(fileBuffer);
            const createdDocument = await this.prismaService.document.create({
                data: {
                    title,
                    description,
                    course: { connect: { id: Number(courseId) } },
                    university: { connect: { id: Number(universityId) } },
                    faculty: { connect: { id: Number(facultyId) } },
                    programme: { connect: { id: Number(programmeId) } },
                    user: { connect: { id: user.id } },
                    file: { connect: { id: Number(createdFile.id) } },
                    createdAt: date,
                },
            });
            return createdDocument;
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Error during document upload.');
        }
    }
    async getDocumentById(id, user) {
        const document = await this.prismaService.document.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document with id ${id} not found.`);
        }
        return document;
    }
    async getAllDocuments() {
        const documents = await this.prismaService.document.findMany();
        return documents;
    }
    async addComment(user, comment) {
        const { documentId, content } = comment;
        const date = new Date();
        date.setHours(date.getHours() + 2);
        try {
            const comment = await this.prismaService.comment.create({
                data: {
                    author: { connect: { id: user.id } },
                    document: { connect: { id: Number(documentId) } },
                    content,
                    createdAt: date,
                },
            });
            const returnComment = Object.assign(Object.assign({}, comment), { author: { firstName: user.firstName, lastName: user.lastName } });
            return returnComment;
        }
        catch (err) {
            throw new Error(err);
        }
    }
    async getComments(id) {
        try {
            const comments = await this.prismaService.document
                .findUnique({
                where: { id: Number(id) },
            })
                .comments({
                include: {
                    author: {
                        select: {
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
            });
            return comments;
        }
        catch (err) {
            throw new common_1.NotFoundException(`Document with id ${id} not found.`);
        }
    }
    async deleteComment(user, id) {
        try {
            const comment = await this.prismaService.comment.findUnique({
                where: { id: Number(id) },
            });
            if ((comment.userId = user.id)) {
                const commentDeleted = await this.prismaService.comment.delete({
                    where: { id: Number(id) },
                });
                return commentDeleted;
            }
            throw new common_1.UnauthorizedException(`You are not the creator of the comment with id ${id}, thus you cannot delete it.`);
        }
        catch (err) {
            throw new common_1.NotFoundException(`Comment with id ${id} not found.`);
        }
    }
    async deleteDocument(id, user) {
        try {
            const document = await this.prismaService.document.findUnique({
                where: { id: Number(id) },
            });
            if (!document) {
                throw new common_1.BadRequestException('Document with the given id does not exist.');
            }
            if (document.userId !== user.id) {
                throw new common_1.UnauthorizedException('You are not permited to delete this document.');
            }
            const s3 = new aws_sdk_1.S3();
            const file = await this.prismaService.file.findUnique({
                where: { id: Number(document.fileId) },
            });
            var params = {
                Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
                Key: file.key,
            };
            s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                }
                else {
                    console.log('object deleted succesfully');
                }
            });
            await this.prismaService.document.delete({
                where: { id: Number(id) },
            });
        }
        catch (err) {
            throw new common_1.NotFoundException(err);
        }
    }
    async toggleLike(user, documentId) {
        const document = await this.prismaService.document.findUnique({
            where: { id: Number(documentId) },
        });
        if (!document) {
            throw new common_1.BadRequestException(`Document of id: ${documentId} has not been found.`);
        }
        const index = document.likesList.indexOf(user.id.toString());
        if (index > -1) {
            document.likesList.splice(index, 1);
            const updatedDocument = await this.prismaService.document.update({
                where: { id: Number(documentId) },
                data: {
                    likesList: {
                        set: document.likesList,
                    },
                    likesNumber: {
                        decrement: 1,
                    },
                },
            });
            if (!updatedDocument) {
                throw new common_1.InternalServerErrorException('Document not updated.');
            }
            return { message: 'Document disliked.', status: false };
        }
        document.likesList.push(user.id.toString());
        const updatedDocument = await this.prismaService.document.update({
            where: { id: Number(documentId) },
            data: {
                likesList: {
                    set: document.likesList,
                },
                likesNumber: {
                    increment: 1,
                },
            },
        });
        if (!updatedDocument) {
            throw new common_1.InternalServerErrorException('Document not updated.');
        }
        return { message: 'Document liked.', status: true };
    }
    async checkIfLiked(user, documentId) {
        const document = await this.prismaService.document.findUnique({
            where: { id: Number(documentId) },
        });
        if (!document) {
            throw new common_1.BadRequestException(`Document of id: ${documentId} has not been found.`);
        }
        const index = document.likesList.indexOf(user.id.toString());
        if (index > -1) {
            return {
                message: `Document of id: ${documentId} is liked by the user of id: ${user.id}.`,
                status: true,
            };
        }
        else {
            return {
                message: `Document of id: ${documentId} is not liked by the user of id: ${user.id}.`,
                status: false,
            };
        }
    }
};
DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        files_service_1.FilesService])
], DocumentsService);
exports.DocumentsService = DocumentsService;
//# sourceMappingURL=documents.service.js.map