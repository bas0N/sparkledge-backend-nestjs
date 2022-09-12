/// <reference types="node" />
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document, User } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FilterDocumentsDto } from './dto/filterDocuments.dto';
import { DocumentDto } from './dto/document.dto';
import { LikeStatusDto } from './dto/likeStatus.dto';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { AddCommentDto } from './dto/addComment.dto';
import { Comment } from '.prisma/client';
import { AddReportDto } from './dto/addReport.dto';
export declare class DocumentsService {
    private readonly prismaService;
    private filesService;
    constructor(prismaService: PrismaService, filesService: FilesService);
    addReport(addReportData: AddReportDto, user: User): Promise<import(".prisma/client").Report>;
    updateDocument(updateDocumentDto: UpdateDocumentDto, user: User): Promise<Document>;
    getDocumentsFiltered(filterDocumentsDto: FilterDocumentsDto): Promise<Document[]>;
    addNewDocument(document: CreateDocumentDto, user: User, fileBuffer: Buffer): Promise<DocumentDto>;
    getDocumentById(id: string, user: User): Promise<Document>;
    getAllDocuments(): Promise<Document[]>;
    addComment(user: User, comment: AddCommentDto): Promise<Comment>;
    getComments(id: string): Promise<Comment[]>;
    deleteComment(user: User, id: string): Promise<Comment>;
    deleteDocument(id: string, user: User): Promise<void>;
    toggleLike(user: User, documentId: string): Promise<LikeStatusDto>;
    checkIfLiked(user: User, documentId: string): Promise<LikeStatusDto>;
}
