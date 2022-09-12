/// <reference types="multer" />
import { DocumentsService } from './documents.service';
import { Document, User } from '@prisma/client';
import { FilterDocumentsDto } from './dto/filterDocuments.dto';
import { AddCommentDto } from './dto/addComment.dto';
import { Comment } from '.prisma/client';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { LikeStatusDto } from './dto/likeStatus.dto';
import { UpdateDocumentDto } from './dto/updateDocument.dto';
import { AddReportDto } from './dto/addReport.dto';
export declare class DocumentsController {
    private documentsService;
    constructor(documentsService: DocumentsService);
    addNewDocument(createDocumentDto: CreateDocumentDto, user: User, file: Express.Multer.File): Promise<DocumentDto>;
    updateDocument(updateDocumentDto: UpdateDocumentDto, user: User): Promise<Document>;
    getDocumentsFiltered(filterDocumentsDto: FilterDocumentsDto): Promise<DocumentDto[]>;
    getDocumentById(id: any, user: User): Promise<Document>;
    getAllDocuments(): Promise<Document[]>;
    deleteDocument(id: string, user: User): Promise<void>;
    toggleLike(id: any, user: User): Promise<LikeStatusDto>;
    checkIfLiked(id: any, user: User): Promise<LikeStatusDto>;
    addComment(addCommentDto: AddCommentDto, user: User): Promise<Comment>;
    getComments(id: any): Promise<Comment[]>;
    deleteDomment(id: any, user: User): Promise<Comment>;
    addReport(addReportDto: AddReportDto, user: User): Promise<import(".prisma/client").Report>;
}
