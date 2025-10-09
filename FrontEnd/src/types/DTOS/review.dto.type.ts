export interface IReviewDTO {
  _id: string;
  courseId: string;
  learner: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  rating: number;
  comment: string;
  replies?: {
    menterId: string;
    name: string;
    profilePicture: string;
  };
  createdAt?: Date;
}
