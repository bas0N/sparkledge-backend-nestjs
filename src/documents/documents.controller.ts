import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  @Post()
  async addNewDocument(@Body() createDocumentDto: CreateDocumentDto) {
    return await this.documentsService.addNewDocument(createDocumentDto);
  }
  //getDocumentById
  @Get('/:id')
  async getDocumentById(@Param('id') id) {
    return await this.documentsService.getDocumentById(id);
  }
  /*
  @Get()
  async getDocuments() {
    return await this.documentsService.getDocuments();
  }
  */
  @Delete('/:id')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  async deleteDocument(@Param('id') id: string) {
    return await this.documentsService.deleteDocument(id);
  }

  @Patch()
  async updateDocument() {}
}
