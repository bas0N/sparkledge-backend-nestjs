import { InternalServerErrorException, Res } from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly documentModel: Model<User>,
  ) {}
  async addNewUser(createTaskDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createTaskDto;

    //hash te password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new this.documentModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    try {
      const result = await newUser.save();
      return result;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
