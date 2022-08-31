import { University, Faculty, Programme, Course } from '.prisma/client';
import { InfrastructureService } from './infrastructure.service';
import { CreateUniversityDto } from './dto/createUniversity.dto';
import { CreateFacultyDto } from './dto/createFaculty.dto';
import { CreateProgrammeDto } from './dto/createProgramme.dto';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CourseDto } from './dto/course.dto';
import { FacultyDto } from './dto/faculty.dto';
import { ProgrammeDto } from './dto/programme.dto';
export declare class InfrastructureController {
    private infrastructureService;
    constructor(infrastructureService: InfrastructureService);
    addUniversity(createUniversityDto: CreateUniversityDto): Promise<University>;
    addFaculty(createFacultyDto: CreateFacultyDto): Promise<Faculty>;
    addProgramme(createProgrammeDto: CreateProgrammeDto): Promise<Programme>;
    addCourse(createCourseDto: CreateCourseDto): Promise<Course>;
    getUniversities(): Promise<University[]>;
    getFaculties(universityId: string): Promise<FacultyDto[]>;
    getProgrammes(facultyId: string): Promise<ProgrammeDto[]>;
    getCourses(programmeId: string): Promise<CourseDto[]>;
}
