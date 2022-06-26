import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

@Injectable()
export class FilesService {
  constructor(private readonly prismaService: PrismaService) {}

  async fileUpload(dataBuffer: Buffer) {
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
    console.log(uploadResult);
    return { key: uploadResult.Key };
  }
  //not yet implemented
  /*
  async getFileById(fileKey: string) {
    const s3 = new S3();
    const stream = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      })
      .createReadStream();
    return {
      stream,
    };
  }
  */
}
