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
  async getFileByKeyAsStream(@Param('fileKey') fileKey, @Res() res) {
    const file = await this.filesService.getFileByKeyAsStream(fileKey, res);
    file.pipe(res);
  }
  @Get('url/:documentId')
  async getFileKeyAsUrl(
    @Param('documentId') documentId: string,
    @Res({ passthrough: true }) res,
  ): Promise<string> {
    const url = await this.filesService.getFileKeyAsUrl(documentId, res);
    //res.status(200).send(url);
    return url;
  }
  // @Get('url/:fileKey')
  // async getFileKeyAsUrl(
  //   @Param('fileKey') fileKey,
  //   @Res({ passthrough: true }) res,
  // ) {
  //   const url = await this.filesService.getFileKeyAsUrl(fileKey, res);
  //   //res.status(200).send(url);
  //   return url;
  // }
}
