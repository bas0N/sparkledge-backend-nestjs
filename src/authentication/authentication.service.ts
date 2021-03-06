import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
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
    const text = `Witamy w sparkledge. Żeby potwierdzić email, kliknij w link: ${url}`;
    return this.emailService.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'Email confirmation',
      text,
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
}
