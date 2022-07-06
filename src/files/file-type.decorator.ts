import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const GetFileType = createParamDecorator(
  (data: Express.Multer.File, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
