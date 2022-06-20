import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.model';
import { UsersService } from './users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private userService: UsersService,
  ) {
    super({
      secretOrKey: process.env.SECRET_KEY_JWT,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JwtPayload): Promise<Object> {
    const { email } = payload;
    const user = await this.userModel.findOne({ email });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
