import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '.prisma/client';
export const GetFileType = createParamDecorator(
  (data: Express.Multer.File, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
