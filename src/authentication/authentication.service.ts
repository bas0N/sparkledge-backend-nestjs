import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import VerificationTokenPayload from './verificationTokenPayload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
  public sendVerificationLink(email: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
      expiresIn: process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
    });
    const url = `${process.env.API_URL}/authentication/email?token=${token}`;
    const text = `Witamy w sparkledge. Żeby potwierdzić email, kliknij w link: ${url}`;
    return this.emailService.sendMail({
      from: process.env.ZOHO_EMAIL,
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }
  async validateEmail(token: string) {}
}
