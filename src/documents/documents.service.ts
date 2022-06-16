import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Document } from './document.model';
@Injectable()
export class DocumentsService {
  private documents = [];

  constructor(
    @InjectModel('Document') private readonly documentModel: Model<Document>,
  ) {}

  async addNewDocument(
    title: string,
    description: string,
    createdBy: string,
    creatorEmail: string,
    viewsNum: number,
    likesNum: number,
  ) {
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

  getAllDocuments() {
    return this.documents;
  }
}
