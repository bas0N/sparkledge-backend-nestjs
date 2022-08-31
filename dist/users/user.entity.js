"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEnt = void 0;
const openapi = require("@nestjs/swagger");
class UserEnt {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => Object }, password: { required: true, type: () => Object }, firstName: { required: true, type: () => Object }, lastName: { required: true, type: () => Object } };
    }
}
exports.UserEnt = UserEnt;
//# sourceMappingURL=user.entity.js.map