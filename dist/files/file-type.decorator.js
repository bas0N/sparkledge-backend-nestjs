"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFileType = void 0;
const common_1 = require("@nestjs/common");
exports.GetFileType = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
//# sourceMappingURL=file-type.decorator.js.map