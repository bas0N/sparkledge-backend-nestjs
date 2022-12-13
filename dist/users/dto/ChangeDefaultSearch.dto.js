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
exports.ChangeDefaultSearchDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
class ChangeDefaultSearchDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { universityId: { required: true, type: () => String }, facultyId: { required: true, type: () => String }, programmeId: { required: true, type: () => String }, courseId: { required: true, type: () => String }, sortPropety: { required: true, enum: SortPropety }, sortValue: { required: true, enum: SortValue }, degree: { required: true, type: () => Object }, courseType: { required: true, type: () => Object }, semester: { required: true, type: () => String } };
    }
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "universityId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "facultyId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "programmeId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "courseId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ChangeDefaultSearchDto.prototype, "sortPropety", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], ChangeDefaultSearchDto.prototype, "sortValue", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "degree", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "courseType", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChangeDefaultSearchDto.prototype, "semester", void 0);
exports.ChangeDefaultSearchDto = ChangeDefaultSearchDto;
var SortValue;
(function (SortValue) {
    SortValue[SortValue["asc"] = 0] = "asc";
    SortValue[SortValue["desc"] = 1] = "desc";
})(SortValue || (SortValue = {}));
var SortPropety;
(function (SortPropety) {
    SortPropety[SortPropety["createdAt"] = 0] = "createdAt";
    SortPropety[SortPropety["title"] = 1] = "title";
    SortPropety[SortPropety["viewsNumber"] = 2] = "viewsNumber";
    SortPropety[SortPropety["likesNumber"] = 3] = "likesNumber";
})(SortPropety || (SortPropety = {}));
//# sourceMappingURL=ChangeDefaultSearch.dto.js.map