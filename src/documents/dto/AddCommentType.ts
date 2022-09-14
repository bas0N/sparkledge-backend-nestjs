type AddCommentType = {
  id: number;
  content: string;
  userId: string;
  documentId: number;
  likesNumber: number;
  createdAt: Date;
  author: {
    firstName: String;
    lastName: string;
  };
};

export { AddCommentType };
