import { Req, Res, Injectable, NotFoundException } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { File } from '@prisma/client';
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async fileUpload(dataBuffer: Buffer): Promise<File> {
    const s3 = new S3();
    //file is given a .pdf extension after the initial validation in documents controller
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        ACL: 'public-read',
        Key: (await uuid()) + '.pdf',
      })
      .promise();
    const createdFile: File = await this.prismaService.file.create({
      data: { key: uploadResult.Key },
    });
    console.log('the created file is result is:');
    console.log(createdFile);
    return createdFile;
  }
  //not yet implemented

  async getFileByKeyAsStream(fileKey: string, @Res() res) {
    const s3 = new S3();
    //checks if the file exists with the given fileKey
    const foundFile = await this.prismaService.file.findUnique({
      where: { key: fileKey },
    });
    if (!foundFile) {
      throw new NotFoundException(
        'File with id:' + fileKey + ' has not been found.',
      );
    } else {
      //creating a file stream to be returned
      const stream = await s3
        .getObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: foundFile.key,
        })
        .createReadStream();
      //returning the stream to the controller method
      return stream;
    }
    //it will be expanded for the array of files in the future
  }
  async getFileKeyAsUrl(documentId: string, @Res() res) {
    const s3 = new S3();
    //increments the views count
    const document = await this.prismaService.document.update({
      where: { id: Number(documentId) },
      data: {
        viewsNumber: {
          increment: 1,
        },
      },
    });

    //checks if the file exists with the given fileId (retrieved from the document)
    const foundFile = await this.prismaService.file.findUnique({
      where: { id: Number(document.fileId) },
    });
    if (!foundFile) {
      throw new NotFoundException(
        'File with id:' + document.fileId + ' has not been found.',
      );
    } else {
      //creating a signed url, allowing for file download
      //it is valid for 2 minutes (120 sec)
      const url: string = await s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Key: foundFile.key,
        Expires: 120,
      });
      //returns the url
      return url;
    }
    //it will be expanded for the array of files in the future
  }
}
