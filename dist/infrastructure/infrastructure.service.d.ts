import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUniversityDto } from './dto/createUniversity.dto';
import { CreateFacultyDto } from './dto/createFaculty.dto';
import { CreateProgrammeDto } from './dto/createProgramme.dto';
import { CreateCourseDto } from './dto/createCourse.dto';
import { CourseDto } from './dto/course.dto';
import { ProgrammeDto } from './dto/programme.dto';
import { FacultyDto } from './dto/faculty.dto';
import { UniversityDto } from './dto/university.dto';
export declare class InfrastructureService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    addUniversity({ name }: CreateUniversityDto): import(".prisma/client").Prisma.Prisma__UniversityClient<import(".prisma/client").University>;
    addFaculty({ name, universityId }: CreateFacultyDto): import(".prisma/client").Prisma.Prisma__FacultyClient<import(".prisma/client").Faculty>;
    addProgramme({ name, universityId, facultyId }: CreateProgrammeDto): import(".prisma/client").Prisma.Prisma__ProgrammeClient<import(".prisma/client").Programme>;
    addCourse({ name, semester, universityId, facultyId, programmeId, courseType, degree, }: CreateCourseDto): import(".prisma/client").Prisma.Prisma__CourseClient<import(".prisma/client").Course>;
    getUniversities(): Promise<UniversityDto[]>;
    getFaculties(universityId: string): Promise<FacultyDto[]>;
    getProgrammes(facultyId: string): Promise<ProgrammeDto[]>;
    getCourses(programmeId: string): Promise<CourseDto[]>;
}
