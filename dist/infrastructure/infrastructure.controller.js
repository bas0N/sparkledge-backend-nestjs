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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const infrastructure_service_1 = require("./infrastructure.service");
const swagger_1 = require("@nestjs/swagger");
const createUniversity_dto_1 = require("./dto/createUniversity.dto");
const createFaculty_dto_1 = require("./dto/createFaculty.dto");
const createProgramme_dto_1 = require("./dto/createProgramme.dto");
const createCourse_dto_1 = require("./dto/createCourse.dto");
const passport_1 = require("@nestjs/passport");
const course_dto_1 = require("./dto/course.dto");
const faculty_dto_1 = require("./dto/faculty.dto");
const programme_dto_1 = require("./dto/programme.dto");
const university_dto_1 = require("./dto/university.dto");
let InfrastructureController = class InfrastructureController {
    constructor(infrastructureService) {
        this.infrastructureService = infrastructureService;
    }
    addUniversity(createUniversityDto) {
        return this.infrastructureService.addUniversity(createUniversityDto);
    }
    addFaculty(createFacultyDto) {
        return this.infrastructureService.addFaculty(createFacultyDto);
    }
    addProgramme(createProgrammeDto) {
        return this.infrastructureService.addProgramme(createProgrammeDto);
    }
    addCourse(createCourseDto) {
        return this.infrastructureService.addCourse(createCourseDto);
    }
    getUniversities() {
        return this.infrastructureService.getUniversities();
    }
    getFaculties(universityId) {
        return this.infrastructureService.getFaculties(universityId);
    }
    getProgrammes(facultyId) {
        return this.infrastructureService.getProgrammes(facultyId);
    }
    getCourses(programmeId) {
        return this.infrastructureService.getCourses(programmeId);
    }
};
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('university'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createUniversity_dto_1.CreateUniversityDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addUniversity", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('faculty'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createFaculty_dto_1.CreateFacultyDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addFaculty", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('programme'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createProgramme_dto_1.CreateProgrammeDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addProgramme", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('course'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createCourse_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addCourse", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: university_dto_1.UniversityDto }),
    (0, common_1.Get)('universities'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getUniversities", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: faculty_dto_1.FacultyDto }),
    (0, swagger_1.ApiParam)({
        name: 'universityId',
        description: 'Id of the university to which retrieved faculties belong.',
    }),
    (0, common_1.Get)('faculties/:universityId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/faculty.dto").FacultyDto] }),
    __param(0, (0, common_1.Param)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getFaculties", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: programme_dto_1.ProgrammeDto }),
    (0, swagger_1.ApiParam)({
        name: 'facultyId',
        description: 'Id of the faculty to which retrieved programmes belong.',
    }),
    (0, common_1.Get)('programmes/:facultyId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/programme.dto").ProgrammeDto] }),
    __param(0, (0, common_1.Param)('facultyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getProgrammes", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: course_dto_1.CourseDto }),
    (0, swagger_1.ApiParam)({
        name: 'programmeId',
        description: 'Id of the programme to which retrieved courses belong.',
    }),
    (0, common_1.Get)('courses/:programmeId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/course.dto").CourseDto] }),
    __param(0, (0, common_1.Param)('programmeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getCourses", null);
InfrastructureController = __decorate([
    (0, swagger_1.ApiTags)('infrastructure'),
    (0, common_1.Controller)('infrastructure'),
    __metadata("design:paramtypes", [infrastructure_service_1.InfrastructureService])
], InfrastructureController);
exports.InfrastructureController = InfrastructureController;
//# sourceMappingURL=infrastructure.controller.js.map