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
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  description: string;
};
