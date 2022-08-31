import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export declare class FilterDocumentsDto {
    universityId: string;
    facultyId: string;
    programmeId: string;
    courseId: string;
    sortPropety: SortPropety;
    sortValue: SortValue;
    degree: Degree;
    courseType: CourseType;
    semester: string;
}
declare enum SortValue {
    asc = 0,
    desc = 1
}
declare enum SortPropety {
    createdAt = 0,
    title = 1,
    viewsNumber = 2,
    likesNumber = 3
}
export {};
