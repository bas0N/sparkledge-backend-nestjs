import {
  Res,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { S3 } from 'aws-sdk';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import { File, User } from '@prisma/client';
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
  //returns a stream with a file (not fully developed)
  //the full functionality including changing viewed documents is present in:getFileKeyAsUrl method
  async getFileByKeyAsStream(documentId: string, @Res() res, user: User) {
    const s3 = new S3();
    //increments the views count in the document object
    const document = await this.prismaService.document.update({
      where: { id: Number(documentId) },
      data: {
        viewsNumber: {
          increment: 1,
        },
      },
    });
    if (!document) {
      throw new NotFoundException(
        'Document with the given id has not been found.',
      );
    }
    //find user whose array of viewed documents will be updated
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });
    if (!foundUser) {
      throw new NotFoundException(`User's object could not be found.`);
    }

    //check if the given element exists in the array
    const index = foundUser.viewedDocuments.indexOf(documentId);
    //if it exists, remove it and push one more time
    if (index > -1) {
      // only splice array when item is found
      foundUser.viewedDocuments.splice(index, 1); // 2nd parameter means remove one item only
    }
    //if the size of it is too big, remove the excess elements
    if (foundUser.viewedDocuments.length > 9) {
      //if it
      foundUser.viewedDocuments.splice(
        0,
        foundUser.viewedDocuments.length - 10,
      );
    }
    //ultimatelly, push element to the arrat
    foundUser.viewedDocuments.push(documentId);

    //update the user with the new array
    const userUpdated = await this.prismaService.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        viewedDocuments: {
          set: foundUser.viewedDocuments,
        },
      },
    });
    if (!userUpdated) {
      throw new InternalServerErrorException(
        `Error while updating user's object with a new array.`,
      );
    }

    //checks if the file exists with the given fileKey
    const foundFile = await this.prismaService.file.findUnique({
      where: { id: document.fileId },
    });
    if (!foundFile) {
      throw new NotFoundException(
        'File with id:' + document.fileId + ' has not been found.',
      );
    } else {
      console.log(foundFile);
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
  //returns an url to the desired file
  async getFileKeyAsUrl(documentId: string, @Res() res, user: User) {
    const s3 = new S3();
    //increments the views count in the document object
    const document = await this.prismaService.document.update({
      where: { id: Number(documentId) },
      data: {
        viewsNumber: {
          increment: 1,
        },
      },
    });

    //find user whose array of viewed documents will be updated
    const foundUser = await this.prismaService.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });
    if (!foundUser) {
      throw new NotFoundException(`User's object could not be found.`);
    }

    //check if the given element exists in the array
    const index = foundUser.viewedDocuments.indexOf(documentId);
    //if it exists, remove it and push one more time
    if (index > -1) {
      // only splice array when item is found
      foundUser.viewedDocuments.splice(index, 1); // 2nd parameter means remove one item only
    }
    //if the size of it is too big, remove the excess elements
    if (foundUser.viewedDocuments.length > 9) {
      //if it
      foundUser.viewedDocuments.splice(
        0,
        foundUser.viewedDocuments.length - 10,
      );
    }
    //ultimatelly, push element to the arrat
    foundUser.viewedDocuments.push(documentId);

    //update the user with the new array
    const userUpdated = await this.prismaService.user.update({
      where: {
        id: Number(user.id),
      },
      data: {
        viewedDocuments: {
          set: foundUser.viewedDocuments,
        },
      },
    });
    if (!userUpdated) {
      throw new InternalServerErrorException(
        `Error while updating user's object with a new array.`,
      );
    }

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
