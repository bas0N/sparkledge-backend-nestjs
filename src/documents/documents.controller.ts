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
import { Document, User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';

@Controller('documents')
//@UseGuards(AuthGuard())
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  @Post()
  async addNewDocument(@GetUser() user: User, @Body() document: Document) {
    return await this.documentsService.addNewDocument(document, user);
  }

  //getDocumentById
  @Get('/:id')
  async getDocumentById(@Param('id') id) {
    return await this.documentsService.getDocumentById(id);
  }

  @Get()
  async getAllDocuments() {
    return await this.documentsService.getAllDocuments();
  }

  @Delete('/:id')
  async deleteDocument(@Param('id') id: string) {
    return await this.documentsService.deleteDocument(id);
  }
  /*
  @Patch()
  async updateDocument() {}
  */
}
