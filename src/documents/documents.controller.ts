import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Document } from '@prisma/client';

@Controller('documents')
//@UseGuards(AuthGuard())
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  @Post()
  async addNewDocument(@Body() document: Document) {
    return await this.documentsService.addNewDocument(document);
  }
  /*
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
  */
}
