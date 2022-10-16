import { Role } from '@prisma/client';
export type NumberOfPublishedDocsDto = {
  numOfDocumentsPublished: number;
};

export type UserWithoutDetails = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
};
