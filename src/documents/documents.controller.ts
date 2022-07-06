import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { Document, User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FilterDocumentsDto } from './dto/FilterDocuments.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDocumentDto } from './dto/create-document.dto';
var path = require('path');
@ApiTags('documents')
@Controller('documents')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(FileInterceptor('file'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @ApiBearerAuth()
  async addNewDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    //file extension check
    if (path.extname(file.originalname) !== '.pdf') {
      throw new BadRequestException('File extension must be of type .pdf .');
    }
    return await this.documentsService.addNewDocument(
      createDocumentDto,
      user,
      file.buffer,
    );
  }

  @Get('filtered')
  @ApiParam({ name: 'parameters' })
  async getDocumentsFiltered(@Query() filterDocumentsDto: FilterDocumentsDto) {
    return this.documentsService.getDocumentsFiltered(filterDocumentsDto);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be retrieved.',
  })
  @Get('/:documentId')
  async getDocumentById(@Param() id, @GetUser() user: User) {
    return await this.documentsService.getDocumentById(id, user);
  }

  @ApiOkResponse({ description: 'All documents retrieved.' })
  @Get()
  async getAllDocuments(): Promise<Document[]> {
    return await this.documentsService.getAllDocuments();
  }

  @ApiOkResponse({ description: 'Document retrieved succesfully.' })
  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be deleted.',
  })
  @Delete('/:documentId')
  async deleteDocument(@Param() id: string, @GetUser() user: User) {
    return await this.documentsService.deleteDocument(id, user);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be liked/disliked.',
  })
  @Post('toggle-like/:documentId')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param() id, @GetUser() user: User) {
    return this.documentsService.toggleLike(user, id);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be checked if liked.',
  })
  @Get('check-if-liked/:documentId')
  @UseGuards(AuthGuard('jwt'))
  async checkIfLiked(@Param() id, @GetUser() user: User) {
    return this.documentsService.checkIfLiked(user, id);
  }
  /*
  @Patch()
  async updateDocument() {}
  */
}
