import { CourseType } from '@prisma/client';
import { Degree } from '@prisma/client';
export declare class CourseDto {
    id: number;
    name: string;
    semester: number;
    programmeId: number;
    facultyId: number;
    universityId: number;
    courseType: CourseType;
    degree: Degree;
}
