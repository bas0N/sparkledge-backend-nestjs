import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import handlebars from 'handlebars';
import { JwtPayload } from 'src/users/jwt-payload.interface';
import { GoogleAuthenticateDto } from './dto/GoogleAuthenticate.dto';
import { googleClient } from './googleClient';
const fs = require('fs').promises;

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userService: UsersService,
  ) {}

  async resendVerificationLink(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user.isVerified) {
      throw new BadRequestException('User is already verified.');
    }
    await this.sendVerificationLink(email);
  }

  async sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      expiresIn: process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
    });
    const url = `https://www.sparkledge.pl/authentication/${token}`;

    const html = await fs.readFile(
      'src/email/templates/VerifyEmailTemplate.html',
      'utf8',
    );

    //changing variables with handlebars
    var template = handlebars.compile(html);
    var replacements = {
      email: email,
      verificationLink: url,
    };
    var htmlToSend = template(replacements);

    return this.emailService.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'Sparkledge - potwierdź adres email',
      html: htmlToSend,
    });
  }
  async validateEmailWithToken(token: string) {}
  async decodeInformationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }
  async confirmEmail(email: string) {
    const user = await this.userService.getUserByEmail(email);
    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }
    await this.userService.markEmailAsVerified(email);
  }
  async googleAuthenticate({ token }: GoogleAuthenticateDto) {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: `${process.env.GOOGLE_CLIENT_ID}`,
      });
      if (!ticket) {
        return new InternalServerErrorException('No user from google');
      }
      const ticketPayload = ticket.getPayload();

      const user = await this.userService.getUserByEmail(ticketPayload.email);

      if (!user) {
        const registeredUser = await this.prismaService.user.create({
          data: {
            email: ticketPayload.email,
            firstName: ticketPayload.name,
            lastName: ticketPayload.given_name,
            password: 'null',
            isVerified: true,
            registeredBy: 'GOOGLE',
          },
        });

        if (!registeredUser) {
          throw new InternalServerErrorException(
            'Error while adding new user.',
          );
        }

        const payload: JwtPayload = {
          id: registeredUser.id,
          email: registeredUser.email,
          isVerified: registeredUser.isVerified,
        };

        const accessToken: string = await this.userService.getJwtAccessToken(
          payload,
        );

        //for refresh token added
        const refreshToken: string = await this.userService.getJwtRefreshToken(
          payload,
        );

        await this.userService.setCurrentRefreshToken(
          refreshToken,
          registeredUser.email,
        );
        return { accessToken: accessToken, refreshToken: refreshToken };
      } else {
        const payload: JwtPayload = {
          id: user.id,
          email: user.email,
          isVerified: true,
        };
        const accessToken: string = await this.userService.getJwtAccessToken(
          payload,
        );

        //for refresh token added
        const refreshToken: string = await this.userService.getJwtRefreshToken(
          payload,
        );
        await this.userService.setCurrentRefreshToken(refreshToken, user.email);
        return { accessToken: accessToken, refreshToken: refreshToken };
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async googleRedirect(req) {
    if (!req.user) {
      return new InternalServerErrorException('No user from google');
    }
    const user = await this.userService.getUserByEmail(req.user.email);
    const googleUser = req.user;
    if (!user) {
      const registeredUser = await this.prismaService.user.create({
        data: {
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          password: 'null',
          isVerified: true,
          registeredBy: 'GOOGLE',
        },
      });

      if (!registeredUser) {
        throw new InternalServerErrorException('Error while adding new user.');
      }

      const payload: JwtPayload = {
        id: registeredUser.id,
        email: registeredUser.email,
        isVerified: true,
      };

      const accessToken: string = await this.userService.getJwtAccessToken(
        payload,
      );

      //for refresh token added
      const refreshToken: string = await this.userService.getJwtRefreshToken(
        payload,
      );
      await this.userService.setCurrentRefreshToken(
        refreshToken,
        registeredUser.email,
      );
      return { accessToken: accessToken, refreshToken: refreshToken };
    }
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      isVerified: true,
    };

    const accessToken: string = await this.userService.getJwtAccessToken(
      payload,
    );
    //for refresh token added
    const refreshToken: string = await this.userService.getJwtRefreshToken(
      payload,
    );
    await this.userService.setCurrentRefreshToken(refreshToken, user.email);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
