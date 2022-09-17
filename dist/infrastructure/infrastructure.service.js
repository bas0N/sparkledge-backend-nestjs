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
exports.InfrastructureService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InfrastructureService = class InfrastructureService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    addUniversity({ name }) {
        return this.prismaService.university.create({ data: { name } });
    }
    addFaculty({ name, universityId }) {
        universityId = Number(universityId);
        return this.prismaService.faculty.create({
            data: { name, university: { connect: { id: universityId } } },
        });
    }
    addProgramme({ name, universityId, facultyId }) {
        universityId = Number(universityId);
        facultyId = Number(facultyId);
        return this.prismaService.programme.create({
            data: {
                name,
                university: { connect: { id: universityId } },
                faculty: { connect: { id: facultyId } },
            },
        });
    }
    addCourse({ name, semester, universityId, facultyId, programmeId, courseType, degree, }) {
        return this.prismaService.course.create({
            data: {
                name,
                semester: Number(semester),
                university: { connect: { id: Number(universityId) } },
                faculty: { connect: { id: Number(facultyId) } },
                programme: { connect: { id: Number(programmeId) } },
                courseType,
                degree,
            },
        });
    }
    async getUniversities() {
        return this.prismaService.university.findMany();
    }
    async getFaculties(universityId) {
        return this.prismaService.faculty.findMany({
            where: { universityId: Number(universityId) },
        });
    }
    async getProgrammes(facultyId) {
        return this.prismaService.programme.findMany({
            where: { facultyId: Number(facultyId) },
        });
    }
    async getCourses(programmeId) {
        return this.prismaService.course.findMany({
            where: { programmeId: Number(programmeId) },
        });
    }
};
InfrastructureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InfrastructureService);
exports.InfrastructureService = InfrastructureService;
//# sourceMappingURL=infrastructure.service.js.map