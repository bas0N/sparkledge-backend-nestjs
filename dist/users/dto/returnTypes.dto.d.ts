import { Role } from '@prisma/client';
export declare type NumberOfPublishedDocsDto = {
    numOfDocumentsPublished: number;
};
export declare type UserWithoutDetails = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
};
