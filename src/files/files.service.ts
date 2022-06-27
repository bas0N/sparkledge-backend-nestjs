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
    console.log(await uuid());
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
        Body: dataBuffer,
        ACL: 'public-read',
        Key: await uuid(),
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

  async getFileById(fileKey: string, @Res() res) {
    /*
    const s3 = new S3();
    //checks if the file exists with the given fileKey
    console.log(fileKey);
    
    const documentWithFile = await this.prismaService.document.findMany({
      select: { fileKey: fileKey },
    });
    
    //if it exists, it means that the file exists too
    //it will be expanded for the array of files in the future
    if (documentWithFile) {
      const stream = await s3
        .getObject({
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: (await documentWithFile).fileKey,
        })
        .createReadStream();
      //returning the stream to the controller method
      return stream;
      
    } else {
      //throw error if document has not been found
      throw new NotFoundException();
    }
  */
  }
}
