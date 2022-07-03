import { Injectable, NotFoundException, Req, Res } from '@nestjs/common';
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
}

/*
  

  updateDocument() {}
*/
