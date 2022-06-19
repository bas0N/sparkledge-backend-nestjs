import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from './document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
@Injectable()
export class DocumentsService {
  private documents = [];

  constructor(
    @InjectModel('Document') private readonly documentModel: Model<Document>,
  ) {}

  async addNewDocument(createTaskDto: CreateDocumentDto) {
    const { title, description, createdBy, creatorEmail, viewsNum, likesNum } =
      createTaskDto;

    const newDocument = new this.documentModel({
      title,
      description,
      createdBy,
      creatorEmail,
      viewsNum,
      likesNum,
    });
    const result = await newDocument.save();
    console.log(result);
    return result.id;
  }
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
}
