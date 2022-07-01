import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('files')
@UseGuards(AuthGuard())
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  //provide id of the document from which files are to be retrieved
  //method will increase its viewsNumber
  //signed url will be returned to download the file
  @Get('url/:documentId')
  async getFileKeyAsUrl(
    @Param('documentId') documentId: string,
    @Res({ passthrough: true }) res,
  ): Promise<string> {
    const url = await this.filesService.getFileKeyAsUrl(documentId, res);
    //res.status(200).send(url);
    return url;
  }
  //provide s3 fileKey
  //return filestream
  //(no views incrementation)
  @Get('stream/:fileKey')
  async getFileByKeyAsStream(@Param('fileKey') fileKey, @Res() res) {
    const file = await this.filesService.getFileByKeyAsStream(fileKey, res);
    file.pipe(res);
  }
}
