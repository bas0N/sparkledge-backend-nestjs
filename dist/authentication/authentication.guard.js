"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationGuard = void 0;
const common_1 = require("@nestjs/common");
let EmailVerificationGuard = class EmailVerificationGuard {
    canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        console.log(request.user);
        if (!((_a = request.user) === null || _a === void 0 ? void 0 : _a.isVerified)) {
            throw new common_1.UnauthorizedException('Confirm your email first.');
        }
        return true;
    }
};
EmailVerificationGuard = __decorate([
    (0, common_1.Injectable)()
], EmailVerificationGuard);
exports.EmailVerificationGuard = EmailVerificationGuard;
//# sourceMappingURL=authentication.guard.js.map