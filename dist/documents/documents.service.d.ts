/// <reference types="node" />
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { Document, User } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FilterDocumentsDto } from './dto/FilterDocuments.dto';
import { DocumentDto } from './dto/Document.dto';
import { LikeStatusDto } from './dto/LikeStatus.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { AddCommentDto } from './dto/AddComment.dto';
import { Comment } from '.prisma/client';
import { AddReportDto } from './dto/AddReport.dto';
import { AddCommentType } from './dto/AddCommentType';
import { IsPermitted } from './dto/IsPermitted.dto';
export declare class DocumentsService {
    private readonly prismaService;
    private filesService;
    constructor(prismaService: PrismaService, filesService: FilesService);
    getMostPopular(): Promise<{
        id: number;
        title: string;
        createdAt: Date;
        viewsNumber: number;
        likesNumber: number;
        user: {
            firstName: string;
            lastName: string;
        };
    }[]>;
    getMostLiked(): Promise<{
        id: number;
        title: string;
        createdAt: Date;
        viewsNumber: number;
        likesNumber: number;
        user: {
            firstName: string;
            lastName: string;
        };
    }[]>;
    addReport(addReportData: AddReportDto, user: User): Promise<import(".prisma/client").Report>;
    updateDocument(updateDocumentDto: UpdateDocumentDto, user: User): Promise<Document>;
    getDocumentsFiltered(filterDocumentsDto: FilterDocumentsDto): Promise<Document[]>;
    addNewDocument(document: CreateDocumentDto, user: User, fileBuffer: Buffer): Promise<DocumentDto>;
    getDocumentById(id: string, user: User): Promise<Document>;
    getAllDocuments(): Promise<Document[]>;
    addComment(user: User, comment: AddCommentDto): Promise<AddCommentType>;
    getComments(id: string): Promise<Comment[]>;
    deleteComment(user: User, id: string): Promise<Comment>;
    deleteDocument(id: string, user: User): Promise<Document>;
    toggleLike(user: User, documentId: string): Promise<LikeStatusDto>;
    checkIfLiked(user: User, documentId: string): Promise<LikeStatusDto>;
    isPermittedToDeleteDocument(documentId: string, user: User): Promise<IsPermitted>;
    isPermittedToDeleteComment(commentId: string, user: User): Promise<IsPermitted>;
}
