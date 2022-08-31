"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeStatusDto = void 0;
const openapi = require("@nestjs/swagger");
class LikeStatusDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { message: { required: true, type: () => String }, status: { required: true, type: () => Boolean } };
    }
}
exports.LikeStatusDto = LikeStatusDto;
//# sourceMappingURL=LikeStatus.dto.js.map