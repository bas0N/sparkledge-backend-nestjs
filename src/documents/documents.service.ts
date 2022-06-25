import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrismaService } from 'src/prisma/prisma.service';
//import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { Document, Prisma, User } from '@prisma/client';
import { GetUser } from 'src/users/get-user.decorator';

@Injectable()
export class DocumentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async addNewDocument(document: Document, user: User): Promise<Document> {
    const {
      title,
      description,
      courseId,
      programmeId,
      facultyId,
      universityId,
      userId,
    } = document;
    return this.prismaService.document.create({
      data: {
        title,
        description,
        course: { connect: { id: Number(courseId) } },
        university: { connect: { id: Number(universityId) } },
        faculty: { connect: { id: Number(facultyId) } },
        programme: { connect: { id: Number(programmeId) } },
        user: { connect: { id: user.id } },
      },
    });
  }
}
/*
  async getDocumentById(id: string) {
    const document = await this.documentModel.findOne({
      _id: Object(id),
    });
    console.log(document);
    //no courses found
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
    //add view
    return document;
  }

  async getAllDocuments() {
    const documents = await this.documentModel.find();
    return this.documents;
  }
  async deleteDocument(id: string) {
    const document = await this.documentModel.findOneAndDelete({
      _id: Object(id),
    });
    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found.`);
    }
    return document;
  }
  updateDocument() {}
*/
