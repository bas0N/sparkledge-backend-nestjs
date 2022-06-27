import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { Express } from 'express';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  //ghost method -- not used
  /*
  @UseInterceptors(FileInterceptor('file'))
  async addFile2(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.fileUpload(file.buffer);   
  }
  */
  //not yet implemented

  @Get('/:fileKey')
  async getFileById(@Param('fileKey') fileKey, @Res() res) {
    const file = await this.filesService.getFileById(fileKey, res);
    file.pipe(res);
  }
}
