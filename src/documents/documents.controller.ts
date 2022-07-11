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
  Patch,
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
import { DocumentDto } from './dto/Document.dto';
import { LikeStatusDto } from './dto/LikeStatus.dto';
import { EmailVerificationGuard } from 'src/authentication/authentication.guard';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
var path = require('path');
@ApiTags('documents')
@Controller('documents')
@UseInterceptors(FileInterceptor('file'))
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(EmailVerificationGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Document created.', type: DocumentDto })
  async addNewDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<DocumentDto> {
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
  @UseGuards(AuthGuard('jwt'), EmailVerificationGuard)
  @Patch()
  @ApiOkResponse({ description: 'Document updated.' })
  async updateDocument(
    @Body() updateDocumentDto: UpdateDocumentDto,
    @GetUser() user: User,
  ) {
    return this.documentsService.updateDocument(updateDocumentDto, user);
  }
  @Get('filtered')
  @ApiParam({ name: 'parameters' })
  async getDocumentsFiltered(
    @Query() filterDocumentsDto: FilterDocumentsDto,
  ): Promise<DocumentDto[]> {
    return this.documentsService.getDocumentsFiltered(filterDocumentsDto);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be retrieved.',
  })
  @Get('/:documentId')
  async getDocumentById(
    @Param('documentId') id,
    @GetUser() user: User,
  ): Promise<Document> {
    return await this.documentsService.getDocumentById(id, user);
  }

  @ApiOkResponse({ description: 'All documents retrieved.', type: DocumentDto })
  @Get()
  async getAllDocuments(): Promise<Document[]> {
    return await this.documentsService.getAllDocuments();
  }

  @ApiOkResponse({ description: 'Document deleted succesfully.' })
  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be deleted.',
  })
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(EmailVerificationGuard)
  @Delete('/:documentId')
  async deleteDocument(@Param() id: string, @GetUser() user: User) {
    return await this.documentsService.deleteDocument(id, user);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be liked/disliked.',
  })
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(EmailVerificationGuard)
  @Post('toggle-like/:documentId')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(
    @Param('documentId') id,
    @GetUser() user: User,
  ): Promise<LikeStatusDto> {
    return this.documentsService.toggleLike(user, id);
  }

  @ApiParam({
    name: 'documentId',
    description: 'Id of the document that is to be checked if liked.',
  })
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(EmailVerificationGuard)
  @Get('check-if-liked/:documentId')
  @UseGuards(AuthGuard('jwt'))
  async checkIfLiked(
    @Param('documentId') id,
    @GetUser() user: User,
  ): Promise<LikeStatusDto> {
    return this.documentsService.checkIfLiked(user, id);
  }
  /*
  @Patch()
  async updateDocument() {}
  */
}
