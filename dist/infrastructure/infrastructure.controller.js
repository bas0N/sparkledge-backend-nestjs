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
const CreateFaculty_dto_1 = require("./dto/CreateFaculty.dto");
const CreateProgramme_dto_1 = require("./dto/CreateProgramme.dto");
const CreateCourse_dto_1 = require("./dto/CreateCourse.dto");
const passport_1 = require("@nestjs/passport");
const Course_dto_1 = require("./dto/Course.dto");
const Faculty_dto_1 = require("./dto/Faculty.dto");
const Programme_to_1 = require("./dto/Programme.to");
const University_dto_1 = require("./dto/University.dto");
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
    __metadata("design:paramtypes", [CreateFaculty_dto_1.CreateFacultyDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addFaculty", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('programme'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateProgramme_dto_1.CreateProgrammeDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addProgramme", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('course'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCourse_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "addCourse", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: University_dto_1.UniversityDto }),
    (0, common_1.Get)('universities'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getUniversities", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: Faculty_dto_1.FacultyDto }),
    (0, swagger_1.ApiParam)({
        name: 'universityId',
        description: 'Id of the university to which retrieved faculties belong.',
    }),
    (0, common_1.Get)('faculties/:universityId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/Faculty.dto").FacultyDto] }),
    __param(0, (0, common_1.Param)('universityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getFaculties", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: Programme_to_1.ProgrammeDto }),
    (0, swagger_1.ApiParam)({
        name: 'facultyId',
        description: 'Id of the faculty to which retrieved programmes belong.',
    }),
    (0, common_1.Get)('programmes/:facultyId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/Programme.to").ProgrammeDto] }),
    __param(0, (0, common_1.Param)('facultyId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InfrastructureController.prototype, "getProgrammes", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ type: Course_dto_1.CourseDto }),
    (0, swagger_1.ApiParam)({
        name: 'programmeId',
        description: 'Id of the programme to which retrieved courses belong.',
    }),
    (0, common_1.Get)('courses/:programmeId'),
    openapi.ApiResponse({ status: 200, type: [require("./dto/Course.dto").CourseDto] }),
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