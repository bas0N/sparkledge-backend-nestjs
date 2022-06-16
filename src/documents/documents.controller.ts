import { Body, Controller, Get, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './document.model';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {
    this.documentsService = documentsService;
  }
  @Get()
  getAllDocuments() {
    return this.documentsService.getAllDocuments();
  }
  @Post()
  async addNewDocument(
    @Body('title')
    title: string,
    @Body('description')
    description: string,
    @Body('createdBy')
    createdBy: string,
    @Body('creatorEmail')
    creatorEmail: string,

    @Body('viewsNum')
    viewsNum: number,
    @Body('likesNum')
    likesNum: number,
  ) {
    return await this.documentsService.addNewDocument(
      title,
      description,
      createdBy,
      creatorEmail,
      viewsNum,
      likesNum,
    );
  }
}
