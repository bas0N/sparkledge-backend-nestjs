"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const email_service_1 = require("../email/email.service");
const users_service_1 = require("../users/users.service");
const handlebars_1 = require("handlebars");
const googleClient_1 = require("./googleClient");
const fs = require('fs').promises;
let AuthenticationService = class AuthenticationService {
    constructor(prismaService, jwtService, emailService, userService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.emailService = emailService;
        this.userService = userService;
    }
    async resendVerificationLink(email) {
        const user = await this.userService.getUserByEmail(email);
        if (user.isVerified) {
            throw new common_1.BadRequestException('User is already verified.');
        }
        await this.sendVerificationLink(email);
    }
    async sendVerificationLink(email) {
        const payload = { email };
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
            expiresIn: process.env.JWT_VERIFICATION_TOKEN_EXPIRATION_TIME,
        });
        const url = `https://www.sparkledge.pl/authentication/${token}`;
        const html = await fs.readFile('src/email/templates/VerifyEmailTemplate.html', 'utf8');
        var template = handlebars_1.default.compile(html);
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
    async validateEmailWithToken(token) { }
    async decodeInformationToken(token) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
            });
            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new common_1.BadRequestException();
        }
        catch (error) {
            if ((error === null || error === void 0 ? void 0 : error.name) === 'TokenExpiredError') {
                throw new common_1.BadRequestException('Email confirmation token expired');
            }
            throw new common_1.BadRequestException('Bad confirmation token');
        }
    }
    async confirmEmail(email) {
        const user = await this.userService.getUserByEmail(email);
        if (user.isVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        await this.userService.markEmailAsVerified(email);
    }
    async googleAuthenticate({ token }) {
        try {
            const ticket = await googleClient_1.googleClient.verifyIdToken({
                idToken: token,
                audience: `${process.env.GOOGLE_CLIENT_ID}`,
            });
            if (!ticket) {
                return new common_1.InternalServerErrorException('No user from google');
            }
            const ticketPayload = ticket.getPayload();
            const user = await this.userService.getUserByEmail(ticketPayload.email);
            console.log('user before else:');
            console.log(user);
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
                    throw new common_1.InternalServerErrorException('Error while adding new user.');
                }
                const payload = {
                    id: registeredUser.id,
                    email: registeredUser.email,
                    isVerified: registeredUser.isVerified,
                };
                console.log('payload when user does not exists');
                console.log(payload);
                const accessToken = await this.userService.getJwtAccessToken(payload);
                const refreshToken = await this.userService.getJwtRefreshToken(payload);
                await this.userService.setCurrentRefreshToken(refreshToken, registeredUser.email);
                return { accessToken: accessToken, refreshToken: refreshToken };
            }
            else {
                console.log('user in else');
                console.log(user);
                const payload = {
                    id: user.id,
                    email: user.email,
                    isVerified: true,
                };
                console.log('payload when user exists');
                console.log(payload);
                const accessToken = await this.userService.getJwtAccessToken(payload);
                const refreshToken = await this.userService.getJwtRefreshToken(payload);
                await this.userService.setCurrentRefreshToken(refreshToken, user.email);
                return { accessToken: accessToken, refreshToken: refreshToken };
            }
        }
        catch (err) {
            throw new common_1.InternalServerErrorException(err);
        }
    }
    async googleRedirect(req) {
        if (!req.user) {
            return new common_1.InternalServerErrorException('No user from google');
        }
        const user = await this.userService.getUserByEmail(req.user.email);
        const googleUser = req.user;
        console.log(req);
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
                throw new common_1.InternalServerErrorException('Error while adding new user.');
            }
            const payload = {
                id: registeredUser.id,
                email: registeredUser.email,
                isVerified: true,
            };
            const accessToken = await this.userService.getJwtAccessToken(payload);
            const refreshToken = await this.userService.getJwtRefreshToken(payload);
            await this.userService.setCurrentRefreshToken(refreshToken, registeredUser.email);
            return { accessToken: accessToken, refreshToken: refreshToken };
        }
        const payload = {
            id: user.id,
            email: user.email,
            isVerified: true,
        };
        const accessToken = await this.userService.getJwtAccessToken(payload);
        const refreshToken = await this.userService.getJwtRefreshToken(payload);
        await this.userService.setCurrentRefreshToken(refreshToken, user.email);
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService,
        users_service_1.UsersService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map