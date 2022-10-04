import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
//import { Document } from './document.model';
import { CreateDocumentDto } from './dto/CreateDocument.dto';
import { Document, File, User } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FilterDocumentsDto } from './dto/FilterDocuments.dto';
import { DocumentDto } from './dto/Document.dto';
import { LikeStatusDto } from './dto/LikeStatus.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { AddCommentDto } from './dto/AddComment.dto';
import { Comment } from '.prisma/client';
import { AddReportDto } from './dto/AddReport.dto';
import { sendMessage } from 'src/slack/slackBot';
import { AddCommentType } from './dto/AddCommentType';
import { S3 } from 'aws-sdk';
import { IsPermitted } from './dto/IsPermitted.dto';
@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesService: FilesService,
  ) {}

  async getMostPopular() {
    try {
      const documents = this.prismaService.document.findMany({
        orderBy: { viewsNumber: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      if (!documents) {
        throw new InternalServerErrorException('No documents found.');
      }

      const documentsModified = (await documents).map((document) => {
        return {
          id: document.id,
          title: document.title,
          createdAt: document.createdAt,
          viewsNumber: document.viewsNumber,
          likesNumber: document.likesNumber,
          user: {
            firstName: document.user.firstName,
            lastName: document.user.lastName,
          },
        };
      });
      return documentsModified;
    } catch (err) {
      console.log(err);
    }
  }
  async getMostLiked() {
    try {
      const documents = this.prismaService.document.findMany({
        orderBy: { likesNumber: 'desc' },
        take: 10,
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      if (!documents) {
        throw new InternalServerErrorException('No documents found.');
      }
      const documentsModified = (await documents).map((document) => {
        return {
          id: document.id,
          title: document.title,
          createdAt: document.createdAt,
          viewsNumber: document.viewsNumber,
          likesNumber: document.viewsNumber,
          user: {
            firstName: document.user.firstName,
            lastName: document.user.lastName,
          },
        };
      });
      return documentsModified;
    } catch (err) {
      console.log(err);
    }
  }

  async addReport(addReportData: AddReportDto, user: User) {
    const { documentId, reportType, content } = addReportData;
    try {
      const document = this.prismaService.document.findFirst({
        where: { id: Number(documentId) },
      });
      if (!document) {
        throw new BadRequestException('Invalid document Id');
      }
      console.log('send message response');

      const currentDate = new Date();
      const report = await this.prismaService.report.create({
        data: {
          documentId: Number(documentId),
          userId: user.id,
          reportType,
          content,
          createdAt: currentDate,
        },
      });
      if (!report) {
        throw new InternalServerErrorException('Report not added.');
      }
      await sendMessage(
        user.id,
        user.email,
        documentId.toString(),
        report.id,
        reportType,
        content,
        currentDate,
      );

      return report;
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateDocument(updateDocumentDto: UpdateDocumentDto, user: User) {
    const userDb = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userDb) {
      throw new BadRequestException('User not found.');
    }
    if (updateDocumentDto.id !== userDb.id) {
      throw new BadRequestException(
        'You do not own this material - cannot update.',
      );
    }
    return this.prismaService.document.update({
      where: { id: Number(updateDocumentDto.id) },
      data: {
        title: updateDocumentDto?.title,
        description: updateDocumentDto?.description,
      },
    });
  }

  async getDocumentsFiltered(
    filterDocumentsDto: FilterDocumentsDto,
  ): Promise<Document[]> {
    const sortProperties = {};
    sortProperties[filterDocumentsDto.sortPropety] =
      filterDocumentsDto.sortValue;

    console.log(sortProperties);
    const documents: Array<Document> =
      await this.prismaService.document.findMany({
        where: {
          universityId: Number(filterDocumentsDto?.universityId) || undefined,
          facultyId: Number(filterDocumentsDto?.facultyId) || undefined,
          programmeId: Number(filterDocumentsDto?.programmeId) || undefined,
          courseId: Number(filterDocumentsDto?.courseId) || undefined,
          course: {
            is: {
              semester: Number(filterDocumentsDto?.semester) || undefined,
              degree: filterDocumentsDto?.degree || undefined,
              courseType: filterDocumentsDto?.courseType || undefined,
            },
          },
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: sortProperties,
      });
    return documents;
  }

  async addNewDocument(
    document: CreateDocumentDto,
    user: User,
    fileBuffer: Buffer,
  ): Promise<DocumentDto> {
    const {
      title,
      description,
      courseId,
      programmeId,
      facultyId,
      universityId,
    } = document;
    const date = new Date();
    date.setHours(date.getHours() + 2);
    try {
      //upload document to s3 and postgres
      //retrieve object with file id in postgres and s3 key
      const createdFile: File = await this.filesService.fileUpload(fileBuffer);
      //create a document in the db, attach user and fileKey
      const createdDocument = await this.prismaService.document.create({
        data: {
          title,
          description,
          course: { connect: { id: Number(courseId) } },
          university: { connect: { id: Number(universityId) } },
          faculty: { connect: { id: Number(facultyId) } },
          programme: { connect: { id: Number(programmeId) } },
          user: { connect: { id: user.id } },
          file: { connect: { id: Number(createdFile.id) } },
          createdAt: date,
        },
      });
      return createdDocument;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error during document upload.');
    }
  }

  async getDocumentById(id: string, user: User): Promise<Document> {
    //retrieve document from db
    const document = await this.prismaService.document.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    //no courses found
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
    //add view
    return document;
  }

  async getAllDocuments(): Promise<Document[]> {
    const documents = await this.prismaService.document.findMany();
    return documents;
  }
  async addComment(
    user: User,
    comment: AddCommentDto,
  ): Promise<AddCommentType> {
    const { documentId, content } = comment;
    const date = new Date();
    date.setHours(date.getHours() + 2);
    try {
      const comment = await this.prismaService.comment.create({
        data: {
          author: { connect: { id: user.id } },
          document: { connect: { id: Number(documentId) } },
          content,
          createdAt: date,
        },
      });
      const returnComment: AddCommentType = {
        ...comment,
        author: { firstName: user.firstName, lastName: user.lastName },
      };

      return returnComment;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getComments(id: string) {
    try {
      const comments: Comment[] = await this.prismaService.document
        .findUnique({
          where: { id: Number(id) },
        })
        .comments({
          include: {
            author: {
              select: {
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });
      return comments;
    } catch (err) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
  }
  async deleteComment(user: User, id: string) {
    try {
      const comment = await this.prismaService.comment.findUnique({
        where: { id: Number(id) },
      });
      //check if the use is a moderator
      const isModerator = await this.prismaService.moderators.findUnique({
        where: { email: user.email },
      });
      if (comment.userId === user.id || isModerator) {
        const commentDeleted = await this.prismaService.comment.delete({
          where: { id: Number(id) },
        });
        return commentDeleted;
      }
      throw new UnauthorizedException(
        `You are not the creator of the comment with id ${id}, thus you cannot delete it.`,
      );
    } catch (err) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }
  }

  async deleteDocument(id: string, user: User) {
    try {
      const document = await this.prismaService.document.findUnique({
        where: { id: Number(id) },
      });
      if (!document) {
        throw new BadRequestException(
          'Document with the given id does not exist.',
        );
      }
      //check if the use is a moderator
      const isModerator = await this.prismaService.moderators.findUnique({
        where: { email: user.email },
      });

      //check if user owns the document or if simply moderator wants to delete it
      if (document.userId === user.id || isModerator) {
        // console.log('document: ',document);
        const s3 = new S3();
        //file is given a .pdf extension after the initial validation in documents controller

        const file = await this.prismaService.file.findUnique({
          where: { id: Number(document.fileId) },
        });
        var params = {
          Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
          Key: file.key,
        };

        s3.deleteObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log('object deleted succesfully');
          }
        });
        await this.prismaService.comment.deleteMany({
          where: { documentId: document.id },
        });
        return await this.prismaService.document.delete({
          where: { id: Number(id) },
        });
      } //else, throw an error
      else {
        throw new UnauthorizedException(
          'You are not permited to delete this document.',
        );
      }
    } catch (err) {
      throw new NotFoundException(err);
    }
  }

  async toggleLike(user: User, documentId: string): Promise<LikeStatusDto> {
    const document: Document = await this.prismaService.document.findUnique({
      where: { id: Number(documentId) },
    });
    //check if the document exist
    if (!document) {
      throw new BadRequestException(
        `Document of id: ${documentId} has not been found.`,
      );
    }
    //check if the given element exists in the array
    const index = document.likesList.indexOf(user.id.toString());
    //if it exists, remove it and push one more time
    if (index > -1) {
      // only splice array when item is found
      document.likesList.splice(index, 1); // 2nd parameter means remove one item only
      //update the document object
      const updatedDocument = await this.prismaService.document.update({
        where: { id: Number(documentId) },
        data: {
          likesList: {
            set: document.likesList,
          },
          likesNumber: {
            decrement: 1,
          },
        },
      });
      if (!updatedDocument) {
        throw new InternalServerErrorException('Document not updated.');
      }
      return { message: 'Document disliked.', status: false };
    }
    document.likesList.push(user.id.toString());
    const updatedDocument = await this.prismaService.document.update({
      where: { id: Number(documentId) },
      data: {
        likesList: {
          set: document.likesList,
        },
        likesNumber: {
          increment: 1,
        },
      },
    });

    if (!updatedDocument) {
      throw new InternalServerErrorException('Document not updated.');
    }
    return { message: 'Document liked.', status: true };
  }

  async checkIfLiked(user: User, documentId: string): Promise<LikeStatusDto> {
    const document = await this.prismaService.document.findUnique({
      where: { id: Number(documentId) },
    });
    if (!document) {
      throw new BadRequestException(
        `Document of id: ${documentId} has not been found.`,
      );
    }
    const index = document.likesList.indexOf(user.id.toString());
    if (index > -1) {
      return {
        message: `Document of id: ${documentId} is liked by the user of id: ${user.id}.`,
        status: true,
      };
    } else {
      return {
        message: `Document of id: ${documentId} is not liked by the user of id: ${user.id}.`,
        status: false,
      };
    }
  }

  async isPermittedToDeleteDocument(
    documentId: string,
    user: User,
  ): Promise<IsPermitted> {
    try {
      const isModerator = await this.prismaService.moderators.findUnique({
        where: { email: user.email },
      });
      if (isModerator) {
        return { isPermitted: true };
      }
      const document = await this.prismaService.document.findUnique({
        where: { id: Number(documentId) },
      });
      console.log('document: ', JSON.stringify(document));
      if (!document) {
        throw new BadRequestException(
          'Unable to find document with the given id.',
        );
      }
      if (document.userId === user.id) {
        return { isPermitted: true };
      }
      return { isPermitted: false };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async isPermittedToDeleteComment(
    commentId: string,
    user: User,
  ): Promise<IsPermitted> {
    try {
      const isModerator = await this.prismaService.moderators.findUnique({
        where: { email: user.email },
      });
      if (isModerator) {
        return { isPermitted: true };
      }
      const comment = await this.prismaService.comment.findUnique({
        where: { id: Number(commentId) },
      });
      if (!comment) {
        throw new BadRequestException(
          'Unable to find comment with the given id.',
        );
      }
      if (comment.userId === user.id) {
        return { isPermitted: true };
      }
      return { isPermitted: false };
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
