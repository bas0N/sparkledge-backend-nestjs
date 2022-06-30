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
  async getFileByIdAsStream(@Param('fileKey') fileKey, @Res() res) {
    const file = await this.filesService.getFileByIdAsStream(fileKey, res);
    file.pipe(res);
  }
  @Get('url/:fileKey')
  async getFileByIdAsUrl(
    @Param('fileKey') fileKey,
    @Res({ passthrough: true }) res,
  ) {
    const url = await this.filesService.getFileByIdAsUrl(fileKey, res);
    //res.status(200).send(url);
    return url;
  }
}
