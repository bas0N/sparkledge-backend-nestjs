import { FilesService } from './files.service';
import { User } from '@prisma/client';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    getFileKeyAsUrl(documentId: string, res: any, user: User): Promise<string>;
    getFileByKeyAsStream(documentId: string, res: any, user: User): Promise<void>;
}
