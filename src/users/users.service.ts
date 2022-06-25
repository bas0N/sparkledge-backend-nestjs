import {
  InternalServerErrorException,
  Res,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEnt } from './user.entity';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signinUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async addNewUser({
    email,
    password,
    firstName,
    lastName,
  }: User): Promise<User> {
    //hash te password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.prismaService.user.create({
        data: { email, password: hashedPassword, firstName, lastName },
      });
      return user;
    } catch (error) {
      console.log(error.code);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email provided already exists.');
        }
      }
      throw new InternalServerErrorException();
    }
  }

  async signInUser(
    signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: String }> {
    const { email, password } = signinUserDto;

    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: String = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials. ');
    }
  }
}
