import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
//import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document, File, Prisma, User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';
import { FilesService } from 'src/files/files.service';
import { FilterDocumentsDto } from './dto/filter-documents.dto';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesService: FilesService,
  ) {}
  async getDocumentsFiltered(
    parameters: FilterDocumentsDto,
  ): Promise<Document[]> {
    console.log(parameters.universityId);
    const documents: Array<Document> =
      await this.prismaService.document.findMany({
        where: {
          universityId: Number(parameters?.universityId) || undefined,
          facultyId: Number(parameters?.facultyId) || undefined,
          programmeId: Number(parameters?.programmeId) || undefined,
          courseId: Number(parameters?.courseId) || undefined,
        },
      });
    return documents;
  }

  async addNewDocument(
    document: Document,
    user: User,
    @Req() req,
    @Res() res,
    fileBuffer: Buffer,
  ): Promise<Document> {
    const {
      title,
      description,
      courseId,
      programmeId,
      facultyId,
      universityId,
    } = document;
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
          file: { connect: { id: createdFile.id } },
        },
      });
      return res.status(200).json({ document: createdDocument });
    } catch (error) {
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }
  async getDocumentById(id: string, user: User): Promise<Document> {
    //retrieve document from db
    const document = await this.prismaService.document.findUnique({
      where: { id: Number(id) },
    });
    //no courses found
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
    //add view
    return document;
  }
  async getDocumentsFile(id: string) {}
  async getAllDocuments(): Promise<Document[]> {
    const documents = await this.prismaService.document.findMany();
    return documents;
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
  async toggleLike(user: User, documentId: string) {
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
        },
      });
      if (!updatedDocument) {
        throw new BadRequestException(
          'Document with the given id has not been found',
        );
      }
      return { message: 'Document disliked.', status: false };
    }
    document.likesList.push(user.id.toString());
    console.log(document.likesList);
    const updatedDocument = await this.prismaService.document.update({
      where: { id: Number(documentId) },
      data: {
        likesList: {
          set: document.likesList,
        },
      },
    });
    console.log(updatedDocument);
    return { message: 'Document liked.', status: true };
  }
}

/*
  

  updateDocument() {}
*/
