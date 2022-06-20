import {
  InternalServerErrorException,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './createUser.dto';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './signinUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async addNewUser(createTaskDto: CreateUserDto): Promise<Object> {
    const { email, password, firstName, lastName } = createTaskDto;

    //hash te password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new this.userModel({
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
  async signInUser(
    signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    const { email, password } = signinUserDto;
    const user = await this.userModel.findOne({ email });
    if (user && bcrypt.compare(password, user.password)) {
      const payload: JwtPayload = { email };
      const accessToken: String = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials. ');
    }
  }
}
