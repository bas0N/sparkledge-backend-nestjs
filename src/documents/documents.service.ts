import { Injectable } from '@nestjs/common';
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
    try {
      const document = await this.documentModel.findOne({
        _id: Object(id),
      });

      //no courses found
      if (!document) {
        //error
        console.log('error');
        return;
      }
      //add view
      return document;
    } catch (err) {}
  }

  getAllDocuments() {
    return this.documents;
  }
}
