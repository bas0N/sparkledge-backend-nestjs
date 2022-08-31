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
exports.FilterDocumentsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterDocumentsDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { universityId: { required: true, type: () => Object }, facultyId: { required: true, type: () => Object }, programmeId: { required: true, type: () => Object }, courseId: { required: true, type: () => Object }, sort: { required: true, type: () => Object } };
    }
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FilterDocumentsDto.prototype, "universityId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FilterDocumentsDto.prototype, "facultyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FilterDocumentsDto.prototype, "programmeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FilterDocumentsDto.prototype, "courseId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], FilterDocumentsDto.prototype, "sort", void 0);
exports.FilterDocumentsDto = FilterDocumentsDto;
//# sourceMappingURL=filter-documents.dto.js.map