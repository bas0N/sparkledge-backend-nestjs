import {
  ForbiddenException,
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
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = signinUserDto;

    const user = await this.prismaService.user.findFirst({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.getJwtAccessToken(payload);
      //for refresh token added
      const refreshToken: string = await this.getJwtRefreshToken(payload);
      await this.setCurrentRefreshToken(refreshToken, email);
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials. ');
    }
  }
  async logout(userEmail: string) {
    await this.prismaService.user.updateMany({
      where: { email: userEmail, refreshToken: { not: null } },
      data: { refreshToken: null },
    });
  }

  async getJwtAccessToken(payload: JwtPayload) {
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
    });
    return token;
  }
  async getJwtRefreshToken(payload: JwtPayload) {
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
    });
    return token;
  }

  async setCurrentRefreshToken(refreshToken: string, userEmail: string) {
    const salt = await bcrypt.genSalt();
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
    await this.prismaService.user.update({
      where: { email: userEmail },
      data: { refreshToken: currentHashedRefreshToken },
    });
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }
  async refreshToken(userEmail: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: userEmail },
    });
    if (!user) {
      throw new ForbiddenException('Access denied.');
    }
    const refreshTokenMatches = bcrypt.compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied.');
    }
    const payload: JwtPayload = { email: userEmail };

    const accessToken: string = await this.getJwtAccessToken(payload);
    //for refresh token added
    refreshToken = await this.getJwtRefreshToken(payload);
    await this.setCurrentRefreshToken(refreshToken, userEmail);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  // async refresh(refreshStr: string): Promise<string | undefined> {
  //   // need to create this helper function.
  //   const refreshToken = await this.retrieveRefreshToken(refreshStr);
  //   if (!refreshToken) {
  //     return undefined;
  //   }

  //   const user = await this.userService.findOne(refreshToken.userId);
  //   if (!user) {
  //     return undefined;
  //   }

  //   const accessToken = {
  //     userId: refreshToken.userId,
  //   };

  //   // sign is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
  //   return sign(accessToken, process.env.ACCESS_SECRET, { expiresIn: '1h' });
  // }
  // private retrieveRefreshToken(refreshStr: string) {
  //   try {
  //     // verify is imported from jsonwebtoken like import { sign, verify } from 'jsonwebtoken';
  //     const decoded = bcrypt.compare(
  //       refreshStr,
  //       process.env.JWT_REFRESH_TOKEN_SECRET,
  //     );
  //     if (typeof decoded === 'string') {
  //       return undefined;
  //     }
  //     return Promise.resolve(
  //       this.refreshTokens.find((token) => token.id === decoded.id),
  //     );
  //   } catch (e) {
  //     return undefined;
  //   }
  // }
}
