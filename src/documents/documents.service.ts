import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
//import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document, File, User } from '@prisma/client';
import { FilesService } from 'src/files/files.service';
import { FilterDocumentsDto } from './dto/FilterDocuments.dto';
import { DocumentDto } from './dto/Document.dto';
import { LikeStatusDto } from './dto/LikeStatus.dto';
import { UpdateDocumentDto } from './dto/UpdateDocument.dto';
import { AddCommentDto } from './dto/AddComment.dto';
import { Comment } from '.prisma/client';
@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesService: FilesService,
  ) {}

  async updateDocument(updateDocumentDto: UpdateDocumentDto, user: User) {
    const userDb = await this.prismaService.user.findUnique({
      where: { email: user.email },
    });
    if (!userDb) {
      throw new BadRequestException('User not found.');
    }
    if (Number(updateDocumentDto.id) !== userDb.id) {
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
          user: { connect: { id: Number(user.id) } },
          file: { connect: { id: Number(createdFile.id) } },
          createdAt: date,
        },
      });
      return createdDocument;
    } catch (error) {
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
  async addComment(user: User, comment: AddCommentDto): Promise<Comment> {
    const { documentId, content } = comment;
    const date = new Date();
    date.setHours(date.getHours() + 2);
    try {
      const comment = await this.prismaService.comment.create({
        data: {
          author: { connect: { id: Number(user.id) } },
          document: { connect: { id: Number(documentId) } },
          content,
          createdAt: date,
        },
      });
      return comment;
    } catch (err) {
      throw new Error(err);
    }
  }
  async getComments(id: string) {
    try {
      const comments: Comment[] = await this.prismaService.document
        .findUnique({ where: { id: Number(id) } })
        .comments();
      return comments;
    } catch (err) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
  }

  async deleteDocument(id: string, user: User) {
    try {
      await this.prismaService.document.delete({
        where: { id: Number(id) },
      });
    } catch (err) {
      throw new NotFoundException(`Document with id ${id} not found.`);
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
}

/*
  

  updateDocument() {}
*/
