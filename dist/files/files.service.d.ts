/// <reference types="node" />
/// <reference types="node" />
import { PrismaService } from 'src/prisma/prisma.service';
import { File, User } from '@prisma/client';
export declare class FilesService {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    fileUpload(dataBuffer: Buffer): Promise<File>;
    getFileByKeyAsStream(documentId: string, res: any, user: User): Promise<import("stream").Readable>;
    getFileKeyAsUrl(documentId: string, res: any, user: User): Promise<string>;
}
