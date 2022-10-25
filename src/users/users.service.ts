import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConflictException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signinUser.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '.prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import { CreateUserDto } from './dto/createUser.dto';
import { DocumentDto } from 'src/documents/dto/Document.dto';
import { EmailService } from 'src/email/email.service';
import handlebars from 'handlebars';
import {
  NumberOfPublishedDocsDto,
  UserWithoutDetails,
} from './dto/returnTypes.dto';
import { UpdateUserDataDto } from './dto/UpdateUserData.dto';
const fs = require('fs').promises;

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.getUserByEmail(email);
    const secret = user.password;
    //verify if the token is true
    const payload = this.jwtService.verify(token, { secret });
    if (typeof payload === 'object' && 'email' in payload) {
      //hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      //update the user object
      const user = this.prismaService.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
      return user;
    } else {
      throw new BadRequestException('Invalid token or email.');
    }
  }
  async sendForgotPasswordLink(email: string) {
    const user: User = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not found.');
    }
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: user.password,
      expiresIn: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME,
    });
    //link to react page
    const url = `https://www.sparkledge.pl/resetPassword/${user.email}/${token}`;
    const html = await fs.readFile(
      'src/email/templates/ForgotPasswordTemplate.html',
      'utf8',
    );

    //changing variables with handlebars
    var template = handlebars.compile(html);
    var replacements = {
      email: email,
      changePasswordLink: url,
    };
    var htmlToSend = template(replacements);
    return this.emailService.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'Sparkledge - przywróć hasło',
      html: htmlToSend,
    });
  }
  async addNewUser({
    email,
    password,
    firstName,
    lastName,
  }: CreateUserDto): Promise<User> {
    //hash te password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
        },
      });
      return user;
    } catch (error) {
      console.log(error);
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
      const payload: JwtPayload = {
        id: user.id,
        email,
        isVerified: user.isVerified,
      };
      const accessToken: string = await this.getJwtAccessToken(payload);
      //for refresh token added
      const refreshToken: string = await this.getJwtRefreshToken(payload);
      await this.setCurrentRefreshToken(refreshToken, email);
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      throw new UnauthorizedException('Invalid login credentials.');
    }
  }
  async getUserById(userId: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new InternalServerErrorException('Given user does not exist.');
    }
    delete user.password;
    return user;
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
  async updateUserData(updateUserDataDto: UpdateUserDataDto, user: User) {
    try {
      //check if the use is a moderator
      const isModerator = await this.prismaService.moderators.findUnique({
        where: { email: user.email },
      });
      console.log(user);
      console.log(isModerator);
      if (updateUserDataDto.userId === user.id || isModerator) {
        console.log(updateUserDataDto);
        console.log('fb url', updateUserDataDto.facebookUrl);
        const updatedUser = await this.prismaService.user.update({
          where: {
            id: updateUserDataDto.userId,
          },
          data: {
            facebookUrl: updateUserDataDto.facebookUrl,
            pinterestUrl: updateUserDataDto.pinterestUrl
              ? updateUserDataDto.pinterestUrl
              : user.pinterestUrl,
            instagramUrl: updateUserDataDto.instagramUrl
              ? updateUserDataDto.instagramUrl
              : user.instagramUrl,
            description: updateUserDataDto.description
              ? updateUserDataDto.description
              : user.description,
            linkedinUrl: updateUserDataDto.linkedinUrl
              ? updateUserDataDto.linkedinUrl
              : user.linkedinUrl,
          },
        });
        return {
          facebookUrl: updatedUser.facebookUrl,
          instagramUrl: updatedUser.instagramUrl,
          linkedInUrl: updatedUser.linkedinUrl,
          pinterestUrl: updatedUser.pinterestUrl,
          description: updatedUser.description,
        };
      } else {
        throw new BadRequestException(
          "You don't have enough permissions to perform this operation",
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getUserByIdWithoutDetails(userId: string): Promise<UserWithoutDetails> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException('User with the given id does not exist');
      }
      const userWithoutDetails: UserWithoutDetails = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: Role[user.role],
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        linkedinUrl: user.linkedinUrl,
        pinterestUrl: user.pinterestUrl,
        description: user.description,
        joinedAt: user.joinedAt,
      };
      console.log('retrieved user at', new Date());
      return userWithoutDetails;
    } catch (err) {
      throw new BadRequestException('User with the given id does not exist');
    }
  }
  async getUserByEmailWithoutDetails(
    userEmail: string,
  ): Promise<UserWithoutDetails> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });
      if (!user) {
        throw new BadRequestException('User with the given id does not exist');
      }
      const userWithoutDetails: UserWithoutDetails = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: Role[user.role],
        facebookUrl: user.facebookUrl,
        instagramUrl: user.instagramUrl,
        linkedinUrl: user.linkedinUrl,
        pinterestUrl: user.pinterestUrl,
        description: user.description,
        joinedAt: user.joinedAt,
      };
      return userWithoutDetails;
    } catch (err) {
      throw new BadRequestException('User with the given id does not exist');
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

  async getViewedDocuments(user: User): Promise<DocumentDto[]> {
    console.log(user);
    //finds user with the given id
    const userFound = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });
    //throws error if the user has not been found
    if (!userFound) {
      throw new BadRequestException(
        'User with the given id has not been found in the db.',
      );
    }
    //Change the for of array into numbers
    const arrOfNumId = userFound.viewedDocuments.map((str) => {
      return Number(str);
    });
    //return an array of elements for the corresponding array of ids
    const documents = await this.prismaService.document.findMany({
      where: {
        id: { in: arrOfNumId },
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    //returns the array of ids in the use object
    return documents;
  }

  async getPublishedDocumentsByUserId(userId: string): Promise<DocumentDto[]> {
    //finds user with the given id
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    //throws error if the user has not been found
    if (!userFound) {
      throw new BadRequestException(
        'User with the given id has not been found in the db.',
      );
    }
    const arrayOfDocuments = await this.prismaService.document.findMany({
      where: { userId: userFound.id },
      orderBy: {
        createdAt: 'desc',
      },
    });
    //returns the array of ids in the use object
    return arrayOfDocuments.slice(0, 9);
  }
  async getNumOfPublishedDocuments(
    userId: string,
  ): Promise<NumberOfPublishedDocsDto> {
    //finds user with the given id
    const userFound = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    //throws error if the user has not been found
    if (!userFound) {
      throw new BadRequestException(
        'User with the given id has not been found in the db.',
      );
    }
    const arrayOfDocuments = await this.prismaService.document.findMany({
      where: { userId: userFound.id },
      select: { id: true },
    });
    return { numOfDocumentsPublished: arrayOfDocuments.length };
  }
  async getPublishedDocuments(user: User): Promise<DocumentDto[]> {
    console.log(user);
    //finds user with the given id
    const userFound = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    const arrayOfDocuments = await this.prismaService.document.findMany({
      where: { userId: userFound.id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // //return an array of elements for the corresponding array of ids
    // const documents = await this.prismaService.document.findMany({
    //   where: {
    //     id: { in: arrOfNumId },
    //   },
    //   include: {
    //     user: {
    //       select: {
    //         email: true,
    //         firstName: true,
    //         lastName: true,
    //       },
    //     },
    //   },
    // });

    //returns the array of ids in the use object
    return arrayOfDocuments.slice(0, 9);
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
    const payload: JwtPayload = {
      id: user.id.toString(),
      email: userEmail,
      isVerified: user.isVerified,
    };

    const accessToken: string = await this.getJwtAccessToken(payload);
    //for refresh token added
    refreshToken = await this.getJwtRefreshToken(payload);
    await this.setCurrentRefreshToken(refreshToken, userEmail);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
  async markEmailAsVerified(email: string) {
    return this.prismaService.user.update({
      where: { email },
      data: { isVerified: true },
    });
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
