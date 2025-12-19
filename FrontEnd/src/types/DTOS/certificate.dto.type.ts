export interface ICertificateDTO {
  _id: string;
  learnerId: string;
  courseId: string;
  programmTitle: string;
  certificateId: string;
  certificateUrl: string;
  preview_image: string;
  issuedDate: string;
  createAt?: Date;
  updatedAt?: Date;
}
