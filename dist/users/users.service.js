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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const email_service_1 = require("../email/email.service");
const handlebars_1 = require("handlebars");
const fs = require('fs').promises;
let UsersService = class UsersService {
    constructor(prismaService, jwtService, emailService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async resetPassword(email, token, newPassword) {
        const user = await this.getUserByEmail(email);
        const secret = user.password;
        const payload = this.jwtService.verify(token, { secret });
        if (typeof payload === 'object' && 'email' in payload) {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const user = this.prismaService.user.update({
                where: { email },
                data: { password: hashedPassword },
            });
            return user;
        }
        else {
            throw new common_1.BadRequestException('Invalid token or email.');
        }
    }
    async sendForgotPasswordLink(email) {
        const user = await this.getUserByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('Email not found.');
        }
        const payload = { email };
        const token = this.jwtService.sign(payload, {
            secret: user.password,
            expiresIn: process.env.JWT_FORGOT_PASSWORD_TOKEN_EXPIRATION_TIME,
        });
        const url = `https://www.sparkledge.pl/resetPassword/${user.email}/${token}`;
        const html = await fs.readFile('src/email/templates/ForgotPasswordTemplate.html', 'utf8');
        var template = handlebars_1.default.compile(html);
        var replacements = {
            email: email,
            changePasswordLink: url,
        };
        var htmlToSend = template(replacements);
        return this.emailService.sendMail({
            from: process.env.ZOHO_EMAIL,
            to: email,
            subject: 'Sparkledge - przywróć hasło',
            html: htmlToSend,
        });
    }
    async addNewUser({ email, password, firstName, lastName, }) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        try {
            const user = await this.prismaService.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                },
            });
            return user;
        }
        catch (error) {
            console.log(error);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_2.ConflictException('Email provided already exists.');
                }
            }
            throw new common_1.InternalServerErrorException();
        }
    }
    async signInUser(signinUserDto) {
        const { email, password } = signinUserDto;
        const user = await this.prismaService.user.findFirst({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const payload = {
                id: user.id,
                email,
                isVerified: user.isVerified,
            };
            const accessToken = await this.getJwtAccessToken(payload);
            const refreshToken = await this.getJwtRefreshToken(payload);
            await this.setCurrentRefreshToken(refreshToken, email);
            return { accessToken: accessToken, refreshToken: refreshToken };
        }
        else {
            throw new common_1.UnauthorizedException('Invalid login credentials.');
        }
    }
    async getUserById(userId) {
        const user = await this.prismaService.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.InternalServerErrorException('Given user does not exist.');
        }
        return user;
    }
    async getUserByEmail(email) {
        return await this.prismaService.user.findUnique({
            where: { email },
        });
    }
    async getUserByIdWithoutDetails(userId) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.BadRequestException('User with the given id does not exist');
            }
            const userWithoutDetails = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: client_1.Role[user.role],
            };
            return userWithoutDetails;
        }
        catch (err) {
            throw new common_1.BadRequestException('User with the given id does not exist');
        }
    }
    async getUserByEmailWithoutDetails(userEmail) {
        try {
            const user = await this.prismaService.user.findUnique({
                where: { email: userEmail },
            });
            if (!user) {
                throw new common_1.BadRequestException('User with the given id does not exist');
            }
            const userWithoutDetails = {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: client_1.Role[user.role],
            };
            return userWithoutDetails;
        }
        catch (err) {
            throw new common_1.BadRequestException('User with the given id does not exist');
        }
    }
    async logout(userEmail) {
        await this.prismaService.user.updateMany({
            where: { email: userEmail, refreshToken: { not: null } },
            data: { refreshToken: null },
        });
    }
    async getJwtAccessToken(payload) {
        const token = await this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`,
        });
        return token;
    }
    async getJwtRefreshToken(payload) {
        const token = await this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`,
        });
        return token;
    }
    async getViewedDocuments(user) {
        console.log(user);
        const userFound = await this.prismaService.user.findUnique({
            where: { id: user.id },
        });
        if (!userFound) {
            throw new common_1.BadRequestException('User with the given id has not been found in the db.');
        }
        const arrOfNumId = userFound.viewedDocuments.map((str) => {
            return Number(str);
        });
        const documents = await this.prismaService.document.findMany({
            where: {
                id: { in: arrOfNumId },
            },
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        return documents;
    }
    async getPublishedDocumentsByUserId(userId) {
        const userFound = await this.prismaService.user.findUnique({
            where: { id: userId },
        });
        if (!userFound) {
            throw new common_1.BadRequestException('User with the given id has not been found in the db.');
        }
        const arrayOfDocuments = await this.prismaService.document.findMany({
            where: { userId: userFound.id },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return arrayOfDocuments.slice(0, 9);
    }
    async getNumOfPublishedDocuments(userId) {
        const userFound = await this.prismaService.user.findUnique({
            where: { id: userId },
        });
        if (!userFound) {
            throw new common_1.BadRequestException('User with the given id has not been found in the db.');
        }
        const arrayOfDocuments = await this.prismaService.document.findMany({
            where: { userId: userFound.id },
            select: { id: true },
        });
        return { numOfDocumentsPublished: arrayOfDocuments.length };
    }
    async getPublishedDocuments(user) {
        console.log(user);
        const userFound = await this.prismaService.user.findUnique({
            where: { id: user.id },
        });
        const arrayOfDocuments = await this.prismaService.document.findMany({
            where: { userId: userFound.id },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return arrayOfDocuments.slice(0, 9);
    }
    async setCurrentRefreshToken(refreshToken, userEmail) {
        const salt = await bcrypt.genSalt();
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        await this.prismaService.user.update({
            where: { email: userEmail },
            data: { refreshToken: currentHashedRefreshToken },
        });
    }
    async getUserIfRefreshTokenMatches(refreshToken, email) {
        const user = await this.prismaService.user.findUnique({
            where: { email: email },
        });
        const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.refreshToken);
        if (isRefreshTokenMatching) {
            return user;
        }
    }
    async refreshToken(userEmail, refreshToken) {
        const user = await this.prismaService.user.findUnique({
            where: { email: userEmail },
        });
        if (!user) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        const refreshTokenMatches = bcrypt.compare(refreshToken, user.refreshToken);
        if (!refreshTokenMatches) {
            throw new common_1.ForbiddenException('Access denied.');
        }
        const payload = {
            id: user.id.toString(),
            email: userEmail,
            isVerified: user.isVerified,
        };
        const accessToken = await this.getJwtAccessToken(payload);
        refreshToken = await this.getJwtRefreshToken(payload);
        await this.setCurrentRefreshToken(refreshToken, userEmail);
        return { accessToken: accessToken, refreshToken: refreshToken };
    }
    async markEmailAsVerified(email) {
        return this.prismaService.user.update({
            where: { email },
            data: { isVerified: true },
        });
    }
};
UsersService = __decorate([
    (0, common_2.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map