/// <reference types="multer" />
import { DocumentsService } from './documents.service';
import { Document, User } from '@prisma/client';
import { FilterDocumentsDto } from './dto/FilterDocuments.dto';
import { AddCommentDto } from './dto/AddComment.dto';
import { Comment } from '.prisma/client';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { DocumentDto } from './dto/Document.dto';
import { LikeStatusDto } from './dto/LikeStatus.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { AddReportDto } from './dto/AddReport.dto';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    getMostPopular(): Promise<any[]>;
    getMostLiked(): Promise<any[]>;
    addNewDocument(createDocumentDto: CreateDocumentDto, user: User, file: Express.Multer.File): Promise<DocumentDto>;
    updateDocument(updateDocumentDto: UpdateDocumentDto, user: User): Promise<Document>;
    getDocumentsFiltered(filterDocumentsDto: FilterDocumentsDto): Promise<DocumentDto[]>;
    getDocumentById(id: any, user: User): Promise<Document>;
    getAllDocuments(): Promise<Document[]>;
    deleteDocument(id: string, user: User): Promise<void>;
    toggleLike(id: any, user: User): Promise<LikeStatusDto>;
    checkIfLiked(id: any, user: User): Promise<LikeStatusDto>;
    addComment(addCommentDto: AddCommentDto, user: User): Promise<import("./dto/AddCommentType").AddCommentType>;
    getComments(id: any): Promise<Comment[]>;
    deleteComment(id: any, user: User): Promise<Comment>;
    addReport(addReportDto: AddReportDto, user: User): Promise<import(".prisma/client").Report>;
}
