import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Document, User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
var path = require('path');

@Controller('documents')
@UseGuards(AuthGuard())
@UseInterceptors(FileInterceptor('file'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}
  @Post()
  async addNewDocument(
    @GetUser() user: User,
    @Body() document: Document,
    @Req() req,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //file extension check
    if (path.extname(file.originalname) !== '.pdf') {
      throw new BadRequestException('File extension must be of type .pdf .');
    }
    return await this.documentsService.addNewDocument(
      document,
      user,
      req,
      res,
      file.buffer,
    );
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
  async deleteDocument(@Param('id') id: string, @GetUser() user: User) {
    return await this.documentsService.deleteDocument(id, user);
  }
  /*
  @Patch()
  async updateDocument() {}
  */
}
