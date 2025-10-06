export interface IMentorDhasboardDTO {
  summary: IMentorDashboardData;
  revanue: number;
  topCourse: ITopCourse[];
}

export interface IMentorDashboardData {
  avgRating: number;
  totalStudents: number;
}

export interface IMentorTotalRevanue {
  _id: null;
  revenue: number;
}
export interface ITopCourse {
  courseId:string;
  title: string;
  enrolledStudent: number;
}
