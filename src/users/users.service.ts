import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly documentModel: Model<User>,
  ) {}
  async addNewUser(createTaskDto: CreateUserDto) {
    const { email, password, firstName, lastName } = createTaskDto;
    const newUser = new this.documentModel({
      email,
      password,
      firstName,
      lastName,
    });
    try {
      const result = await newUser.save();
    } catch (error) {
      console.log(error.code);
      //correct for the approporiate error, console log it
      if (error.code === 33) {
        throw new ConflictException('Email already exists');
      }
    }
  }
}
