import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from '@prisma/client';
@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  //provide id of the document from which files are to be retrieved
  //method will increase its viewsNumber
  //signed url will be returned to the method

  @Get('url/:documentId')
  async getFileKeyAsUrl(
    @Param('documentId') documentId: string,
    @Res({ passthrough: true }) res,
    @GetUser() user: User,
  ): Promise<string> {
    console.log('files controlller');
    console.log(user);
    const url = await this.filesService.getFileKeyAsUrl(documentId, res, user);
    //res.status(200).send(url);
    return url;
  }
  //provide s3 fileKey
  //return filestream
  //(no views incrementation)
  @Get('stream/:documentId')
  async getFileByKeyAsStream(
    @Param('documentId') documentId: string,
    @Res() res,
    @GetUser() user: User,
  ) {
    const file = await this.filesService.getFileByKeyAsStream(
      documentId,
      res,
      user,
    );
    file.pipe(res);
  }
}
