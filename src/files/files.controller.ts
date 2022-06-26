import { Controller, Post, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post()
  async create(@Req() request, @Res() response) {
    try {
      await this.filesService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
