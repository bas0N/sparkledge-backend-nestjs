import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';

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
  async addNewDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return await this.documentsService.addNewDocument(createDocumentDto);
  }
  //getDocumentById
  @Get('/:id')
  async getDocumentById(@Param('id') id) {
    return await this.documentsService.getDocumentById(id);
  }
  //getDocuments
  //deleteDocument(){}
}
