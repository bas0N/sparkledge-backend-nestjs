import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUniversityDto } from './dto/CreateUniversity.dto';
import { CreateFacultyDto } from './dto/CreateFaculty.dto';
import { CreateProgrammeDto } from './dto/CreateProgramme.dto';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { CourseDto } from './dto/Course.dto';
import { ProgrammeDto } from './dto/Programme.to';
import { FacultyDto } from './dto/Faculty.dto';
import { UniversityDto } from './dto/University.dto';
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
