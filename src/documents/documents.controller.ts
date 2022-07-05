import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Post,
  Req,
  Res,
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
import { FilterDocumentsDto } from './dto/filter-documents.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiQuery,
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
  @ApiCreatedResponse({ description: 'New document created.' })
  @ApiBearerAuth()
  async addNewDocument(
    @GetUser() user: User,
    @Body() createDocumentDto: CreateDocumentDto,
    @Res() res,
    @UploadedFile() file: Express.Multer.File,
  ) {
    //file extension check
    if (path.extname(file.originalname) !== '.pdf') {
      throw new BadRequestException('File extension must be of type .pdf .');
    }

    return await this.documentsService.addNewDocument(
      createDocumentDto,
      user,
      res,
      file.buffer,
    );
  }
  @Get('filtered')
  @ApiQuery({ name: 'parameters', type: FilterDocumentsDto })
  async getDocumentsFiltered(@Query() filterDocumentsDto: FilterDocumentsDto) {
    return this.documentsService.getDocumentsFiltered(filterDocumentsDto);
  }
  @Get('/:id')
  async getDocumentById(@Param('id') id, @GetUser() user: User) {
    return await this.documentsService.getDocumentById(id, user);
  }
  @Get()
  async getAllDocuments() {
    return await this.documentsService.getAllDocuments();
  }

  @Delete('/:id')
  async deleteDocument(@Param('id') id: string, @GetUser() user: User) {
    return await this.documentsService.deleteDocument(id, user);
  }

  @Post('toggle-like/:id')
  @UseGuards(AuthGuard('jwt'))
  async toggleLike(@Param('id') id, @GetUser() user: User) {
    return this.documentsService.toggleLike(user, id);
  }
  @Get('check-if-liked/:id')
  @UseGuards(AuthGuard('jwt'))
  async checkIfLiked(@Param('id') id, @GetUser() user: User) {
    return this.documentsService.checkIfLiked(user, id);
  }
  /*
  @Patch()
  async updateDocument() {}
  */
}
